(function () {
  'use strict';
  var scriptURL = document.currentScript.src;
  var root = document.querySelector('[data-companion]');
  if (!root) return;
  var asset = function (name) { return new URL('../assets/companion/' + name, scriptURL).href; };
  var motion = matchMedia('(prefers-reduced-motion: reduce)');
  var reduced = motion.matches;
  var W = 1372, H = 1147, canvas, ctx, base, iris, body, thumbs, mesh;
  var texture = document.createElement('canvas'); texture.width = W; texture.height = H;
  var springs = {}, gestureAt = Infinity, gestureStart = -Infinity, gestureDir = 1, helloAt = -Infinity;
  var raf = 0, ready = false, visible = false, focused = false, lastFrame = 0;
  var pointer = null, gaze = { x: 0, y: 0 }, lastActivity = performance.now();
  var blinkAt = Infinity, blinkStart = -Infinity, pressAt = -Infinity, shyAt = -Infinity;
  var enterAt = Infinity, lastTap = -Infinity, tapCount = 0, eventAt = -Infinity;
  var eyeShape = new Path2D('M520 493 C519 463 545 441 575 442 C603 441 625 454 632 479 C642 505 633 532 608 540 C570 552 535 537 523 514 Z');
  var eyePatch = new Path2D('M509 479 C512 457 528 431 551 425 C582 416 616 428 634 451 L639 486 C649 520 630 549 596 553 C555 558 528 541 515 519 Z');
  root.innerHTML = '<svg width="0" height="0" aria-hidden="true" style="position:absolute"><defs><clipPath id="oc-portal-clip" clipPathUnits="objectBoundingBox"><path d="M0 0H1V.643H.833333A.333333 .357143 0 0 1 .166667 .643H0Z"/></clipPath></defs></svg>' +
    '<span class="oc-portal" aria-hidden="true"></span>' +
    '<div class="oc-stage"><img class="oc-fallback" src="' + asset('oc-idle-v1.png') + '" alt="" width="1372" height="1146"><canvas width="1372" height="1147" aria-hidden="true"></canvas></div>' +
    '<span class="oc-front" aria-hidden="true"></span><button type="button" class="oc-face"></button>' +
    '<span class="oc-spark" aria-hidden="true">✦</span>';
  canvas = root.querySelector('canvas');
  ctx = texture.getContext('2d');
  var face = root.querySelector('.oc-face');
  function label() {
    var en = document.documentElement.lang === 'en';
    root.setAttribute('aria-label', en ? 'Your controller-holding browsing companion' : '拿着手柄陪你浏览的小搭档');
    face.setAttribute('aria-label', en ? 'Say hello to your companion' : '戳戳小搭档的脸');
  }
  label();
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  function image(src) {
    return new Promise(function (resolve, reject) {
      var img = new Image(); img.onload = function () { resolve(img); }; img.onerror = reject; img.src = src;
    });
  }
  function layer(path, subtract) {
    var c = document.createElement('canvas'); c.width = W; c.height = H;
    var g = c.getContext('2d'); g.drawImage(base, 0, 0, W, H);
    g.globalCompositeOperation = subtract ? 'destination-out' : 'destination-in';
    g.fill(path); return c;
  }
  // The connected mesh articulates the neck and hair without exposing cut edges.
  var thumbMasks = [
    new Path2D('M509 787 Q532 763 558 767 Q584 765 601 778 Q607 791 588 797 L550 791 Q531 793 520 806Z'),
    new Path2D('M871 787 Q849 763 823 767 Q797 765 780 778 Q774 791 793 797 L831 791 Q850 793 861 806Z')
  ];
  Promise.all([image(asset('oc-sclera-v2.png')), image(asset('oc-iris-v2.png'))]).then(function (imgs) {
    base = imgs[0]; iris = imgs[1]; body = document.createElement('canvas'); body.width = W; body.height = H;
    thumbs = thumbMasks.map(function (mask) { return layer(mask, false); });
    var bodyCtx = body.getContext('2d'); bodyCtx.drawImage(base, 0, 0, W, H); bodyCtx.fillStyle = '#2e2a3e';
    thumbMasks.forEach(function (mask) { bodyCtx.fill(mask); });
    mesh = new window.OCMesh(canvas, texture, W, H); canvas = mesh.canvas;
    root.dataset.renderer = mesh.gl ? 'webgl' : 'canvas2d';
    canvas.addEventListener('webglcontextlost', function (e) { e.preventDefault(); root.classList.remove('is-ready'); cancelAnimationFrame(raf); });
    canvas.addEventListener('webglcontextrestored', function () { mesh = new window.OCMesh(canvas, texture, W, H); canvas = mesh.canvas; root.classList.add('is-ready'); update(); });
    ready = true;
    function startEntry(delay) {
      enterAt = performance.now() + delay;
      blinkAt = enterAt + 1200 + Math.random() * 1800;
      gestureAt = enterAt + 3200 + Math.random() * 2400;
    }
    var intro = document.querySelector('.anime-intro');
    if (!intro) startEntry(80);
    else {
      // Play the jump as the intro opens, rather than behind its closed panels.
      var introObserver = new MutationObserver(checkIntro);
      function checkIntro() {
        if (!intro.isConnected || intro.classList.contains('is-opening') || intro.classList.contains('is-done')) {
          startEntry(intro.isConnected ? 300 : 40); introObserver.disconnect();
        }
      }
      introObserver.observe(intro, { attributes: true, attributeFilter: ['class'] });
      introObserver.observe(document.body, { childList: true }); checkIntro();
    }
    render(performance.now()); root.classList.add('is-ready'); update();
  }).catch(function () { root.dataset.assetError = 'true'; }); // Keep the complete neutral fallback.
  function clamp(n, min, max) { return Math.max(min, Math.min(max, n)); }
  function spring(name, target, dt, stiffness, damping, quiet) {
    var s = springs[name] || (springs[name] = { value: 0, velocity: 0 });
    if (quiet) { s.value = target; s.velocity = 0; return target; }
    s.velocity += ((target - s.value) * stiffness * 1.9 - s.velocity * damping * 1.38) * dt;
    s.value += s.velocity * dt; return s.value;
  }
  function mirror(path, right) {
    if (!right) return path;
    var p = new Path2D(); p.addPath(path, new DOMMatrix().translate(1378, 0).scale(-1, 1)); return p;
  }
  function eye(right, openness, x, y) {
    var cx = right ? 796 : 582, cy = 493;
    if (openness < .995) {
      // Cover the original open eyelash before drawing the moving lid. Iris never scales.
      ctx.save(); ctx.clip(mirror(eyePatch, right));
      var skin = ctx.createLinearGradient(0, 426, 0, 558);
      skin.addColorStop(0, '#ffe5d7'); skin.addColorStop(1, '#ffebd9');
      ctx.fillStyle = skin; ctx.fillRect(right ? 733 : 508, 414, 145, 147); ctx.restore();
    }
    var aperture = new Path2D();
    aperture.addPath(eyeShape, new DOMMatrix().translate(0, 501).scale(1, Math.max(.012, openness)).translate(0, -501));
    aperture = mirror(aperture, right);
    ctx.save(); ctx.clip(aperture);
    if (openness < .995) { ctx.fillStyle = '#fffaf3'; ctx.fillRect(cx - 80, 430, 160, 130); }
    // Crop only the alpha-padded iris texture, not a piece of a complete face.
    ctx.drawImage(iris, 166, 168, 820, 1048, cx - 39 + x, cy - 46 + y, 78, 96);
    var shadow = ctx.createLinearGradient(0, 444, 0, 493);
    shadow.addColorStop(0, '#59304e33'); shadow.addColorStop(1, '#59304e00');
    ctx.fillStyle = shadow; ctx.fillRect(cx - 80, 420, 160, 150); ctx.restore();
    if (openness < .995) {
      ctx.save(); if (right) { ctx.translate(1378, 0); ctx.scale(-1, 1); }
      function lidY(y0, closedY) { return y0 * openness + (closedY || 501) * (1 - openness); }
      ctx.beginPath(); ctx.moveTo(518, lidY(487, 507));
      ctx.bezierCurveTo(528, lidY(447, 489), 597, lidY(420, 488), 633, lidY(472, 507));
      ctx.strokeStyle = '#432c43'; ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(521, lidY(482)); ctx.lineTo(508, lidY(470));
      ctx.moveTo(527, lidY(465)); ctx.lineTo(517, lidY(451)); ctx.lineWidth = 5; ctx.stroke(); ctx.restore();
    }
  }
  function render(now) {
    if (!ready) return;
    var quiet = reduced || focused || document.body.classList.contains('dream-preview-open');
    var dt = clamp((now - lastFrame) / 1000 || .016, .001, .05); lastFrame = now;
    var music = window.SiteAudio ? SiteAudio.motion() : { playing: false, energy: 0, beat: 0, sway: 0 };
    var dancing = !quiet && music.playing && music.energy > .015;
    var danceBeat = spring('danceBeat', dancing ? music.beat : 0, dt, 160, 17, quiet);
    var danceSway = spring('danceSway', dancing ? music.sway : 0, dt, 75, 12, quiet);
    var idle = !quiet && !dancing && now - lastActivity > 16000;
    var r = canvas.getBoundingClientRect(), dx = 0, dy = 0, near = 0;
    if (pointer && !quiet && !idle) {
      dx = clamp((pointer.x - (r.left + r.width * .5)) / 260, -1, 1);
      dy = clamp((pointer.y - (r.top + r.height * .48)) / 220, -1, 1);
      var distance = Math.hypot(pointer.x - (r.left + r.width * .5), pointer.y - (r.top + r.height * .48));
      near = clamp(1 - distance / Math.max(50, r.width * .16), 0, 1);
    }
    var press = quiet ? 0 : clamp((now - pressAt) / 480, 0, 1);
    var pressing = press > 0 && press < 1;
    var nod = pressing ? Math.sin(press * Math.PI) : 0;
    var shyT = (now - shyAt) / (tapCount > 1 ? 700 : 420);
    var shy = !quiet && shyT >= 0 && shyT < 1 ? Math.sin(shyT * Math.PI) : 0;
    if (!quiet && now >= gestureAt) { gestureStart = now; gestureDir *= -1; gestureAt = now + 4500 + Math.random() * 3500; }
    var gestureT = (now - gestureStart) / 1200;
    var gesture = !quiet && !idle && gestureT >= 0 && gestureT < 1 ? Math.sin(gestureT * Math.PI) : 0;
    var helloT = (now - helloAt) / 650;
    var hello = !quiet && helloT >= 0 && helloT < 1 ? Math.sin(helloT * Math.PI) : 0;
    if (!pointer && gesture) { dx = gesture * gestureDir * .45; dy = -.12 * gesture; }
    if (pressing) { dx = 0; dy = .9 * nod; }
    if (idle) { dx = Math.sin(now / 3100) * .14; dy = .25; }
    var smooth = 1 - Math.exp(-dt / .085);
    gaze.x += ((quiet ? 0 : dx * 14) - gaze.x) * smooth;
    gaze.y += ((quiet ? 0 : dy * 9) - gaze.y) * smooth;
    var seconds = now / 1000 * 1.35;
    var breath = quiet ? 0 : Math.sin(seconds * 1.65);
    var bodyAngle = spring('body', quiet ? 0 : dx * -.011 + Math.sin(seconds * .83) * .006 - shy * .019 + danceSway * .045, dt, 38, 10, quiet);
    var headAngle = spring('head', quiet ? 0 : dx * .039 + Math.sin(seconds * .94 + .8) * .014 + shy * .075 + gesture * gestureDir * .018 + danceSway * .075, dt, 76, 11, quiet);
    var headX = spring('headX', quiet ? 0 : dx * 12, dt, 60, 12, quiet);
    var headY = spring('headY', quiet ? 0 : dy * 8 + nod * 19 + shy * 6 - hello * 10 + (idle ? 9 : 0) - danceBeat * 14, dt, 68, 12, quiet);
    var headSpeed = springs.head.velocity;
    var hairL = spring('hairL', quiet ? 0 : clamp(-headAngle * .7 - headSpeed * .23 + Math.sin(seconds * 1.3) * .021 + shy * .05, -.13, .13), dt, 30, 5, quiet);
    var hairR = spring('hairR', quiet ? 0 : clamp(-headAngle * .7 - headSpeed * .21 + Math.sin(seconds * 1.3 + 1.3) * .022 - shy * .04, -.13, .13), dt, 26, 5, quiet);
    var tuftAngle = spring('tuft', quiet ? 0 : clamp(-headAngle * 1.2 - headSpeed * .4 + Math.sin(seconds * 1.9) * .055 + hello * .13, -.3, .3), dt, 45, 5, quiet);
    if (!quiet && now >= blinkAt) { blinkStart = now; blinkAt = now + 3000 + Math.random() * 4300; }
    var b = (now - blinkStart) / 130;
    var blink = !quiet && b >= 0 && b < 1 ? Math.pow(Math.sin(b * Math.PI), .7) : 0;
    var openness = 1 - Math.max(blink, shy * .98, idle ? .35 : 0);
    var entry = quiet ? 1 : clamp((now - enterAt) / 620, 0, 1);
    var e = entry - 1, rise = entry < 1 ? -(2.9 * e * e * e + 1.9 * e * e) * 760 : 0;
    ctx.clearRect(0, 0, W, H); ctx.save();
    ctx.drawImage(body, 0, 0);
    // The two thumbs are small, separately masked pieces; the forearms stay still.
    thumbs.forEach(function (thumb, i) {
      var pivot = i ? 859 : 521;
      ctx.save(); ctx.translate(pivot, 801 + nod * 2);
      ctx.rotate(nod * (i ? -.035 : .035)); ctx.translate(-pivot, -801);
      ctx.drawImage(thumb, 0, 0); ctx.restore();
    });
    eye(false, openness, gaze.x, gaze.y); eye(true, openness, gaze.x, gaze.y);
    if (shy > .03) {
      [550, 825].forEach(function (x) { var blush = ctx.createRadialGradient(x, 570, 0, x, 570, 55); blush.addColorStop(0, 'rgba(255,93,135,' + shy * .28 + ')'); blush.addColorStop(1, '#ff5d8700'); ctx.fillStyle = blush; ctx.fillRect(x - 55, 515, 110, 110); });
    }
    if (pressing) {
      // A short button light confirms the same selection as the project preview.
      ctx.fillStyle = 'rgba(102,204,255,' + nod * .8 + ')'; ctx.shadowColor = '#66ccff'; ctx.shadowBlur = 10;
      ctx.beginPath(); ctx.arc(812, 801, 5, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0;
    }
    ctx.restore();
    mesh.draw({ body: bodyAngle, head: headAngle, headX: headX, headY: headY,
      hairL: hairL, hairR: hairR, tuft: tuftAngle,
      yaw: quiet ? 0 : dx, pitch: quiet ? 0 : dy + nod * .5,
      faceWidth: quiet ? 1 : 1 - Math.abs(dx) * .025 - near * .014,
      breath: breath, x: quiet ? 0 : Math.sin(seconds * .83) * 4 + danceSway * 14,
      y: quiet ? 0 : -hello * 9 - shy * 4 - danceBeat * 18,
      pad: quiet ? 0 : Math.sin(seconds * 1.4 + .8) * .009 + nod * .018 - danceSway * .035,
      padY: quiet ? 0 : -breath * 4 + nod * 5 - danceBeat * 7, rise: rise,
      stretch: (entry < 1 ? Math.sin(entry * Math.PI * 2) * .028 : 0) - danceBeat * .01 });
    root.dataset.state = quiet ? 'quiet' : entry < 1 ? 'enter' : shy > .03 ? 'shy' : pressing ? 'controller' : dancing ? 'dance' : idle ? 'idle' : near > .1 ? 'curious' : 'watch';
    root.dataset.musicEnergy = music.energy.toFixed(3); root.dataset.musicBeat = danceBeat.toFixed(3);
    root.dataset.musicPhase = String(music.phase || 0); root.dataset.musicTime = String(music.time || 0);
    root.dataset.gazeX = gaze.x.toFixed(2); root.dataset.gazeY = gaze.y.toFixed(2);
    root.dataset.headAngle = headAngle.toFixed(4); root.dataset.hairAngle = hairL.toFixed(4);
    root.dataset.entryRise = rise.toFixed(1);
  }
  function running() { return ready && visible && !document.hidden && !reduced && !focused && !document.body.classList.contains('dream-preview-open'); }
  function frame(now) {
    raf = 0; if (!running()) return;
    if (now - lastFrame >= 1000 / (mesh.gl ? 45 : 24)) render(now);
    raf = requestAnimationFrame(frame);
  }
  function update() {
    cancelAnimationFrame(raf); raf = 0;
    if (!ready) return;
    if (!running()) {
      if (reduced || focused || document.body.classList.contains('dream-preview-open')) gaze = { x: 0, y: 0 };
      render(performance.now());
    } else { lastFrame = performance.now(); raf = requestAnimationFrame(frame); }
  }
  function activity() { lastActivity = performance.now(); }
  document.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    pointer = { x: e.clientX, y: e.clientY }; activity();
  }, { passive: true });
  document.documentElement.addEventListener('pointerleave', function () { pointer = null; });
  document.addEventListener('pointerdown', activity, { passive: true });
  document.addEventListener('keydown', activity);
  addEventListener('scroll', activity, { passive: true });
  face.addEventListener('click', function (e) {
    e.stopPropagation();
    var now = performance.now(); tapCount = now - lastTap < 900 ? Math.min(tapCount + 1, 3) : 1;
    lastTap = now; shyAt = now; activity();
    if (reduced) { blinkStart = -Infinity; render(now); }
  });
  face.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') { helloAt = performance.now(); activity(); } });
  function controller() {
    var now = performance.now(); activity();
    if (now - eventAt < 300 || reduced || document.body.classList.contains('dream-preview-open')) return;
    eventAt = now; pressAt = now; root.classList.remove('is-pressed');
    void root.offsetWidth; root.classList.add('is-pressed');
  }
  document.addEventListener('anime:preview', controller);
  document.addEventListener('focusin', function (e) { focused = e.target.matches('input,textarea,select,[contenteditable="true"]'); update(); });
  document.addEventListener('focusout', function () { focused = false; update(); });
  new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) { activity(); lastFrame = performance.now(); }
    update();
  }, { threshold: .02 }).observe(root);
  new MutationObserver(update).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  document.addEventListener('visibilitychange', update);
  addEventListener('pageshow', function () { activity(); update(); });
  addEventListener('pagehide', function () { cancelAnimationFrame(raf); raf = 0; });
  motion.addEventListener('change', function (e) { reduced = e.matches; update(); });
})();
