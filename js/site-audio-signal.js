/* One music clock shared by the background spectrum and companion. */
(function () {
  'use strict';
  window.PortfolioAudioSignal = function (audioTime, level, spectrum, sampleRate, fftSize, cfg) {
    var energy = level < .003 ? 0 : Math.min(1, level * 4.5);
    var bpm = Number(cfg.bpm) || 150, offset = Number(cfg.beatOffset) || 0;
    var position = Math.max(0, audioTime - offset) * bpm / 60;
    var phase = position % 1;
    var bands = Array.from({ length: 64 }, function (_, i) {
      var low = 45 * Math.pow(14000 / 45, i / 64);
      var high = 45 * Math.pow(14000 / 45, (i + 1) / 64);
      var a = Math.max(1, Math.floor(low * fftSize / sampleRate));
      var b = Math.min(spectrum.length - 1, Math.max(a, Math.ceil(high * fftSize / sampleRate)));
      var sum = 0, peak = 0;
      for (var k = a; k <= b; k++) {
        var magnitude = Math.pow(10, ((spectrum[k] / 255) * 75 - 80) / 20);
        sum += magnitude * magnitude; peak = Math.max(peak, magnitude);
      }
      // Audio magnitudes, not dB bytes: preserve peaks without a clipped bass plateau.
      var magnitude = Math.sqrt(sum / Math.max(1, b - a + 1)) * .7 + peak * .3;
      var weighted = magnitude * Math.pow(Math.sqrt(low * high) / 180, .32) * 3.5;
      return energy ? Math.min(1, Math.pow(weighted, .72)) : 0;
    });
    return { playing: true, energy: energy, beat: Math.exp(-phase * 6) * energy,
      sway: Math.sin(position * Math.PI) * energy, phase: phase, time: audioTime,
      bpm: bpm, bands: bands };
  };
})();
