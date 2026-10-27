// Cleans a Figma SVG export of a single text layer (outlined glyphs) for the site:
// drops the export's preview background, the page frame rect and clip paths,
// keeps the glyph path(s) and their gradient, and prints where the SVG box sits
// in the Figma frame (from the frame rect's translate).
//
//   node tools/clean-text-svg.mjs <in.svg> <out.svg>
import { readFileSync, writeFileSync } from 'node:fs';

const [input, output] = process.argv.slice(2);
const src = readFileSync(input, 'utf8');
const [, w, h] = src.match(/<svg width="([\d.]+)" height="([\d.]+)"/);
const frame = src.match(/<rect width="1920" height="\d+" transform="translate\(([-\d.]+) ([-\d.]+)\)"/);
const paths = src.match(/<path[\s\S]*?\/>/g) || [];
const defs = (src.match(/<(linearGradient|radialGradient)[\s\S]*?<\/\1>/g) || []);
const out = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" fill="none">\n`
  + paths.map((p) => p.replace(/\sid="[^"]*"/, '')).join('\n')
  + (defs.length ? `\n<defs>\n${defs.join('\n')}\n</defs>` : '') + '\n</svg>\n';
writeFileSync(output, out);
console.log(`${output}: ${w}×${h}, ${paths.length} path(s), frame offset ${frame ? `x=${-frame[1]} y=${-frame[2]}` : 'n/a (not under the frame clip)'}`);
