/* Fallback (no WebGL): CSS fold strips */
/* =============================================================
   pv-curtain.js — opening stage curtain with real fabric motion
   - each half is built from vertical fold strips
   - strips are pulled from the leading edge, so they start one
     after another, bunch up at the side and swing before settling
   - the hem trails the track (bottom lags the top), then sways back
   - light spills through the gap; cursor/touch ruffles the velvet
   Usage: PVCurtain.play(rootEl, { variant: 'drape' | 'tableau' | 'fly',
                                   auto: 1100, onOpen(), onDone() })
   ============================================================= */
(function () {
  var TEX = 'assets/entry/curtain/velvet-strip.webp';   // relative to the page (portfolio.html)
  var VAL = 'assets/entry/curtain/valance.webp';

  function el(tag, cls, parent) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (parent) parent.appendChild(e);
    return e;
  }

  function play(root, opts) {
    opts = opts || {};
    var variant = opts.variant || 'drape';
    var tex = opts.texture || TEX, val = opts.valance || VAL;
    var W = root.clientWidth || innerWidth, H = root.clientHeight || innerHeight;
    var phone = W < 700;
    var N = phone ? 7 : 12;                          // strips per half
    var halfW = Math.ceil(W / 2) + 2;
    var w = halfW / N;

    root.innerHTML = '';
    root.classList.add('cw', 'cw--' + variant);
    if (opts.texture) root.style.setProperty('--cw-tex', 'url("' + tex + '")');
    if (opts.valance) root.style.setProperty('--cw-val', 'url("' + val + '")');

    var beam = el('div', 'cw-beam', root);
    var seam = el('div', 'cw-seam', root);
    var halves = [], strips = [];
    ['l', 'r'].forEach(function (side) {
      var h = el('div', 'cw-half cw-half--' + side, root);
      h.style.width = halfW + 'px';
      var list = [];
      for (var i = 0; i < N; i++) {
        var s = el('div', 'cw-strip' + (i === N - 1 ? ' cw-strip--lead' : ''), h);
        s.style.left = (i * w) + 'px';
        s.style.width = (w + 1.5) + 'px';
        s.style.zIndex = i + 1;
        var fab = el('div', 'cw-fab', s);
        // continuous texture across strips; right half is mirrored by its container
        fab.style.backgroundPosition = '0 0, ' + (-i * w) + 'px 0';
        el('div', 'cw-shade', s);
        list.push({ s: s, fab: fab, i: i, t: N > 1 ? i / (N - 1) : 1 });
      }
      halves.push(h); strips.push(list);
    });
    var valance = el('div', 'cw-valance', root);
    var title = el('div', 'cw-title', root);
    title.innerHTML = (opts.title || 'GiselleLi') + (opts.subtitleHTML || '<small>' + (opts.subtitle || 'TECHNICAL ARTIST') + '</small>');
    var skip = el('div', 'cw-skip', root);
    skip.textContent = opts.skipText || 'TAP TO SKIP';

    var timers = [];
    var S = opts.slow || 1;                          // demo slow-motion factor
    var anims = [];
    function A(node, kf, o) {
      o.duration *= S; if (o.delay) o.delay *= S;
      var a = node.animate(kf, o); anims.push(a); return a;
    }
    function later(fn, t) { var id = setTimeout(fn, t * S); timers.push(id); return id; }
    var opened = false;

    /* ---------- 1. title, then the curtain "breathes" (someone behind it) ---------- */
    requestAnimationFrame(function () { root.classList.add('is-ready'); });
    later(function () {
      if (opened) return;
      A(seam, [{ opacity: 0 }, { opacity: .9 }, { opacity: .55 }], { duration: 700, fill: 'forwards', easing: 'ease-out' });
      strips.forEach(function (list) {
        list.forEach(function (st) {
          var amp = 1.6 * (0.3 + st.t);
          A(st.fab, [
            { transform: 'skewX(0deg)' }, { transform: 'skewX(' + amp + 'deg)' },
            { transform: 'skewX(' + (-amp * .5) + 'deg)' }, { transform: 'skewX(0deg)' }
          ], { duration: 900, delay: (1 - st.t) * 220, easing: 'ease-in-out' });
        });
      });
    }, 420);

    /* ---------- cursor / finger ruffles the velvet before it opens ---------- */
    var lastX = null;
    function ruffle(e) {
      if (opened) return;
      var x = e.clientX, dir = lastX == null ? 1 : Math.sign(x - lastX) || 1; lastX = x;
      strips.forEach(function (list, side) {
        list.forEach(function (st) {
          var r = st.s.getBoundingClientRect(), cx = r.left + r.width / 2;
          var d = Math.abs(cx - x) / (w * 2.2);
          if (d > 1) return;
          var k = (1 - d) * (1 - d), push = dir * (side ? -1 : 1);
          A(st.fab, [
            { transform: 'translateX(0) skewX(0)' },
            { transform: 'translateX(' + (push * 7 * k) + 'px) skewX(' + (push * 2.4 * k) + 'deg)' },
            { transform: 'translateX(' + (-push * 2 * k) + 'px) skewX(' + (-push * .8 * k) + 'deg)' },
            { transform: 'translateX(0) skewX(0)' }
          ], { duration: 650, easing: 'ease-out' });
        });
      });
    }
    root.addEventListener('pointermove', ruffle);

    /* ---------- 2. open ---------- */
    function open() {
      if (opened) return; opened = true;
      timers.forEach(clearTimeout); timers = [];
      root.classList.add('is-open');
      root.removeEventListener('pointermove', ruffle);
      var T = variant === 'fly' ? 1500 : 1700, end;
      if (variant === 'fly') end = openFly(T); else end = openSide(T, variant === 'tableau');

      A(title, [{ opacity: 1, transform: 'translate(-50%,-50%) scale(1)', filter: 'blur(0)' },
                { opacity: 0, transform: 'translate(-50%,-58%) scale(1.06)', filter: 'blur(3px)' }],
        { duration: 650, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
      A(skip, [{ opacity: .5 }, { opacity: 0 }], { duration: 200, fill: 'forwards' });
      // light floods out of the widening gap, then settles into a stage wash
      A(seam, [{ opacity: .6, transform: 'translateX(-50%) scaleX(.4)' },
               { opacity: 1, transform: 'translateX(-50%) scaleX(2.6)', offset: .45 },
               { opacity: 0, transform: 'translateX(-50%) scaleX(5)' }],
        { duration: T * 1.1, easing: 'ease-out', fill: 'forwards' });
      A(beam, [{ opacity: 0 }, { opacity: 1, offset: .35 }, { opacity: .55, offset: .75 }, { opacity: 0 }],
        { duration: T + 1300, easing: 'ease-in-out', fill: 'forwards' });

      if (opts.onOpen) later(opts.onOpen, variant === 'fly' ? 450 : 550);
      later(function () { root.classList.add('is-gone'); if (opts.onDone) opts.onDone(); }, end);
    }

    function openSide(T, tableau) {
      var G = halfW * (tableau ? 0.34 : 0.24);       // width of the bunched pile at the side
      var g = G / N, sx = tableau ? 0.52 : 0.4;
      strips.forEach(function (list) {
        list.forEach(function (st) {
          var t = st.t, x0 = st.i * w, x1 = st.i * g, dx = x1 - x0;
          var k = (phone ? 4.5 : 7) * (0.35 + 0.65 * t);  // hem lag in degrees
          var sy = tableau ? 1 - 0.8 * Math.pow(t, 1.25) : 1;  // tableau: leading edge is lifted
          var delay = (1 - t) * (tableau ? 200 : 280);    // the pull reaches outer folds last
          function tf(px, sk, sc, scy) {
            return 'translateX(' + px + 'px) skewX(' + sk + 'deg) scale(' + sc + ',' + scy + ')';
          }
          A(st.s, [
            { transform: tf(0, 0, 1, 1), easing: 'cubic-bezier(.55,0,.8,.4)' },
            { transform: tf(dx * .16, k, .96, 1 - (1 - sy) * .15), offset: .2, easing: 'cubic-bezier(.3,.4,.4,1)' },
            { transform: tf(dx * 1.035, -k * .45, sx * .92, sy * .97), offset: .58, easing: 'ease-in-out' },
            { transform: tf(dx * .99, k * .18, sx * 1.02, sy * 1.01), offset: .8, easing: 'ease-in-out' },
            { transform: tf(dx, 0, sx, sy) }
          ], { duration: T, delay: delay, fill: 'forwards' });
          A(st.s.lastChild, [{ opacity: 0 }, { opacity: .9 }], { duration: T * .7, delay: delay + T * .15, fill: 'forwards', easing: 'ease-out' });
        });
      });
      // the bunched piles hold a beat as a frame, then clear the stage
      var hold = T + 380;
      halves.forEach(function (h, side) {
        var off = (side ? 1 : -1) * (G + w + 90);
        A(h, [{ transform: (side ? 'scaleX(-1) ' : '') + 'translateX(0)' },
              { transform: (side ? 'scaleX(-1) ' : '') + 'translateX(' + (side ? -off : off) + 'px)' }],
          { duration: 700, delay: hold, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      });
      A(valance, [{ transform: 'translateY(0)' }, { transform: 'translateY(3%)', offset: .25 }, { transform: 'translateY(-115%)' }],
        { duration: 800, delay: hold - 80, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      return hold + 720;
    }

    function openFly(T) {
      var all = strips[0].concat(strips[1]);
      all.forEach(function (st) {
        var d = 1 - st.t;                             // 0 at centre, 1 at the wings
        var delay = d * 360;
        var sk = (phone ? 1.5 : 2.5) * (0.4 + d);
        A(st.s, [
          { transform: 'translateY(0) skewX(0)', easing: 'cubic-bezier(.4,0,.6,1)' },
          { transform: 'translateY(2.5%) skewX(' + (-sk) + 'deg)', offset: .16, easing: 'cubic-bezier(.6,0,.25,1)' },
          { transform: 'translateY(-108%) skewX(' + sk + 'deg)' }
        ], { duration: T, delay: delay, fill: 'forwards' });
        A(st.s.lastChild, [{ opacity: 0 }, { opacity: .7 }], { duration: T * .6, delay: delay + T * .2, fill: 'forwards' });
      });
      A(valance, [{ transform: 'translateY(0)' }, { transform: 'translateY(-130%)' }],
        { duration: 900, delay: T * .55, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      return T + 420;
    }

    later(open, opts.auto == null ? 1100 : opts.auto);
    root.addEventListener('pointerdown', open);
    function key() { open(); removeEventListener('keydown', key); }
    addEventListener('keydown', key);

    return {
      open: open,
      destroy: function () { timers.forEach(clearTimeout); anims.forEach(function (a) { a.cancel(); }); removeEventListener('keydown', key); root.innerHTML = ''; }
    };
  }

  window.PVCurtainStrips = { play: play };
})();


/* =============================================================
   pv-curtain-gl.js — opening stage curtain, rendered as a deforming
   velvet mesh in WebGL (falls back to the CSS strip version).

   How it moves
   - the pull starts at the leading edge; outer folds follow later,
     so the fabric gathers into a pile at the side
   - the hem is driven by a spring that trails the track, so the
     bottom lags behind, overshoots and swings back before settling
   - folds deepen and darken as the velvet bunches up
   - before it opens the curtain breathes, parts a crack of light,
     and the cursor / finger ruffles the fabric

   PVCurtain.play(rootEl, { variant: 'drape' | 'tableau' | 'fly',
     auto: 1100, slow: 1, texture, valance, onOpen(), onDone() })
   ============================================================= */
(function () {
  var TEX = 'assets/entry/curtain/velvet-strip.webp';
  var VAL = 'assets/entry/curtain/valance.webp';

  var VS = [
    'precision highp float;',
    'attribute vec2 aUV;',
    'uniform vec2 uRes; uniform float uSide, uHalfW, uTileW;',
    'uniform float uTop, uBot, uLag, uGather, uExit, uMode, uBreath, uTime, uCrack;',
    'uniform vec4 uPoke;',            // x, y, strength (signed), unused
    'varying vec2 vUV; varying vec2 vTex; varying float vE; varying float vShade;',
    'float ease(float x){ float c = clamp(x, 0.0, 1.0); float s = c*c*(3.0-2.0*c); return x > 1.0 ? x : s; }',
    'float col(float u, float p){ float d = uMode > 1.5 ? 1.0 - sin(u * 1.5708) : 1.0 - u; return (p - d*uLag) / (1.0 - uLag); }',
    'void main(){',
    '  float u = aUV.x, v = aUV.y, H = uRes.y;',
    '  float wv = pow(v, 1.35);',                                    // how much a point hangs (0 top, 1 hem)
    '  float pTop = col(u, uTop), pBot = col(u, uBot);',
    '  float pc = mix(pTop, pBot, uMode > 1.5 ? wv * 0.35 : wv);',
    '  pc = clamp(pc, 0.0, 1.18);',
    '  float e = ease(pc);',
    '  float x = u * uHalfW, y = v * H;',
    '  if (uMode < 1.5) {',                                         // drape / tableau: traverse to the side
    '    x = mix(u * uHalfW, u * uGather, e);',
    '    if (uMode > 0.5) y = v * H * (1.0 - 0.8 * min(e, 1.0) * pow(smoothstep(0.0, 1.0, u), 1.15));',
    '    x -= uExit * (uGather + 90.0) + uCrack * smoothstep(0.8, 1.0, u) * (0.6 + 0.4 * v);',
    '  } else {',                                                    // fly: rises, centre first
    '    float dip = 0.05 * sin(3.14159 * clamp(pc / 0.28, 0.0, 1.0)) * step(pc, 0.28);',
    '    y = v * H - H * 1.18 * (ease(pc) - dip) * (0.9 + 0.1 * v);',
    '  }',
    '  float sx = uSide < 0.0 ? x : uRes.x - x;',
    '  float breathe = uBreath * sin(uTime * 2.2 + u * 9.0) * 3.0 * wv;',
    '  float d = (sx - uPoke.x) / 130.0;',
    '  float poke = uPoke.z * exp(-d*d) * wv * 16.0 * cos(d * 2.4);',
    '  sx += breathe + poke;',
    '  float comp = uMode < 1.5 ? mix(1.0, uGather / uHalfW, clamp(e, 0.0, 1.0)) : 1.0;',
    '  vE = uMode < 1.5 ? clamp(e, 0.0, 1.0) : 0.0;',
    '  float fold = sin(u * 74.0) * vE / comp * 0.06 + poke * 0.02 * uSide;',
    '  vShade = fold;',
    '  vUV = aUV; vTex = vec2(u * uHalfW / uTileW, v);',
    '  gl_Position = vec4(sx / uRes.x * 2.0 - 1.0, 1.0 - y / H * 2.0, 0.0, 1.0);',
    '}'
  ].join('\n');

  var FS = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH', 'precision highp float;', '#else', 'precision mediump float;', '#endif',
    'uniform sampler2D uTex; uniform vec2 uRes; uniform float uHalfW, uMode, uFringe;',
    'varying vec2 vUV; varying vec2 vTex; varying float vE; varying float vShade;',
    'void main(){',
    '  vec3 c = texture2D(uTex, vTex).rgb;',
    '  c = pow(c, vec3(1.0 + 0.9 * vE)) * (1.0 - 0.28 * vE);',          // folds get deeper as it bunches
    '  float f = clamp(vShade, -1.0, 1.0);',
    '  c *= 1.0 + f * 2.2; c += vec3(0.35, 0.12, 0.08) * max(f, 0.0) * 0.9;',  // velvet sheen on fold crests
    '  float v = vUV.y;',
    '  c *= mix(0.45, 1.0, smoothstep(0.0, 0.2, v)) * mix(1.0, 0.3, smoothstep(0.72, 1.0, v));',
    '  float hem = 1.0 - uFringe;',
    '  if (v > hem) {',                                                 // gold fringe on the hem
    '    float k = (v - hem) / uFringe;',
    '    vec3 band = mix(vec3(0.95, 0.76, 0.48), vec3(0.54, 0.29, 0.1), k * 2.0);',
    '    float tassel = step(0.45, fract(vUV.x * uHalfW / 5.0));',
    '    vec3 fr = mix(vec3(0.47, 0.24, 0.09), vec3(1.0, 0.84, 0.55), tassel);',
    '    c = k < 0.45 ? band : fr * (1.0 - vE * 0.35);',
    '  }',
    '  if (uMode < 1.5 && vUV.x > 1.0 - 4.0 / uHalfW) c = mix(vec3(0.47,0.23,0.08), vec3(0.89,0.69,0.38), step(1.0 - 2.5 / uHalfW, vUV.x));',
    '  gl_FragColor = vec4(c, 1.0);',
    '}'
  ].join('\n');

  function el(tag, cls, parent) { var e = document.createElement(tag); if (cls) e.className = cls; if (parent) parent.appendChild(e); return e; }

  function loadImg(src) {
    return new Promise(function (res, rej) { var i = new Image(); i.onload = function () { res(i); }; i.onerror = rej; i.src = src; });
  }

  function play(root, opts) {
    opts = opts || {};
    var canvas = document.createElement('canvas');
    var gl = canvas.getContext('webgl', { premultipliedAlpha: true, antialias: true, alpha: true });
    if (!gl || !window.Promise) {
      return window.PVCurtainStrips ? window.PVCurtainStrips.play(root, opts) : (root.remove(), null);
    }
    var variant = opts.variant || 'drape', mode = variant === 'tableau' ? 1 : variant === 'fly' ? 2 : 0;
    var S = opts.slow || 1;
    root.innerHTML = '';
    root.className = (root.className.replace(/\bcw\S*/g, '') + ' cw cw--gl cw--' + variant).trim();
    if (opts.valance) root.style.setProperty('--cw-val', 'url("' + opts.valance + '")');

    var beam = el('div', 'cw-beam', root);
    var seam = el('div', 'cw-seam', root);
    canvas.className = 'cw-canvas'; root.appendChild(canvas);
    var valance = el('div', 'cw-valance', root);
    var title = el('div', 'cw-title', root);
    title.innerHTML = (opts.title || 'GiselleLi') + (opts.subtitleHTML || '<small>' + (opts.subtitle || 'TECHNICAL ARTIST') + '</small>');
    var skip = el('div', 'cw-skip', root);
    skip.textContent = opts.skipText || 'TAP TO SKIP';

    try { return run(); } catch (err) {
      if (window.console) console.warn('[curtain] WebGL failed, using CSS fallback', err);
      root.innerHTML = '';
      return window.PVCurtainStrips ? window.PVCurtainStrips.play(root, opts) : null;
    }
    function run() {
    /* ---------- GL setup ---------- */
    function sh(type, src) { var s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; }
    var prog = gl.createProgram();
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
    gl.useProgram(prog);
    var U = {};
    ['uRes', 'uSide', 'uHalfW', 'uTileW', 'uTop', 'uBot', 'uLag', 'uGather', 'uExit', 'uMode', 'uBreath', 'uTime', 'uPoke', 'uTex', 'uFringe', 'uCrack']
      .forEach(function (n) { U[n] = gl.getUniformLocation(prog, n); });

    var COLS = 120, ROWS = 28, data = [], idx = [];
    for (var r = 0; r <= ROWS; r++) for (var c = 0; c <= COLS; c++) data.push(c / COLS, r / ROWS);
    for (r = 0; r < ROWS; r++) for (c = 0; c < COLS; c++) {
      var a = r * (COLS + 1) + c, b = a + 1, d = a + COLS + 1, e = d + 1;
      idx.push(a, d, b, b, d, e);
    }
    var vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
    var ib = gl.createBuffer(); gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ib); gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(idx), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, 'aUV'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var tex = gl.createTexture(), texReady = false;
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([58, 13, 11, 255]));
    loadImg(opts.texture || TEX).then(function (img) {
      // WebGL1 needs power-of-two sizes to repeat
      var cv = document.createElement('canvas'); cv.width = 512; cv.height = 1024;
      cv.getContext('2d').drawImage(img, 0, 0, 512, 1024);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, cv);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      texReady = true;
    }).catch(function () {});
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    var W, H, dpr;
    function size() {
      W = root.clientWidth || innerWidth; H = root.clientHeight || innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    size(); addEventListener('resize', size);

    /* ---------- timeline state ---------- */
    var phone = W < 700;
    var st = { top: 0, bot: 0, vel: 0, exit: 0, breath: 1, poke: 0, pokeX: -1e4, lastX: null };
    var opened = false, openAt = 0, done = false, t0 = performance.now();
    var D = (mode === 2 ? 1500 : 1650) * S;           // track travel time
    var gatherK = mode === 1 ? 0.34 : 0.22;

    function tween(t) { return t <= 0 ? 0 : t >= 1 ? 1 : t; } // linear; per-column smoothing happens in the shader

    function frame(now) {
      if (done) return;
      var dt = Math.min(0.05, (now - (frame.last || now)) / 1000) / S; frame.last = now;
      var t = now - t0;
      root.classList.toggle('is-ready', t > 30);

      // track progress
      var target;
      st.crack = opened ? Math.max(0, (st.crack || 0) - dt * 40) : (t > 420 * S ? Math.min(1, (t - 420 * S) / (500 * S)) * (phone ? 4 : 7) : 0);  // a crack of light
      target = opened ? tween((now - openAt) / D) : 0;
      st.top = target;
      // hem spring follows the track: lags, overshoots, swings back
      var k = mode === 2 ? 80 : 62, damp = mode === 2 ? 12 : 6.4;
      var acc = k * (st.top - st.bot) - damp * st.vel;
      st.vel += acc * dt; st.bot += st.vel * dt;

      if (opened) {
        var since = (now - openAt) / S;
        st.breath = Math.max(0, st.breath - dt * 3);
        if (mode < 2) st.exit = Math.min(1, Math.max(0, (since - (1650 + 520)) / 620)), st.exit = st.exit * st.exit * (3 - 2 * st.exit);
      }
      st.poke *= Math.pow(0.04, dt);

      var halfW = Math.ceil(W / 2) + 2;
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform2f(U.uRes, W, H);
      gl.uniform1f(U.uHalfW, halfW);
      gl.uniform1f(U.uTileW, Math.min(H * 407 / 900, W * 0.32));
      gl.uniform1f(U.uTop, st.top); gl.uniform1f(U.uBot, st.bot);
      gl.uniform1f(U.uLag, mode === 2 ? 0.3 : 0.24);
      gl.uniform1f(U.uGather, halfW * gatherK);
      gl.uniform1f(U.uExit, st.exit);
      gl.uniform1f(U.uMode, mode);
      gl.uniform1f(U.uBreath, st.breath * (phone ? 0.6 : 1));
      gl.uniform1f(U.uTime, t / 1000 / S);
      gl.uniform4f(U.uPoke, st.pokeX, 0, st.poke, 0);
      gl.uniform1f(U.uFringe, 13 / H);
      gl.uniform1f(U.uCrack, st.crack);
      gl.uniform1i(U.uTex, 0);
      gl.uniform1f(U.uSide, -1); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);
      gl.uniform1f(U.uSide, 1); gl.drawElements(gl.TRIANGLES, idx.length, gl.UNSIGNED_SHORT, 0);

      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function ruffle(e) {
      if (opened) return;
      var x = e.clientX, dx = st.lastX == null ? 0 : x - st.lastX; st.lastX = x;
      st.pokeX = x;
      st.poke = Math.max(-1, Math.min(1, st.poke + dx / 90));
    }
    root.addEventListener('pointermove', ruffle);

    var timers = [];
    function later(fn, t) { timers.push(setTimeout(fn, t * S)); }
    later(function () { if (!opened) seam.animate([{ opacity: 0 }, { opacity: .85 }], { duration: 600 * S, fill: 'forwards' }); }, 420);

    function open() {
      if (opened) return; opened = true; openAt = performance.now();
      timers.forEach(clearTimeout); timers = [];
      root.classList.add('is-open');
      title.animate([{ opacity: 1, transform: 'translate(-50%,-50%) scale(1)', filter: 'blur(0)' },
                     { opacity: 0, transform: 'translate(-50%,-58%) scale(1.06)', filter: 'blur(3px)' }],
        { duration: 650 * S, easing: 'cubic-bezier(.5,0,.75,0)', fill: 'forwards' });
      skip.animate([{ opacity: .5 }, { opacity: 0 }], { duration: 200 * S, fill: 'forwards' });
      seam.animate([{ opacity: .85, transform: 'translateX(-50%) scaleX(.5)' },
                    { opacity: 1, transform: 'translateX(-50%) scaleX(2.8)', offset: .4 },
                    { opacity: 0, transform: 'translateX(-50%) scaleX(5)' }],
        { duration: 1900 * S, easing: 'ease-out', fill: 'forwards' });
      beam.animate([{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: .5, offset: .75 }, { opacity: 0 }],
        { duration: 3000 * S, easing: 'ease-in-out', fill: 'forwards' });
      var vDelay = mode === 2 ? 800 : 2100;
      valance.animate([{ transform: 'translateY(0)' }, { transform: 'translateY(4%)', offset: .25 }, { transform: 'translateY(-125%)' }],
        { duration: 800 * S, delay: vDelay * S, easing: 'cubic-bezier(.6,0,.3,1)', fill: 'forwards' });
      if (opts.onOpen) later(opts.onOpen, mode === 2 ? 420 : 520);
      var end = mode === 2 ? 2300 : 2850;
      later(function () {
        root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250 * S, fill: 'forwards' }).onfinish = finish;
      }, end);
    }
    function finish() {
      done = true; removeEventListener('resize', size); removeEventListener('keydown', key);
      root.classList.add('is-gone');
      var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext();
      if (opts.onDone) opts.onDone();
    }
    later(open, opts.auto == null ? 1100 : opts.auto);
    root.addEventListener('pointerdown', open);
    function key() { open(); }
    addEventListener('keydown', key);

    return {
      open: open,
      destroy: function () { done = true; timers.forEach(clearTimeout); removeEventListener('keydown', key); removeEventListener('resize', size);
        var lose = gl.getExtension('WEBGL_lose_context'); if (lose) lose.loseContext(); root.innerHTML = ''; }
    };
    }
  }

  window.PVCurtain = { play: play };
})();
