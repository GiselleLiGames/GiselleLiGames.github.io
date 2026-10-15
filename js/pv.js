/* =============================================================
   pv.js — shared behaviour for portfolio.html + work.html
   - feedback on every press / click (squash, ring, sparks, haptic)
   - short preview clips play only while on screen
   - helpers to read works from CONFIG (config.js)
   ============================================================= */
(function () {
  'use strict';

  /* Short looping previews (3–8s, muted, 960×540) keyed by the work's
     full-length video. Add a line here when you cut a new clip. */
  var CLIPS = {
    'assets/uploads/ShadingShowreel.mp4':      'assets/clips/pbr-shaders',
    'assets/uploads/LycoriusShader迭代.mp4':   'assets/clips/lycoris',
    'assets/uploads/Eye.mp4':                  'assets/clips/eye',
    'assets/uploads/ShadowMan_Remaster.mp4':   'assets/clips/shadow-man',
    'assets/uploads/PCG.mp4':                  'assets/clips/pcg',
    'assets/uploads/Casino_CentralOrbit_2K_30fps.mp4': 'assets/clips/casino'
  };

  var PDF_PAGES = {
    'assets/uploads/Project1_Compressed.pdf': ['pbr', 7],
    'assets/uploads/Project2_Compressed.pdf': ['lycoris', 6],
    'assets/uploads/Project3_Compressed.pdf': ['pcg', 5],
    'assets/uploads/Project4_Compressed.pdf': ['tof', 5]
  };

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function lang() {
    return (document.documentElement.lang || '').indexOf('en') === 0 ? 'en' : 'zh';
  }
  function t(v) { return window.SiteCopy ? SiteCopy.text(v,lang()) : (typeof v === 'string' ? v : (v ? (v[lang()] || v.en || v.zh || '') : '')); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }
  function works() { return (typeof CONFIG !== 'undefined' && Array.isArray(CONFIG.works)) ? CONFIG.works : []; }
  function fullVideo(w) {
    var links = w.links || [];
    for (var i = 0; i < links.length; i++) {
      if (/\.(mp4|webm|mov|m4v)(\?.*)?$/i.test(links[i].href || '')) return links[i].href;
    }
    return '';
  }
  /* a work's own `clip` in config.js wins; the table above is the fallback */
  function clip(w) { var base = (w && w.clip) || CLIPS[fullVideo(w)]; return base ? { src: base + '.mp4', poster: base + '.webp' } : null; }
  function pdfPages(w) { return PDF_PAGES[w.pdf] || null; }

  /* media block: clip if we have one, else the cover image */
  function mediaHTML(w, opts) {
    opts = opts || {};
    var c = clip(w), poster = (c && c.poster) || w.image || '';
    var inner = c
      ? '<video src="' + esc(c.src) + '" poster="' + esc(poster) + '" muted loop playsinline preload="none"' + (opts.autoplay ? ' autoplay' : '') + '></video>'
      : (w.image ? '<img src="' + esc(w.image) + '" alt="" loading="lazy" decoding="async">' : '<div class="pv-ph"></div>');
    var badge = c ? (lang() === 'zh' ? '预览' : 'Preview') : (lang() === 'zh' ? '封面' : 'Cover');
    return '<div class="pv-media" data-video>' + inner +
      '<span class="pv-badge">' + badge + '</span>' + (c ? '<span class="pv-bar"><i></i></span>' : '') + '</div>';
  }

  /* ---------------- feedback ---------------- */
  var FX = '.pv-fx, .pv-card, .pv-fbtn, .pv-btn, .pv-toc a, .pv-subbar a, .pv-page-img, .nav-links a, .nav-logo, #langToggle, #navToggle, .footer-links a';
  function ring(x, y, sz) {
    if (reduced) return;
    var r = document.createElement('span');
    r.className = 'pv-ring'; r.style.left = x + 'px'; r.style.top = y + 'px'; r.style.setProperty('--sz', sz);
    document.body.appendChild(r); setTimeout(function () { r.remove(); }, 600);
  }
  function sparks(x, y, n) {
    if (reduced) return;
    for (var i = 0; i < n; i++) {
      var s = document.createElement('span'), a = (i / n) * Math.PI * 2 + Math.random() * .5, d = 24 + Math.random() * 26;
      s.className = 'pv-spark'; s.style.left = x + 'px'; s.style.top = y + 'px';
      s.style.setProperty('--dx', Math.cos(a) * d + 'px'); s.style.setProperty('--dy', Math.sin(a) * d + 'px');
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 600); })(s);
    }
  }
  document.addEventListener('pointerdown', function (e) {
    var el = e.target.closest(FX); if (!el) return;
    el.classList.add('pv-fx', 'is-pressed');
    function up() { el.classList.remove('is-pressed'); removeEventListener('pointerup', up); removeEventListener('pointercancel', up); }
    addEventListener('pointerup', up); addEventListener('pointercancel', up);
  });
  document.addEventListener('click', function (e) {
    var el = e.target.closest(FX); if (!el) return;
    if (document.body.matches('.dream-gallery, .dream-work')) return;
    var r = el.getBoundingClientRect();
    var x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
    var big = el.classList.contains('pv-card');
    ring(x, y, big ? 9 : 6); sparks(x, y, big ? 10 : 6);
    try { if (navigator.vibrate) navigator.vibrate(8); } catch (err) {}
  });
  /* cards: pointer spotlight */
  document.addEventListener('pointermove', function (e) {
    var c = e.target.closest && e.target.closest('.pv-card'); if (!c) return;
    var r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px');
  }, { passive: true });
  /* internal links: short fade-out so the page change feels connected */
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href]');
    if (!a || e.defaultPrevented || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
    var href = a.getAttribute('href');
    if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|https?:)/i.test(href) || /\.(pdf|mp4)$/i.test(href)) return;
    if (!document.body.classList.contains('pv-page')) return;
    e.preventDefault();
    document.body.classList.add('pv-leaving');
    setTimeout(function () { location.href = a.href; }, reduced ? 0 : 170);
  });
  addEventListener('pageshow', function () { document.body.classList.remove('pv-leaving'); });

  /* ---------------- clips: play while visible ---------------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      var m = en.target, v = m.querySelector('video'), on = en.isIntersecting && en.intersectionRatio > .45;
      m._on = on; m.classList.toggle('is-paused', !on);
      if (v && !v.controls) {
        if (on) { v.preload = 'auto'; var p = v.play(); if (p && p.catch) p.catch(function () {}); } else v.pause();
      }
    });
  }, { threshold: [0, .45, .8] });
  function observeMedia(root) {
    (root || document).querySelectorAll('[data-video]').forEach(function (m) { if (!m._obs) { m._obs = true; io.observe(m); } });
  }
  function tickBars() {
    document.querySelectorAll('[data-video]').forEach(function (m) {
      if (!m._on) return;
      var v = m.querySelector('video'), bar = m.querySelector('.pv-bar i');
      if (v && bar && v.duration) bar.style.width = (v.currentTime / v.duration * 100).toFixed(1) + '%';
    });
    requestAnimationFrame(tickBars);
  }
  requestAnimationFrame(tickBars);

  /* entrance */
  var rev = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); rev.unobserve(e.target); } });
  }, { threshold: .08 });
  function reveal(root) { (root || document).querySelectorAll('.pv-rise:not(.is-in)').forEach(function (el) { rev.observe(el); }); }

  /* re-render when the site's language toggle changes <html lang> */
  function onLang(fn) {
    new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  }

  window.PV = {
    lang: lang, t: t, esc: esc, works: works, fullVideo: fullVideo, clip: clip, pdfPages: pdfPages,
    mediaHTML: mediaHTML, observeMedia: observeMedia, reveal: reveal, onLang: onLang
  };
})();
