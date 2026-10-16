(function mountSiteAudio() {
  'use strict';
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', mountSiteAudio, { once: true }); return; }
  if (window.SiteAudio && window.SiteAudio.destroy) window.SiteAudio.destroy();
  var cfg = window.PORTFOLIO_AUDIO || {};
  var script = new URL('js/site-audio.js', document.baseURI).href;
  var host = document.querySelector('.top-nav'); if (!host) return;
  var ui = document.createElement('div'); ui.className = 'site-audio';
  ui.innerHTML = '<button type="button" data-sound aria-pressed="false"></button><button type="button" data-play disabled></button>' +
    '<label class="site-audio-volume"><span>♪</span><input type="range" min="0" max="100" step="1" value="35"><output data-volume-value>35%</output></label>' +
    '<span class="site-audio-meter" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>' +
    '<span class="site-audio-status" role="status" aria-live="polite"></span>';
  host.insertBefore(ui, host.querySelector('.lang-toggle'));
  var power = ui.querySelector('[data-sound]'), play = ui.querySelector('[data-play]'), volume = ui.querySelector('[type=range]');
  var status = ui.querySelector('[role=status]'), bars = ui.querySelectorAll('.site-audio-meter i');
  var previous = document.getElementById('portfolio-bgm');
  if (previous) { previous.pause(); previous.removeAttribute('src'); previous.load(); previous.remove(); }
  var music = document.createElement('audio'); music.id = 'portfolio-bgm'; music.hidden = true;
  music.loop = true; music.preload = 'none'; document.body.appendChild(music);
  var disposed = false, playToken = 0, owner = String(Date.now()) + Math.random();
  var context, master, sfxGain, musicGain, analyser, mediaNode, enabled = false, raf = 0, sourceReady = false;
  var buffers = {}, pending, voices = [], cooldown = {}, objectURL = '', suppressed = 0;
  var rms = 0, bassMean = 0, lastBeat = -Infinity, interval = 500, pulse = 0, beatCount = 0, previousBass = 0;
  var snapshot = { playing: false, energy: 0, beat: 0, sway: 0 }, resumeAfterHidden = false, notice = '';
  var wave, spectrum, lastTick = 0, lastSelection = document.querySelector('.anime-preview img');
  var autoPending = cfg.autoplay === true, userPaused = false;
  try { if (sessionStorage.getItem('site-audio-enabled') === 'false') autoPending = false; } catch (_) {}
  var iconStart = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  var speaker = '<path d="M11 4 6 8H3v8h3l5 4z"/>';
  lastSelection = lastSelection ? lastSelection.getAttribute('src') : '';
  var sounds = { browse: ['rhythm/browse.wav', .25], switch: ['rhythm/switch.wav', .30], confirm: ['rhythm/confirm.wav', .32], back: ['rhythm/back.wav', .28], pet: ['rhythm/pet.wav', .25], ready: ['rhythm/ready.wav', .25] };
  function asset(name) { return new URL('../assets/audio/' + name, script).href; }
  function L(zh, en) { return document.documentElement.lang === 'en' ? en : zh; }
  function label() {
    var soundLabel = enabled ? L('关闭声音', 'Mute sound') : L('开启声音', 'Enable sound');
    power.innerHTML = iconStart + speaker + (enabled ? '<path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>' : '<path d="m16 9 5 6m0-6-5 6"/>') + '</svg>';
    power.setAttribute('aria-label', soundLabel); power.title = soundLabel;
    power.setAttribute('aria-pressed', String(enabled));
    var playLabel = !sourceReady ? L('BGM 准备中', 'BGM soon') : music.paused ? L('播放 BGM', 'Play BGM') : L('暂停 BGM', 'Pause BGM');
    play.innerHTML = iconStart + (music.paused ? '<path d="m8 4 12 8-12 8z" fill="currentColor" stroke="none"/>' : '<path d="M8 5v14m8-14v14" stroke-width="4"/>') + '</svg>';
    play.setAttribute('aria-label', playLabel); play.title = playLabel;
    play.disabled = !sourceReady; volume.setAttribute('aria-label', L('网站音量', 'Site volume'));
    status.textContent = notice;
  }
  function save() { try { localStorage.setItem('site-audio-volume', volume.value); } catch (_) {} }
  var defaultVolume = Number.isFinite(cfg.volume) ? cfg.volume : .35;
  var outputGain = Number.isFinite(cfg.outputGain) ? Math.max(0, Math.min(1, cfg.outputGain)) : 1;
  try { volume.value = localStorage.getItem('site-audio-volume') || String(Math.round(defaultVolume * 100)); } catch (_) { volume.value = String(Math.round(defaultVolume * 100)); }
  function applyVolume() {
    var value = Number(volume.value) / 100;
    ui.querySelector('[data-volume-value]').textContent = volume.value + '%';
    volume.setAttribute('aria-valuetext', volume.value + '%');
    if (!master) return;
    var target = enabled ? value * outputGain : 0;
    master.gain.cancelScheduledValues(context.currentTime);
    if (target === 0) master.gain.setValueAtTime(0, context.currentTime);
    else master.gain.setTargetAtTime(target, context.currentTime, .025);
  }
  applyVolume();
  function init() {
    if (!context) {
      var AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) throw new Error('Audio unavailable');
      context = new AudioCtx(); master = context.createGain(); master.gain.value = 0;
      master.connect(context.destination); sfxGain = context.createGain(); sfxGain.connect(master);
      musicGain = context.createGain(); musicGain.gain.value = .7; musicGain.connect(master);
      analyser = context.createAnalyser(); analyser.fftSize = 4096; analyser.smoothingTimeConstant = .5;
      analyser.minDecibels = -80; analyser.maxDecibels = -5;
      wave = new Float32Array(analyser.fftSize); spectrum = new Uint8Array(analyser.frequencyBinCount);
      mediaNode = context.createMediaElementSource(music); mediaNode.connect(analyser); analyser.connect(musicGain);
    }
    return context.resume().then(function () {
      if (disposed) throw new Error('Player disposed');
      if (!pending) pending = Promise.all(Object.keys(sounds).map(function (key) {
        return fetch(asset(sounds[key][0])).then(function (r) { if (!r.ok) throw new Error('sound'); return r.arrayBuffer(); })
          .then(function (data) { return context.decodeAudioData(data); }).then(function (buffer) { buffers[key] = buffer; }).catch(function () {});
      }));
      return pending;
    });
  }
  function cue(key) {
    var now = performance.now();
    if (disposed || !enabled || !context || context.state !== 'running' || document.hidden || !buffers[key] || now - (cooldown[key] || -Infinity) < (key === 'browse' ? 95 : 160)) return;
    cooldown[key] = now;
    if (voices.length >= 3) { try { voices.shift().stop(); } catch (_) {} }
    var src = context.createBufferSource(), gain = context.createGain(); src.buffer = buffers[key];
    gain.gain.value = sounds[key][1]; src.connect(gain); gain.connect(sfxGain); voices.push(src);
    src.onended = function () { voices = voices.filter(function (v) { return v !== src; }); src.disconnect(); gain.disconnect(); };
    src.start();
    if (key === 'switch') {
      gain.gain.setValueAtTime(sounds[key][1], context.currentTime + .12);
      gain.gain.exponentialRampToValueAtTime(.0001, context.currentTime + .18); src.stop(context.currentTime + .19);
    }
  }
  function silence() {
    snapshot = { playing: false, energy: 0, beat: 0, sway: 0 };
    rms = 0; pulse = 0; previousBass = 0; bassMean = 0; lastBeat = -Infinity; interval = 500; beatCount = 0;
    bars.forEach(function (bar) { bar.style.transform = 'scaleY(.16)'; });
    cancelAnimationFrame(raf); raf = 0;
  }
  function analyse(now) {
    raf = 0;
    if (!enabled || music.paused || document.hidden || !context || context.state !== 'running') { silence(); return; }
    if (now - lastTick >= 30) {
      lastTick = now;
      analyser.getFloatTimeDomainData(wave); analyser.getByteFrequencyData(spectrum);
      var sum = 0; for (var i = 0; i < wave.length; i++) sum += wave[i] * wave[i];
      var level = Math.sqrt(sum / wave.length);
      snapshot = window.PortfolioAudioSignal(music.currentTime, Number(volume.value) === 0 ? 0 : level, spectrum, context.sampleRate, analyser.fftSize, cfg);
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) bars.forEach(function (bar, n) { bar.style.transform = 'scaleY(' + Math.min(1.4, .16 + snapshot.bands[n * 8] + snapshot.beat * .3) + ')'; });
    }
    raf = requestAnimationFrame(analyse);
  }
  function startAnalysis() { cancelAnimationFrame(raf); lastTick = performance.now(); raf = requestAnimationFrame(analyse); }
  function fail() { notice = L('音频暂时无法播放，请重试。', 'Unable to play audio. Please retry.'); label(); silence(); }
  function enable(value) {
    if (disposed) return;
    enabled = value;
    try { sessionStorage.setItem('site-audio-enabled', String(value)); } catch (_) {}
    applyVolume();
    if (!value) { playToken++; music.pause(); voices.forEach(function (v) { try { v.stop(); } catch (_) {} }); silence(); }
    label();
  }
  async function playMusic(automatic) {
    if (!sourceReady || disposed) return;
    var token = ++playToken;
    userPaused = false;
    try {
      var resumed = init(); enable(true);
      await Promise.all([resumed, music.play()]);
      if (disposed || userPaused) { music.pause(); return; }
      if (token !== playToken) return;
      autoPending = false;
      startAnalysis();
      notice = ''; label();
    } catch (error) {
      if (disposed || token !== playToken || userPaused) return;
      if (error.name === 'NotAllowedError' || automatic) {
        autoPending = true; notice = ''; label();
      } else fail();
    }
  }
  function setSource(src, temporary) {
    music.pause(); silence(); if (objectURL) URL.revokeObjectURL(objectURL);
    objectURL = temporary ? src : ''; sourceReady = !!src;
    if (src) music.src = src; else music.removeAttribute('src');
    notice = ''; label();
  }
  power.addEventListener('click', async function () {
    autoPending = false;
    if (enabled) { userPaused = true; enable(false); return; }
    try { await init(); if (disposed) return; userPaused = false; enable(true); cue('ready'); } catch (_) { if (!disposed) fail(); }
  });
  play.addEventListener('click', function () { autoPending = false; if (music.paused) playMusic(); else { userPaused = true; music.pause(); label(); } });
  ['input', 'change'].forEach(function (event) {
    volume.addEventListener(event, function () { applyVolume(); save(); if (event === 'change') cue('browse'); });
  });
  ui.addEventListener('click', function (e) { e.stopPropagation(); });
  music.addEventListener('play', function () {
    if (disposed) { music.pause(); return; }
    try { localStorage.setItem('site-audio-owner', owner); } catch (_) {}
    label(); startAnalysis();
  });
  music.addEventListener('pause', function () { label(); silence(); }); music.addEventListener('error', fail);
  music.addEventListener('seeking', silence); music.addEventListener('seeked', function () { if (!music.paused) startAnalysis(); });
  function duck() {
    if (!musicGain) return;
    var video = Array.from(document.querySelectorAll('video,audio')).some(function (v) { return v !== music && !v.paused && !v.muted && v.volume > 0; });
    musicGain.gain.setTargetAtTime(video ? .12 : .7, context.currentTime, .1);
  }
  ['play', 'pause', 'volumechange', 'ended'].forEach(function (event) { document.addEventListener(event, duck, true); });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden) { resumeAfterHidden = !music.paused; music.pause(); silence(); }
    else if (resumeAfterHidden && enabled && !userPaused && !disposed) { resumeAfterHidden = false; playMusic(); }
  });
  document.addEventListener('anime:category', function () { suppressed = performance.now() + 400; cue('switch'); });
  document.addEventListener('anime:preview', function (e) { var src = e.detail.image; if (src !== lastSelection && performance.now() > suppressed) cue('browse'); lastSelection = src; });
  document.addEventListener('click', function (e) {
    if (!e.isTrusted || e.target.closest('.site-audio')) return;
    if (e.target.closest('.oc-face')) cue('pet');
    else if (e.target.closest('[data-cat]')) return;
    else if (e.target.closest('[data-zoom="close"],.dream-back,.anime-detail-back')) cue('back');
    else if (e.target.closest('#langToggle,[data-detail-lang],[data-zoom],.nav-toggle')) cue('switch');
    else if (e.target.closest('a[href],button,[role="button"],summary')) cue('confirm');
  }, true);
  document.addEventListener('focusin', function (e) { if (e.target.closest('.site-audio,[data-work],[data-cat]')) return; if (e.target.matches('a:focus-visible,button:focus-visible')) cue('browse'); });
  var wasOpen = document.body.classList.contains('dream-preview-open');
  new MutationObserver(function () { var open = document.body.classList.contains('dream-preview-open'); if (wasOpen && !open) cue('back'); wasOpen = open; duck(); }).observe(document.body, { attributes: true, attributeFilter: ['class'] });
  new MutationObserver(label).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
  function destroy() {
    if (disposed) return;
    disposed = true; playToken++; autoPending = false; userPaused = true;
    music.pause(); music.removeAttribute('src'); music.load(); silence();
    voices.forEach(function (v) { try { v.stop(); } catch (_) {} }); voices = [];
    if (master) master.gain.value = 0;
    if (context && context.state !== 'closed') context.close().catch(function () {});
    music.remove(); ui.remove();
  }
  window.SiteAudio = { motion: function () { return snapshot; }, cue: cue, destroy: destroy };
  if (cfg.src) setSource(new URL(cfg.src, document.baseURI).href, false); else label();
  function unlock(e) {
    if (!e.isTrusted || e.target.closest('.site-audio') || !autoPending || userPaused) return;
    playMusic(true);
  }
  document.addEventListener('pointerdown', unlock);
  document.addEventListener('keydown', unlock);
  if (autoPending) playMusic(true);
  addEventListener('storage', function (e) {
    if (e.key === 'site-audio-owner' && e.newValue !== owner) {
      autoPending = false; userPaused = true; resumeAfterHidden = false; playToken++;
      music.pause(); silence();
    }
  });
  addEventListener('pagehide', destroy);
  addEventListener('beforeunload', destroy);
  addEventListener('unload', destroy);
  addEventListener('pageshow', function (e) { if (e.persisted && disposed) mountSiteAudio(); });
})();
