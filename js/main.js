(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var lenis = null;

  // Scroll animations: selector → AOS effect. Custom effects (reveal, draw,
  // rise, pop) are defined in style.css → "Animations".
  // stagger: delay step per matched element; staggerGroup: restart the stagger every N items.
  // Nothing inside sliders animates (only the slider containers), and buttons
  // are animated through their wrappers (AOS overrides their hover transitions).
  var ANIMATIONS = [
    { selector: '.header__inner > *', effect: 'fade-down', delay: 200, stagger: 60 },
    { selector: '.hero__tag', effect: 'fade-up', delay: 300 },
    { selector: '.hero__title', effect: 'fade-up', delay: 400, duration: 1200 },
    { selector: '.hero__actions', effect: 'fade-up', delay: 650 },
    { selector: '.hero__dot', effect: 'pop', delay: 900 },
    { selector: '.hero__line', effect: 'draw', delay: 1000, duration: 1200 },
    { selector: '.hero__note-text', effect: 'fade-left', delay: 1100 },

    { selector: '.why__lead', effect: 'fade-right' },
    // .why__number, .catalog__title, .faq__title: no entrance, they only drift sideways (SCRUB)
    { selector: '.why__puppy', effect: 'rise', delay: 200, duration: 1400 },
    { selector: '.why__tail', effect: 'fade-left', delay: 300 },
    { selector: '.why__nav', effect: 'fade-up' },
    { selector: '.why__slider', effect: 'fade-left', duration: 1200 },

    { selector: '.eyes__card', effect: 'reveal', duration: 1400 },
    { selector: '.eyes__kicker, .eyes__title', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.eyes__dots', effect: 'draw', delay: 400, duration: 1600 },
    { selector: '.eyes__pill', effect: 'fade-left', delay: 500, stagger: 200 },
    { selector: '.eyes__subtitle, .eyes__text', effect: 'fade-up', stagger: 150 },

    { selector: '.graduates__title', effect: 'fade-up' },
    { selector: '.graduates__nav', effect: 'fade-up', delay: 150 },
    { selector: '.graduates__slider', effect: 'fade-up', delay: 200, duration: 1200 },

    { selector: '.catalog__kicker', effect: 'fade-right' },
    { selector: '.catalog__text', effect: 'fade-up', delay: 200 },
    { selector: '.catalog__nav', effect: 'fade-up' },
    { selector: '.catalog__slider', effect: 'fade-left', duration: 1200 },

    { selector: '.growth__title', effect: 'fade-right' },
    { selector: '.growth__mark', effect: 'pop', delay: 300 },
    { selector: '.growth__rule', effect: 'draw', duration: 1400 },
    { selector: '.growth__subtitle, .growth__text', effect: 'fade-up', stagger: 150 },
    { selector: '.growth__gallery', effect: 'reveal', duration: 1400 },

    { selector: '.price__card', effect: 'reveal', duration: 1400 },
    { selector: '.price__title, .price__text', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.price__rule', effect: 'draw', delay: 400, duration: 1200 },
    { selector: '.price-table tr', effect: 'fade', delay: 300, stagger: 70 },
    { selector: '.price__form', effect: 'fade-up', duration: 1100 },

    { selector: '.delivery__globe', effect: 'fade', duration: 2000 },
    { selector: '.delivery__card', effect: 'fade-right' },
    { selector: '.delivery__lead', effect: 'fade-left' },
    { selector: '.delivery__features .feature-chip', effect: 'fade-up', stagger: 120 },

    { selector: '.avito__bar', effect: 'fade' },
    { selector: '.avito__title', effect: 'fade-up' },
    { selector: '.compare-table tr', effect: 'fade', delay: 200, stagger: 70 },
    { selector: '.avito__puppy', effect: 'rise', delay: 200, duration: 1400 },
    { selector: '.avito__aside', effect: 'fade-left', delay: 300 },

    { selector: '.buy__title, .buy__text--age', effect: 'fade-right', stagger: 150 },
    { selector: '.buy__rule', effect: 'draw', duration: 1200 },
    { selector: '.buy__puppy', effect: 'rise', duration: 1400 },
    { selector: '.buy__sure, .buy__text--sure', effect: 'fade-left', stagger: 150 },
    { selector: '.buy__subtitle, .buy__text--media', effect: 'fade-up', stagger: 150 },
    { selector: '.buy__actions', effect: 'fade-up', delay: 200 },
    { selector: '.step', effect: 'fade-up', stagger: 150 },

    // Catalog page
    { selector: '.cat-hero__tag', effect: 'fade-up', delay: 300 },
    { selector: '.cat-hero__title', effect: 'fade-up', delay: 400, duration: 1200 },
    { selector: '.cat-hero__text, .cat-hero__btn', effect: 'fade-up', delay: 650, stagger: 150 },
    { selector: '.cat-list__grid > .puppy-card', effect: 'fade-up', stagger: 120, staggerGroup: 3, duration: 1100 },
    { selector: '.reserve__card', effect: 'reveal', duration: 1400 },
    { selector: '.reserve__title, .reserve__actions', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.reserve__aside > *', effect: 'fade-left', stagger: 100 },
    { selector: '.howto__title', effect: 'fade-right' },
    { selector: '.howto__btn', effect: 'fade-up', delay: 150 },
    { selector: '.howto__grid', effect: 'reveal', duration: 1400 },
    { selector: '.howto__cell', effect: 'fade', delay: 300, stagger: 100 },

    // About page
    { selector: '.ab-intro__kicker', effect: 'fade-right' },
    { selector: '.ab-intro__slider', effect: 'fade-left', duration: 1200 },
    { selector: '.ab-docs__card', effect: 'reveal', duration: 1400 },
    { selector: '.ab-docs__title, .ab-docs__text', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.ab-care__title, .ab-care__lead', effect: 'fade-up', stagger: 150 },
    { selector: '.ab-care__puppy', effect: 'rise', duration: 1400 },
    { selector: '.ab-care__card', effect: 'fade-left', delay: 300 },
    { selector: '.ab-care__dot', effect: 'pop', delay: 500 },
    { selector: '.ab-care__item', effect: 'fade-up', delay: 300, stagger: 100 },
    { selector: '.ab-story__title, .ab-story__text--intro', effect: 'fade-right', stagger: 150 },
    { selector: '.ab-story__puppy', effect: 'rise', duration: 1400 },
    { selector: '.ab-story__help, .ab-story__text--help', effect: 'fade-left', stagger: 150 },
    { selector: '.ab-story__subtitle, .ab-story__text--persons', effect: 'fade-up', stagger: 150 },
    { selector: '.ab-story__actions', effect: 'fade-up', delay: 200 },
    { selector: '.ab-vet__title', effect: 'fade-right' },
    { selector: '.ab-vet__text', effect: 'fade-left' },
    { selector: '.ab-vet__slider', effect: 'fade-left', duration: 1200 },
    { selector: '.ab-visit__card', effect: 'reveal', duration: 1400 },
    { selector: '.ab-visit__title, .ab-visit__btn', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.ab-visit__pill', effect: 'fade-left', delay: 400, stagger: 150 },
    // Delivery page
    { selector: '.dl-intro__kicker', effect: 'fade-right' },
    { selector: '.dl-intro__btn, .dl-intro__text', effect: 'fade-up', delay: 200, stagger: 150 },
    { selector: '.dl-cities__title', effect: 'fade-right' },
    { selector: '.dl-cities__table', effect: 'fade-up', delay: 150 },
    { selector: '.dl-meet__title', effect: 'fade-up' },
    { selector: '.dl-meet__hand', effect: 'rise', duration: 1400 },
    { selector: '.dl-card', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.dl-kit__title', effect: 'fade-right' },
    { selector: '.dl-kit__item', effect: 'fade-up', delay: 150, stagger: 100 },

    // Inner-page hero (reviews, product)
    { selector: '.page-hero__tag', effect: 'fade-up', delay: 300 },
    { selector: '.page-hero__title', effect: 'fade-up', delay: 400, duration: 1200 },
    { selector: '.page-hero__price', effect: 'fade-left', delay: 550 },
    { selector: '.page-hero__btn', effect: 'fade-up', delay: 650 },

    // Product page
    { selector: '.pd__photo', effect: 'reveal', duration: 1400 },
    { selector: '.pd__thumbs li', effect: 'fade-up', delay: 200, stagger: 100 },
    { selector: '.pd__name, .pd__price', effect: 'fade-up', stagger: 100 },
    { selector: '.pd__actions', effect: 'fade-up', delay: 200 },
    { selector: '.similar__title', effect: 'fade-up' },
    { selector: '.similar__nav', effect: 'fade-up', delay: 150 },
    { selector: '.similar__slider', effect: 'fade-left', duration: 1200 },

    // Reviews page
    { selector: '.rv-trust__title', effect: 'fade-right' },
    { selector: '.rv-trust__rule, .rv-trust__lead', effect: 'fade-left', stagger: 150 },
    { selector: '.rv-trust__card', effect: 'fade-up', delay: 200, duration: 1100 },
    { selector: '.rv-say__title', effect: 'fade-right' },
    { selector: '.rv-say__nav', effect: 'fade-up' },
    { selector: '.rv-say__slider', effect: 'fade-left', duration: 1200 },

    { selector: '.video__card', effect: 'reveal', duration: 1400 },
    { selector: '.video__caption', effect: 'fade-right', delay: 300 },
    { selector: '.video__text', effect: 'fade-left', delay: 300 },
    { selector: '.video__track', effect: 'draw', delay: 400, duration: 1800 },
    { selector: '.video__title', effect: 'fade-up', delay: 500 },

    { selector: '.care__title', effect: 'fade-up' },
    { selector: '.care__puppy', effect: 'zoom-in', duration: 1400 },
    { selector: '.care__card', effect: 'fade-left', delay: 200 },
    { selector: '.care__dot', effect: 'pop', delay: 500 },
    { selector: '.care__line', effect: 'draw', delay: 600, duration: 1200 },
    { selector: '.care__item', effect: 'fade-up', delay: 300, stagger: 100 },
    { selector: '.care__form', effect: 'fade-up', duration: 1100 },

    { selector: '.family__card', effect: 'reveal', duration: 1400 },
    { selector: '.family__kicker, .family__title', effect: 'fade-up', delay: 300, stagger: 150 },
    { selector: '.family__block', effect: 'fade-up', stagger: 150 },


    { selector: '.contact-card', effect: 'fade-up', duration: 1100 },
    { selector: '.footer__group', effect: 'fade-up', stagger: 150 },
    // Last items on the page: offset 0, otherwise they sit below the trigger line at max scroll
    { selector: '.footer__divider', effect: 'draw', duration: 1400, offset: 0 },
    { selector: '.footer__bottom > *', effect: 'fade', stagger: 80, offset: 0 }
  ];

  // Parallax: translateY = (viewport centre − section centre) × speed.
  // Not on the hero photo: moving it opened a dark band over the hero while scrolling.
  var PARALLAX = [
    { selector: '.eyes__photo', speed: 0.04 },
    { selector: '.price__photo', speed: 0.035 },
    { selector: '.family__photo', speed: 0.035 },
    { selector: '.delivery__globe-img', speed: -0.05 }
  ];

  // Scroll-linked sideways drift of the big display words, the whole time they
  // are on screen: translateX goes linearly from `from` to `to` (px) while the
  // element's top moves from `start` to `end` (fractions of the viewport height,
  // negative = above the viewport); it passes its Figma position (0) on the way.
  var SCRUB = [
    { selector: '.why__number', from: -240, to: 160, start: 1, end: -0.5 },
    { selector: '.catalog__title', from: 260, to: -180, start: 1, end: -0.4 },
    { selector: '.faq:not(.faq--page) .faq__title', from: 200, to: -140, start: 1, end: -0.3 }
  ];
  var COMPACT_SCRUB = 0.3; // ≤1279 the words are smaller, so they drift less

  // Sliders run the full width of the screen (never cut by a container): Figma
  // gap between slides and the side insets as slide offsets (first slide starts
  // `before` px from the left edge, the last one stops `after` px from the right).
  // Figma values at 1920, × 0.75 below.
  var SLIDERS = {
    why: { gap: 27, before: 13, after: 13, tablet: { gap: 16 } },
    graduates: { gap: 21, before: 33, after: 33, tablet: { gap: 16 } },
    catalog: { gap: 17, before: 25, after: 25, tablet: { gap: 16 } },
    growth: { gap: 22, before: 25, after: 106 },
    reviews: { gap: 15, before: 31, after: 31, tablet: { gap: 16 } },
    similar: { gap: 17, before: 33, after: 33, tablet: { gap: 16 } },
    shop: { gap: 18, before: 25, after: 25, tablet: { gap: 16 } },
    related: { gap: 21.5, before: 46, after: 46, tablet: { gap: 16 } },
    intro: { gap: 22.56, before: 56, after: 56, tablet: { gap: 16 } },
    // ≤1279 the glass cards sit 5 apart inside the 310-wide strip of the photo card (Figma 197:2277)
    docs: { gap: 34, before: 0, after: 40, compactGap: '1.613%' },
    vet: { gap: 25, before: 70, after: 70, tablet: { gap: 16 } },
    // Delivery «how to meet» cards: a slider only ≤767 (a collage above), cards 320 × --m, 10 apart
    dlcards: { gap: 0, before: 0, after: 0, compactOnly: true, compactGap: '3.125%', wrapperClass: 'dl-meet__cards', slideClass: 'dl-card' },
    // Catalog steps: a row of four on desktop, a grid on tablets, a slider only ≤767 (no swiper-* classes in the markup)
    steps: { gap: 0, before: 0, after: 0, compactOnly: true, wrapperClass: 'steps', slideClass: 'step' }
  };

  // Shared scroll loop for parallax and scrub (see CLAUDE.md → Animations):
  // geometry is measured only when layout can change; on scroll the effects
  // only compute from scrollY and write the styles that changed.
  var scrollEffects = [];
  var lastScrollY = null;

  function clamp01(value) {
    return Math.min(1, Math.max(0, value));
  }

  // Top of a node in page coordinates, ignoring its own translate
  function layoutPageTop(node) {
    var parent = node.offsetParent || document.body;
    return parent.getBoundingClientRect().top + window.scrollY + node.offsetTop;
  }

  // Writes an inline style property only if the value changed
  function setStyle(node, cache, prop, value) {
    if (cache[prop] === value) return;
    cache[prop] = value;
    node.style[prop] = value;
  }

  function measureScrollEffects() {
    scrollEffects.forEach(function (effect) { effect.measure(); });
    renderScrollEffects(true);
  }

  function renderScrollEffects(force) {
    var y = window.scrollY;
    if (!force && y === lastScrollY) return;
    lastScrollY = y;
    var vh = window.innerHeight;
    scrollEffects.forEach(function (effect) { effect.update(y, vh); });
  }

  function addScrollEffect(effect) {
    if (!scrollEffects.length) {
      var ticking = false;
      window.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          renderScrollEffects(false);
        });
      }, { passive: true });

      if (lenis) {
        lenis.on('scroll', function () { renderScrollEffects(false); });
      }

      var measuring = false;
      var scheduleMeasure = function () {
        if (measuring) return;
        measuring = true;
        requestAnimationFrame(function () {
          measuring = false;
          measureScrollEffects();
        });
      };
      window.addEventListener('resize', scheduleMeasure);
      window.addEventListener('load', scheduleMeasure);
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(scheduleMeasure);
      if ('ResizeObserver' in window) new ResizeObserver(scheduleMeasure).observe(document.body);
    }
    scrollEffects.push(effect);
    effect.measure();
    effect.update(window.scrollY, window.innerHeight);
  }

  // Keeps --fixed-vh and --m (set in <head>) in sync when the width changes,
  // but ignores height-only resizes from mobile browser toolbars.
  // --m: below 768 the mobile layout (360 wide in Figma) fills the screen width;
  // tablets (768–1279) have their own fixed-size layout (media.css).
  function setScale() {
    var root = document.documentElement;
    var width = root.clientWidth;
    if (width < 768) root.style.setProperty('--m', String(width / 360));
    else root.style.removeProperty('--m');
  }

  function initFixedVh() {
    var lastWidth = window.innerWidth;
    setScale();
    window.addEventListener('resize', function () {
      if (window.innerWidth === lastWidth) return;
      lastWidth = window.innerWidth;
      document.documentElement.style.setProperty('--fixed-vh', window.innerHeight + 'px');
      setScale();
    });
  }

  // Hero videos [data-hero-video]: the still under them is their first frame, so they
  // start after `load` (the still stays the LCP), fade in on `playing` and pause off
  // screen. Reduced motion or Data Saver: no video, the still stays.
  function initHeroVideo() {
    var videos = document.querySelectorAll('[data-hero-video]');
    var saveData = navigator.connection && navigator.connection.saveData;
    if (!videos.length || reduceMotion || saveData) return;

    var start = function () {
      videos.forEach(function (video) {
        var play = function () {
          var p = video.play();
          if (p && p.catch) p.catch(function () {});
        };
        video.addEventListener('playing', function () {
          video.classList.add('is-playing');
        }, { once: true });
        if ('IntersectionObserver' in window) {
          // fires once right away, which also starts the video when it is on screen; videos further
          // down (about / products cards) only load when they come within half a screen
          new IntersectionObserver(function (entries) {
            if (entries[0].isIntersecting) {
              video.preload = 'auto';
              play();
            } else {
              video.pause();
            }
          }, { rootMargin: '50% 0px' }).observe(video);
        } else {
          video.preload = 'auto';
          play();
        }
      });
    };

    if (document.readyState === 'complete') start();
    else window.addEventListener('load', start, { once: true });
  }

  function initSmoothScroll() {
    if (reduceMotion || typeof window.Lenis !== 'function') return;

    lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // In-page links: smooth with Lenis, native otherwise
  function initAnchors() {
    document.addEventListener('click', function (event) {
      // "#id" and "page.html#id" (shared header/footer links) when they point to this page
      var link = event.target.closest('a[href*="#"]');
      if (!link || link.hasAttribute('data-popup-open') || !samePage(link)) return;
      var id = link.hash;
      if (id.length < 2) return;
      var target = document.querySelector(id);
      if (!target) return;
      event.preventDefault();
      scrollToTarget(target);
    });
  }

  function samePage(link) {
    var page = function (path) { return path.replace(/\/index\.html$/, '/'); };
    return link.origin === location.origin && page(link.pathname) === page(location.pathname);
  }

  function scrollToTarget(target) {
    if (lenis) {
      lenis.scrollTo(target);
    } else {
      var top = target === 0 ? 0 : target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: top, behavior: reduceMotion ? 'auto' : 'smooth' });
    }
  }

  function initScrollTop() {
    document.querySelectorAll('[data-scroll-top]').forEach(function (button) {
      button.addEventListener('click', function () {
        scrollToTarget(0);
      });
    });
  }

  function initAnimations() {
    if (reduceMotion || !window.AOS) {
      document.documentElement.classList.remove('aos-pending');
      return;
    }

    ANIMATIONS.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (node, index) {
        var step = item.staggerGroup ? index % item.staggerGroup : index;
        // aos.css only ships delay rules in steps of 50ms
        var delay = Math.round(((item.delay || 0) + (item.stagger || 0) * step) / 50) * 50;
        node.setAttribute('data-aos', item.effect);
        if (delay) node.setAttribute('data-aos-delay', String(Math.min(delay, 3000)));
        if (item.duration) node.setAttribute('data-aos-duration', String(item.duration));
        if (item.offset !== undefined) node.setAttribute('data-aos-offset', String(item.offset));
      });
    });

    window.AOS.init({
      once: true,
      duration: 900,
      easing: 'ease-out-cubic',
      offset: 80
    });
    document.documentElement.classList.remove('aos-pending');

    // Late images and fonts can shift trigger positions
    window.addEventListener('load', function () {
      window.AOS.refresh();
    });
  }

  function initParallax() {
    if (reduceMotion) return;

    var layers = [];
    PARALLAX.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (node) {
        var section = node.closest('section, footer');
        if (!section) return;
        node.setAttribute('data-parallax', '');
        layers.push({ node: node, section: section, speed: item.speed, cache: {} });
      });
    });
    if (!layers.length) return;

    addScrollEffect({
      measure: function () {
        layers.forEach(function (layer) {
          var rect = layer.section.getBoundingClientRect();
          layer.top = rect.top + window.scrollY;
          layer.height = rect.height;
        });
      },
      update: function (y, vh) {
        layers.forEach(function (layer) {
          var top = layer.top - y;
          if (top > vh || top + layer.height < 0) return; // off-screen: keep last value
          var offset = (vh / 2 - (top + layer.height / 2)) * layer.speed;
          setStyle(layer.node, layer.cache, 'translate', '0 ' + offset.toFixed(1) + 'px');
        });
      }
    });
  }

  function initScrub() {
    if (reduceMotion) return;

    var items = [];
    var compact = false;
    SCRUB.forEach(function (item) {
      document.querySelectorAll(item.selector).forEach(function (node) {
        items.push({ node: node, config: item, cache: {} });
      });
    });
    if (!items.length) return;

    addScrollEffect({
      measure: function () {
        compact = window.innerWidth < 1280;
        items.forEach(function (item) {
          item.top = layoutPageTop(item.node);
        });
      },
      update: function (y, vh) {
        items.forEach(function (item) {
          var c = item.config;
          var progress = clamp01((c.start * vh - (item.top - y)) / ((c.start - c.end) * vh));
          var x = (c.from + (c.to - c.from) * progress) * (compact ? COMPACT_SCRUB : 1); // linear: keeps moving while visible
          setStyle(item.node, item.cache, 'translate', x.toFixed(1) + 'px 0');
        });
      }
    });
  }

  // Slider photos are lazy: a gallery revealed by its entrance animation (growth) showed an empty
  // box, and slides swiped in loaded only then. Every photo of a slider (clones included) starts
  // loading once the slider is within 1.5 screens.
  function initSliderPreload() {
    var sliders = document.querySelectorAll('[data-slider], [data-gallery-stage]');
    if (!sliders.length || !('IntersectionObserver' in window)) return;
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
          img.loading = 'eager';
        });
        io.unobserve(entry.target);
      });
    }, { rootMargin: '150% 0px' });
    sliders.forEach(function (slider) { io.observe(slider); });
  }

  // «Показать ещё» for card grids ([data-show-more]: catalog puppies, products): one step of
  // cards is visible (9 = three rows of three / nine on phones; 8 = four rows of two on
  // tablets), the rest get `hidden`; the button (.show-more, next to the list) reveals the
  // next step with a staggered fade-up and goes away when nothing is left. Lists of one step
  // or fewer keep the button hidden.
  function initShowMore() {
    var tablet = window.matchMedia('(min-width: 768px) and (max-width: 1279px)');

    document.querySelectorAll('[data-show-more]').forEach(function (list) {
      var wrap = list.parentNode.querySelector('.show-more');
      var button = wrap && wrap.querySelector('[data-show-more-btn]');
      var items = Array.prototype.slice.call(list.children);
      var step = function () { return tablet.matches ? 8 : 9; };
      if (!button || items.length <= step()) return;

      var shown = step();
      items.forEach(function (item, i) { item.hidden = i >= shown; });
      wrap.hidden = false;

      button.addEventListener('click', function () {
        var next = items.slice(shown, shown + step());
        next.forEach(function (item, i) {
          item.hidden = false;
          if (!reduceMotion) {
            item.style.animationDelay = (i * 70) + 'ms';
            item.classList.add('is-revealed');
          }
        });
        shown += next.length;
        if (shown >= items.length) wrap.hidden = true;
        // the first new card takes the focus (keyboard users continue from there)
        var link = next[0] && next[0].querySelector('a, button');
        if (link) link.focus({ preventScroll: true });
        if (window.AOS) window.AOS.refresh();
      });
    });
  }

  // Swiper sliders: [data-slider="name"]; arrows [data-slider-prev/next] in the
  // same gallery or section (local custom bundle: Navigation, Keyboard, A11y)
  function initSliders() {
    if (typeof window.Swiper !== 'function') return;
    var modules = window.SwiperModules || {};

    function options(c, scope) {
      var o = {
        modules: [modules.Navigation, modules.Keyboard, modules.A11y].filter(Boolean),
        slidesPerView: 'auto',
        // ≤767 the slider is the 320 × --m column and runs past it: gap 20 × --m = 6.25 % of the slider
        spaceBetween: c.compactGap || '6.25%',
        slidesOffsetBefore: 0,
        slidesOffsetAfter: 0,
        breakpoints: {
          // tablets: fixed gaps (SLIDERS[name].tablet, default 20), offsets from the tablet CSS gutter
          768: { spaceBetween: (c.tablet || {}).gap || 20, slidesOffsetBefore: (c.tablet || {}).before || 0, slidesOffsetAfter: (c.tablet || {}).after || 0 },
          1280: { spaceBetween: c.gap * 0.75, slidesOffsetBefore: c.before * 0.75, slidesOffsetAfter: c.after * 0.75 },
          1920: { spaceBetween: c.gap, slidesOffsetBefore: c.before, slidesOffsetAfter: c.after }
        },
        speed: reduceMotion ? 0 : 800,
        grabCursor: true,
        watchOverflow: true,
        navigation: {
          prevEl: scope.querySelector('[data-slider-prev]'),
          nextEl: scope.querySelector('[data-slider-next]')
        },
        keyboard: { enabled: true, onlyInViewport: true },
        a11y: {
          enabled: true,
          prevSlideMessage: 'Предыдущий слайд',
          nextSlideMessage: 'Следующий слайд',
          slideLabelMessage: '{{index}} из {{slidesLength}}'
        }
      };
      if (c.wrapperClass) o.wrapperClass = c.wrapperClass;
      if (c.slideClass) o.slideClass = c.slideClass;
      return o;
    }

    document.querySelectorAll('[data-slider]').forEach(function (slider) {
      var c = SLIDERS[slider.getAttribute('data-slider')] || { gap: 20, before: 0, after: 0 };
      var scope = slider.closest('.growth__gallery') || slider.closest('section') || document;
      var create = function () {
        return new window.Swiper(slider, options(c, scope));
      };

      // Sliders for one layout only are built when it applies and destroyed otherwise
      // (styles cleaned up): compactOnly in SLIDERS, or data-slider-desktop on the element
      // (e.g. the reviews graduates: a slider on desktop, a plain stack on phones)
      var only = c.compactOnly ? '(max-width: 767px)'
        : slider.hasAttribute('data-slider-desktop') ? '(min-width: 768px)' : null;
      if (!only) {
        create();
        return;
      }
      var layout = window.matchMedia(only);
      var instance = null;
      var sync = function () {
        if (layout.matches && !instance) instance = create();
        if (!layout.matches && instance) {
          instance.destroy(true, true);
          instance = null;
        }
      };
      sync();
      layout.addEventListener('change', sync);
    });
  }

  // Sideways chip rows on the compact layout ([data-chip-counter], e.g. care):
  // the "1/7" counter before the row follows the chip at the row's start;
  // optional [data-chip-prev]/[data-chip-next] buttons beside it scroll by one chip
  function initChipCounter() {
    document.querySelectorAll('[data-chip-counter]').forEach(function (row) {
      ['prev', 'next'].forEach(function (dir) {
        var btn = row.parentNode.querySelector('[data-chip-' + dir + ']');
        if (!btn) return;
        btn.addEventListener('click', function () {
          var step = row.children[1] ? row.children[1].offsetLeft - row.children[0].offsetLeft : row.clientWidth;
          row.scrollBy({ left: dir === 'next' ? step : -step, behavior: reduceMotion ? 'auto' : 'smooth' });
        });
      });
      var current = row.parentNode.querySelector('[data-chip-current]');
      if (!current) return;
      var ticking = false;
      row.addEventListener('scroll', function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          ticking = false;
          var first = row.children[0];
          var step = row.children[1] ? row.children[1].offsetLeft - first.offsetLeft : first.offsetWidth;
          var index = Math.round(row.scrollLeft / step);
          // the last chips can't reach the start: at the end of the row show the last number
          if (row.scrollLeft + row.clientWidth >= row.scrollWidth - 2) index = row.children.length - 1;
          current.textContent = String(Math.min(row.children.length, index + 1));
        });
      }, { passive: true });
    });
  }

  // FAQ: accordion-js (local vendor file); the second question is open as in Figma
  // FAQ [data-accordion] (every one on the page): no entrance animation; the second item is
  // open on load. A click anywhere in an item (question row, answer, the gap below) toggles it,
  // so an open item closes from its whole sand area; selecting text in an answer does not.
  function initFaq() {
    if (typeof window.Accordion !== 'function') return;
    var refresh = function () { if (window.AOS) window.AOS.refresh(); };

    document.querySelectorAll('[data-accordion]').forEach(function (list) {
      // the item open on load gets its colours without a transition
      list.classList.add('is-initing');
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { list.classList.remove('is-initing'); });
      });
      new window.Accordion(list, {
        elementClass: 'faq__item',
        triggerClass: 'faq__q',
        panelClass: 'faq__panel',
        activeClass: 'is-active',
        duration: reduceMotion ? 0 : 500,
        openOnInit: [1],
        onOpen: refresh,
        onClose: refresh
      });

      list.addEventListener('click', function (event) {
        var item = event.target.closest('.faq__item');
        if (!item || event.target.closest('.faq__q, a')) return;
        if (String(window.getSelection && window.getSelection()).length) return;
        item.querySelector('.faq__q').click();
      });
    });
  }

  // Product page: accordion-js, several items open at once; «Родители» is a nested
  // accordion inside «Информация о щенке». Open on load as in Figma.
  function initProductInfo() {
    var root = document.querySelector('[data-pd-accordion]');
    if (!root || typeof window.Accordion !== 'function') return;

    var refresh = function () { if (window.AOS) window.AOS.refresh(); };
    var base = {
      triggerClass: 'pd-acc__q',
      activeClass: 'is-active',
      showMultiple: true,
      duration: reduceMotion ? 0 : 450,
      onOpen: refresh,
      onClose: refresh
    };
    root.querySelectorAll('[data-pd-sub]').forEach(function (sub) {
      new window.Accordion(sub, Object.assign({}, base, {
        elementClass: 'pd-sub__item', panelClass: 'pd-sub__panel', openOnInit: [0]
      }));
    });
    new window.Accordion(root, Object.assign({}, base, {
      elementClass: 'pd-acc__item', panelClass: 'pd-acc__panel', openOnInit: [0, 1], onlyChildNodes: true
    }));
  }

  // Product gallery [data-gallery]: the photo is a Swiper with one slide per thumbnail
  // ([data-gallery-stage]), so a new photo slides in instead of being swapped. The
  // [data-gallery-thumb] buttons switch it on hover with a mouse or trackpad and on click / Enter
  // everywhere; a finger (or a mouse drag) swipes it; [data-gallery-prev/next] (the arrows on the
  // photo, phones) step through it and wrap around (rewind).
  function initGallery() {
    var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

    document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
      var stage = gallery.querySelector('[data-gallery-stage]');
      var thumbs = Array.prototype.slice.call(gallery.querySelectorAll('[data-gallery-thumb]'));
      if (!stage || !thumbs.length || typeof window.Swiper !== 'function') return;

      var setActive = function (index) {
        thumbs.forEach(function (thumb, i) {
          thumb.classList.toggle('is-active', i === index);
          thumb.setAttribute('aria-pressed', String(i === index));
        });
      };
      var swiper = new window.Swiper(stage, {
        speed: reduceMotion ? 0 : 600,
        rewind: true,
        on: {
          slideChange: function (instance) { setActive(instance.activeIndex); }
        }
      });

      thumbs.forEach(function (thumb, index) {
        thumb.addEventListener('click', function () { swiper.slideTo(index); });
        thumb.addEventListener('mouseenter', function () {
          if (finePointer.matches) swiper.slideTo(index);
        });
      });
      var prev = gallery.querySelector('[data-gallery-prev]');
      var next = gallery.querySelector('[data-gallery-next]');
      if (prev) prev.addEventListener('click', function () { swiper.slidePrev(); });
      if (next) next.addEventListener('click', function () { swiper.slideNext(); });
    });
  }


  // Share button [data-share]: the system share sheet, otherwise copy the link
  function initShare() {
    document.querySelectorAll('[data-share]').forEach(function (button) {
      button.addEventListener('click', function () {
        var data = { title: document.title, url: location.href };
        if (navigator.share) {
          navigator.share(data).catch(function () {});
        } else if (navigator.clipboard) {
          navigator.clipboard.writeText(location.href).then(function () {
            button.setAttribute('aria-label', button.getAttribute('data-msg-copied') || '');
            button.classList.add('is-copied');
          });
        }
      });
    });
  }

  // Lead forms ([data-lead-form]): rules picked by data-validate; the error
  // shows inside the field (.field-error), the field gets aria-invalid.
  // Errors appear on blur (if something was typed) or on submit, and clear
  // live while the user fixes the value. Texts come from data-msg-* on the form.
  var VALIDATORS = {
    name: function (value) {
      if (!value) return 'name-empty';
      var letters = value.match(/\p{L}/gu) || [];
      return letters.length < 2 ? 'name-short' : '';
    },
    phone: function (value) {
      if (!value) return 'phone-empty';
      var digits = value.replace(/\D/g, '').length;
      return digits < 10 || digits > 15 ? 'phone-invalid' : '';
    },
    // optional: checked only when something is typed
    email: function (value) {
      if (!value) return '';
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? '' : 'email-invalid';
    },
    // checkboxes pass their checked state as the value
    consent: function (value) {
      return value ? '' : 'consent-empty';
    }
  };

  function initForms() {
    document.querySelectorAll('[data-lead-form]').forEach(initForm);
  }

  function initForm(form) {
    var fields = Array.prototype.slice.call(form.querySelectorAll('[data-validate]'));
    var status = form.querySelector('[data-form-status]');
    var submitted = false;
    var statusTimer = null;

    function text(key) {
      return form.getAttribute('data-msg-' + key) || '';
    }

    function validate(field) {
      var rule = VALIDATORS[field.getAttribute('data-validate')];
      var value = field.type === 'checkbox' ? (field.checked ? 'on' : '') : field.value.trim();
      var key = rule ? rule(value) : '';
      var message = key ? text(key) : '';
      var wrap = field.closest('.field-wrap');
      var error = document.getElementById(field.getAttribute('aria-describedby'));

      if (error && message) {
        error.textContent = message;
        // Reserve the message's width (+ its right offset + 10px), so typed text never runs under it
        var right = parseFloat(getComputedStyle(error).right) || 0;
        field.style.paddingRight = Math.ceil(error.offsetWidth + right + 10) + 'px';
      }
      if (error && message && field.type === 'checkbox') field.style.paddingRight = '';
      if (!message) field.style.paddingRight = '';
      // Clear stale text after the fade-out, so screen readers don't announce it
      if (error && !message) {
        setTimeout(function () {
          if (field.getAttribute('aria-invalid') !== 'true') error.textContent = '';
        }, 300);
      }
      if (wrap) wrap.classList.toggle('is-invalid', Boolean(message));
      field.setAttribute('aria-invalid', message ? 'true' : 'false');
      return !message;
    }

    function setStatus(value) {
      if (!status) return;
      clearTimeout(statusTimer);
      status.textContent = value;
      status.classList.toggle('is-visible', Boolean(value));
      if (value) {
        statusTimer = setTimeout(function () { setStatus(''); }, 6000);
      }
    }

    fields.forEach(function (field) {
      field.addEventListener('blur', function () {
        if (field.type === 'checkbox') return;
        if (submitted || field.value.trim()) validate(field);
      });

      field.addEventListener('input', function () {
        // Phone: keep only digits, +, spaces, brackets and dashes
        if (field.getAttribute('data-validate') === 'phone') {
          var clean = field.value.replace(/[^\d+()\-\s]/g, '');
          if (clean !== field.value) field.value = clean;
        }
        if (field.getAttribute('aria-invalid') === 'true') validate(field);
        setStatus('');
      });
    });

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      submitted = true;

      var firstInvalid = null;
      fields.forEach(function (field) {
        if (!validate(field) && !firstInvalid) firstInvalid = field;
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      // No backend yet: confirm and reset (see CLAUDE.md → Content flagged)
      form.reset();
      submitted = false;
      fields.forEach(function (field) { field.removeAttribute('aria-invalid'); });
      setStatus(text('sent'));
      form.dispatchEvent(new CustomEvent('lead:sent'));
    });
  }

  // Modal dialogs: [hidden] while closed, CSS animates .is-open, hidden is set
  // again after the closing transition. Esc and [data-dialog-close] close; Tab
  // stays inside; the page does not scroll; focus returns to the opener.
  var DIALOG_CLOSE_MS = 500;

  function createDialog(dialog, options) {
    var panel = dialog.querySelector(options.panel);
    var closeTimer = null;
    var opener = null;

    function isOpen() {
      return dialog.classList.contains('is-open');
    }

    function focusables() {
      return Array.prototype.filter.call(
        dialog.querySelectorAll('a[href], button, input'),
        function (el) { return !el.disabled && el.offsetParent !== null; }
      );
    }

    function open(from) {
      clearTimeout(closeTimer);
      opener = from || null;
      dialog.hidden = false;
      dialog.scrollTop = 0;
      dialog.offsetWidth; // start the transition from the closed state
      dialog.classList.add('is-open');
      document.documentElement.classList.add('is-dialog-open');
      if (lenis) lenis.stop();
      if (options.onOpen) options.onOpen(opener);
      var first = dialog.querySelector(options.focus);
      if (first) first.focus({ preventScroll: true });
    }

    function close(restoreFocus) {
      if (!isOpen()) return;
      dialog.classList.remove('is-open');
      document.documentElement.classList.remove('is-dialog-open');
      if (lenis) lenis.start();
      if (options.onClose) options.onClose(opener);
      closeTimer = setTimeout(function () { dialog.hidden = true; }, reduceMotion ? 0 : DIALOG_CLOSE_MS);
      if (restoreFocus && opener) opener.focus({ preventScroll: true });
    }

    dialog.addEventListener('click', function (event) {
      if (event.target.closest('[data-dialog-close]')) close(true);
    });

    document.addEventListener('keydown', function (event) {
      if (!isOpen()) return;
      if (event.key === 'Escape') {
        close(true);
        return;
      }
      if (event.key === 'Tab') {
        var items = focusables();
        if (!items.length) return;
        var first = items[0];
        var last = items[items.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        } else if (!panel.contains(document.activeElement)) {
          event.preventDefault();
          first.focus();
        }
      }
    });

    return { open: open, close: close, isOpen: isOpen };
  }

  // Burger menu: [data-menu], opened by every [data-menu-toggle]; a link inside
  // closes it, then initAnchors (document listener) scrolls
  // Custom dropdown ([data-dropdown], CLAUDE.md → Custom dropdown): a toggle with
  // aria-expanded and a role="listbox" list; the value goes to the root's data-value and a
  // hidden input, and the root fires `change`. Keyboard: ↓/↑/Home/End, Enter/Space, Esc, Tab.
  function initDropdown() {
    document.querySelectorAll('[data-dropdown]').forEach(function (root) {
      var toggle = root.querySelector('[aria-haspopup="listbox"]');
      var list = root.querySelector('[role="listbox"]');
      var label = root.querySelector('[data-dropdown-value]');
      var input = root.querySelector('input[type="hidden"]');
      if (!toggle || !list) return;
      var options = Array.prototype.slice.call(list.querySelectorAll('[role="option"]'));
      var placeholder = label ? label.textContent : '';
      var active = -1;

      function setActive(index) {
        active = Math.max(0, Math.min(options.length - 1, index));
        options.forEach(function (option, i) { option.classList.toggle('is-active', i === active); });
        list.setAttribute('aria-activedescendant', options[active].id);
        options[active].scrollIntoView({ block: 'nearest' });
      }

      // the list fades and slides in (.is-open, CSS) and gets `hidden` again after closing
      var hideTimer = 0;
      var isOpen = function () { return list.classList.contains('is-open'); };

      function open() {
        clearTimeout(hideTimer);
        list.hidden = false;
        void list.offsetWidth; // start the transition from the closed state
        list.classList.add('is-open');
        toggle.setAttribute('aria-expanded', 'true');
        var selected = options.findIndex(function (o) { return o.getAttribute('aria-selected') === 'true'; });
        setActive(selected < 0 ? 0 : selected);
        list.focus();
      }

      function close(returnFocus) {
        if (!isOpen()) return;
        list.classList.remove('is-open');
        hideTimer = setTimeout(function () { list.hidden = true; }, reduceMotion ? 0 : 300);
        toggle.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggle.focus();
      }

      function choose(index) {
        var option = options[index];
        options.forEach(function (o) { o.setAttribute('aria-selected', String(o === option)); });
        root.setAttribute('data-value', option.getAttribute('data-value'));
        if (input) input.value = option.getAttribute('data-value');
        if (label) {
          label.textContent = option.textContent;
          label.title = option.textContent;
        }
        root.dispatchEvent(new Event('change', { bubbles: true }));
        close(true);
      }

      function reset() {
        options.forEach(function (o) { o.setAttribute('aria-selected', 'false'); });
        root.setAttribute('data-value', '');
        if (input) input.value = '';
        if (label) {
          label.textContent = placeholder;
          label.removeAttribute('title');
        }
      }

      toggle.addEventListener('click', function () {
        if (isOpen()) close(true); else open();
      });

      toggle.addEventListener('keydown', function (event) {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault();
          open();
        }
      });

      list.addEventListener('keydown', function (event) {
        var keys = { ArrowDown: active + 1, ArrowUp: active - 1, Home: 0, End: options.length - 1 };
        if (event.key in keys) {
          event.preventDefault();
          setActive(keys[event.key]);
        } else if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          choose(active);
        } else if (event.key === 'Escape') {
          event.preventDefault();
          close(true);
        } else if (event.key === 'Tab') {
          close(false);
        }
      });

      options.forEach(function (option, index) {
        option.addEventListener('click', function () { choose(index); });
        option.addEventListener('mousemove', function () { if (active !== index) setActive(index); });
      });

      document.addEventListener('click', function (event) {
        if (!root.contains(event.target)) close(false);
      });

      // form.reset() doesn't clear a hidden input set from script: restore the placeholder
      var form = root.closest('form');
      if (form) form.addEventListener('reset', function () { setTimeout(reset, 0); });
    });
  }

  // Map ([data-map], contacts page): Leaflet from the page bundle js/map.min.js, built when
  // the map comes near the screen (tiles load only then). OpenStreetMap tiles (no key needed,
  // attribution required), darkened in CSS to match Figma; the Figma pin. The wheel doesn't
  // zoom (the page scrolls), the +/− buttons and pinch do.
  function initMap() {
    var el = document.querySelector('[data-map]');
    if (!el || typeof window.L !== 'object') return;
    var L = window.L;

    function build() {
      var point = [parseFloat(el.getAttribute('data-lat')), parseFloat(el.getAttribute('data-lng'))];
      var map = L.map(el, { zoomControl: false, scrollWheelZoom: false, attributionControl: true })
        .setView(point, parseInt(el.getAttribute('data-zoom'), 10) || 12);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      }).addTo(map);
      L.control.zoom({ position: 'bottomright', zoomInTitle: 'Приблизить', zoomOutTitle: 'Отдалить' }).addTo(map);
      L.marker(point, {
        title: el.getAttribute('data-title') || '',
        icon: L.divIcon({ className: 'ct-map__pin', iconSize: [46, 58], iconAnchor: [23, 58] })
      }).addTo(map);
      // the point (the pin's tip) stays in the centre of the map (client request; Figma had it higher)
      el.classList.add('is-ready');
    }

    if (!('IntersectionObserver' in window)) {
      build();
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      build();
    }, { rootMargin: '400px 0px' });
    observer.observe(el);
  }

  function initMenu() {
    var menu = document.querySelector('[data-menu]');
    var toggles = document.querySelectorAll('[data-menu-toggle]');
    if (!menu || !toggles.length) return;

    var dialog = createDialog(menu, {
      panel: '.menu__panel',
      focus: '.menu__link',
      onOpen: function (opener) { if (opener) opener.setAttribute('aria-expanded', 'true'); },
      onClose: function (opener) { if (opener) opener.setAttribute('aria-expanded', 'false'); }
    });

    toggles.forEach(function (toggle) {
      toggle.addEventListener('click', function () { dialog.open(toggle); });
    });

    menu.addEventListener('click', function (event) {
      if (event.target.closest('a[href]')) dialog.close(false);
    });
  }

  // Blog: [data-blog] filters articles ([data-post] with data-category and an ISO data-date) by the
  // [data-blog-filter="category"] dropdown and sorts them by the [data-blog-filter="sort"] one
  // (both [data-dropdown], initDropdown fires 'change'). The first two articles found go into the
  // large row ([data-blog-featured]), the rest into the grid ([data-blog-grid]); each photo gets
  // the sizes of its new card. [data-blog-empty] shows when nothing matches.
  var BLOG_SIZES = {
    featured: '(min-width: 1920px) 1180px, (min-width: 1280px) 885px, 100vw',
    grid: '(min-width: 1920px) 680px, (min-width: 1280px) 510px, 50vw'
  };

  function initBlog() {
    var blog = document.querySelector('[data-blog]');
    if (!blog) return;
    var featured = blog.querySelector('[data-blog-featured]');
    var grid = blog.querySelector('[data-blog-grid]');
    var empty = blog.querySelector('[data-blog-empty]');
    var category = blog.querySelector('[data-blog-filter="category"]');
    var sort = blog.querySelector('[data-blog-filter="sort"]');
    if (!featured || !grid) return;
    // the order in the markup breaks ties between equal dates
    var posts = Array.prototype.slice.call(blog.querySelectorAll('[data-post]'));
    posts.forEach(function (post, index) { post.setAttribute('data-order', index); });

    function place(post, container, sizes) {
      container.appendChild(post);
      post.querySelectorAll('img, source').forEach(function (el) {
        if (el.hasAttribute('sizes')) el.setAttribute('sizes', sizes);
      });
    }

    function apply() {
      var wanted = category ? category.getAttribute('data-value') : '';
      var oldest = sort && sort.getAttribute('data-value') === 'old';
      var shown = posts.filter(function (post) {
        var match = !wanted || wanted === 'all' || post.getAttribute('data-category') === wanted;
        post.hidden = !match;
        return match;
      });
      shown.sort(function (a, b) {
        var diff = a.getAttribute('data-date').localeCompare(b.getAttribute('data-date'));
        if (oldest) return diff || a.getAttribute('data-order') - b.getAttribute('data-order');
        return -diff || a.getAttribute('data-order') - b.getAttribute('data-order');
      });
      shown.forEach(function (post, index) {
        if (index < 2) place(post, featured, BLOG_SIZES.featured);
        else place(post, grid, BLOG_SIZES.grid);
      });
      // hidden ones wait at the end of the grid
      posts.forEach(function (post) { if (post.hidden) grid.appendChild(post); });
      if (empty) empty.hidden = shown.length > 0;
      if (window.AOS) window.AOS.refresh();
      return shown;
    }

    // a change fades the current cards out (.is-switching), re-sorts, then the new set fades up
    // one by one (.is-revealed, the «Показать ещё» animation)
    var switchTimer = 0;
    function change() {
      if (reduceMotion) { apply(); return; }
      clearTimeout(switchTimer);
      blog.classList.add('is-switching');
      switchTimer = setTimeout(function () {
        var shown = apply();
        blog.classList.remove('is-switching');
        shown.forEach(function (post, i) {
          post.classList.remove('is-revealed');
          void post.offsetWidth; // restart the animation
          post.style.animationDelay = (Math.min(i, 8) * 60) + 'ms';
          post.classList.add('is-revealed');
        });
      }, 200);
    }

    [category, sort].forEach(function (control) {
      if (control) control.addEventListener('change', change);
    });
  }

  // Popups: [data-popup="name"] dialogs, opened by every [data-popup-open="name"] (their href stays
  // as the no-JS fallback). A lead form inside switches the card to its thank-you layer on
  // 'lead:sent'; every opening starts from the form again. «Вернуться на главную» only
  // closes the popup when it is already on the home page.
  function initPopups() {
    document.querySelectorAll('[data-popup]').forEach(function (popup) {
      var name = popup.getAttribute('data-popup');
      var form = popup.querySelector('form');
      var thanks = popup.querySelector('.popup__thanks');
      var thanksTitle = thanks && thanks.querySelector('[tabindex="-1"]');
      var labelledBy = popup.getAttribute('aria-labelledby');
      // a field gets focus only with a mouse/trackpad: on phones it would open the keyboard
      var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

      function setSent(sent) {
        popup.classList.toggle('is-sent', sent);
        if (form) form.inert = sent;
        if (thanks) thanks.inert = !sent;
        popup.setAttribute('aria-labelledby', sent && thanksTitle ? thanksTitle.id : labelledBy);
      }

      var dialog = createDialog(popup, {
        panel: '.popup__panel',
        focus: finePointer ? '.popup__input' : '.popup__close',
        onOpen: function (opener) {
          setSent(false);
          if (opener) opener.setAttribute('aria-expanded', 'true');
        },
        onClose: function (opener) {
          if (opener) opener.removeAttribute('aria-expanded');
        }
      });
      setSent(false);

      // delegated, so openers inside cloned slider slides work too
      document.addEventListener('click', function (event) {
        var opener = event.target.closest('[data-popup-open="' + name + '"]');
        if (!opener) return;
        event.preventDefault();
        dialog.open(opener);
      });

      if (form) {
        form.addEventListener('lead:sent', function () {
          setSent(true);
          if (thanksTitle) thanksTitle.focus({ preventScroll: true });
        });
      }

      var back = popup.querySelector('[data-popup-back]');
      if (back) {
        back.addEventListener('click', function (event) {
          if (!samePage(back)) return;
          event.preventDefault();
          dialog.close(true);
        });
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    initFixedVh();
    initHeroVideo();
    initSmoothScroll();
    initAnchors();
    initScrollTop();
    initSliders();
    initSliderPreload();
    initShowMore();
    initFaq();
    initProductInfo();
    initGallery();
    initShare();
    initChipCounter();
    initAnimations();
    initParallax();
    initScrub();
    initForms();
    initDropdown();
    initBlog();
    initMap();
    initMenu();
    initPopups();
  });
})();
