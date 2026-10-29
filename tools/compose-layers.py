# Stacks Figma image layers into one transparent PNG, the way the layout draws them
# (e.g. a puppy over a second copy that carries the shadow under its paws).
#
#   python3 tools/compose-layers.py            # builds every entry of tools/compose.config.json
#
# Each entry: "out" (written to ../maltipo-originals/images/<out>.png), "scale" (output px per
# Figma px) and "layers", bottom first. A layer is a Figma box {x, y, w, h} plus its source file
# (../maltipo-originals/figma-assets/...) and, for cropped fills, "crop": the image's left / top /
# width / height in % of the box (the generated code's `left-[-25.39%] w-[125.43%]` values).
# The canvas is the union of the layer boxes.
import json, os
from PIL import Image

ROOT = os.path.dirname(os.path.abspath(__file__))
ORIG = os.path.normpath(os.path.join(ROOT, '..', '..', 'maltipo-originals'))

def build(entry):
    layers = entry['layers']
    x0 = min(l['x'] for l in layers); y0 = min(l['y'] for l in layers)
    x1 = max(l['x'] + l['w'] for l in layers); y1 = max(l['y'] + l['h'] for l in layers)
    s = entry['scale']
    canvas = Image.new('RGBA', (round((x1 - x0) * s), round((y1 - y0) * s)))
    for l in layers:
        src = Image.open(os.path.join(ORIG, l['src'])).convert('RGBA')
        bw, bh = round(l['w'] * s), round(l['h'] * s)
        c = l.get('crop', [0, 0, 100, 100])
        iw, ih = round(bw * c[2] / 100), round(bh * c[3] / 100)
        img = src.resize((iw, ih), Image.LANCZOS)
        box = Image.new('RGBA', (bw, bh))
        box.paste(img, (round(bw * c[0] / 100), round(bh * c[1] / 100)))
        canvas.alpha_composite(box, (round((l['x'] - x0) * s), round((l['y'] - y0) * s)))
    out = os.path.join(ORIG, 'images', entry['out'] + '.png')
    canvas.save(out)
    print(f"{entry['out']}: {canvas.size[0]}x{canvas.size[1]} (Figma box {x0},{y0} {x1 - x0:.1f}x{y1 - y0:.1f})")

for entry in json.load(open(os.path.join(ROOT, 'compose.config.json'))):
    build(entry)
