# Portfolio audio

Active interface effects are from **ObsydianX, Interface SFX Pack 1**, licensed CC0, using the electronic menu tones. Sources and edits are recorded in `rhythm/LICENSE.txt`. The old Kenney files and their license remain available but are no longer used.

Source: https://kenney.nl/assets/interface-sounds

| Site file | Original file | Trigger |
| --- | --- | --- |
| browse.ogg | select_001.ogg | Changing the selected project, pointer or keyboard |
| switch.ogg | switch_002.ogg | Changing a category, including Q/E and number shortcuts |
| confirm.ogg | confirmation_001.ogg | Opening a project or activating navigation |
| back.ogg | back_001.ogg | Closing the project dialog |
| pet.ogg | pluck_001.ogg | Clicking the OC's face |
| ready.ogg | glass_001.ogg | Enabling website sound |

BGM attempts to start on page load; browser autoplay restrictions fall back to the first trusted click/key. Explicit mute is respected for the session. Icon controls live in the navigation bar and have localized accessible names and tooltips. No local file chooser is shown. Master volume is adjustable, stored locally, and multiplied by `outputGain: 0.5`; zero volume is exact silence. Browse cues have a 95 ms cooldown and other cues 160 ms, with at most three simultaneous sound voices. Category changes suppress their accompanying preview cue. Audio files are fetched once and decoded by Web Audio.

## Portfolio BGM

`portfolio-bgm-loop.wav` is the user's selected first ACE-Step track, edited into a 48-second loop with a 3.2-second tail/head crossfade. It retains the original 150 BPM prompt, instruments and main arrangement; it is not the second generated track. The source is `C:\AI\ACE-Step-1.5\outputs\portfolio_bgm_01_loop.wav` (XL Turbo, BF16, seed 20261015).

`audio-config.js` points to this same-origin WAV, preserving Web Audio analysis for the companion's dance. The file is 48 kHz stereo, 32-bit float, 18,432,088 bytes. The original uncompressed samples preserve the edited loop without an additional encoding step. `music.loop = true` repeats it. To replace it later, update `src` in `audio-config.js` and bump that script's query version on the pages using it.

The single DOM audio element is `#portfolio-bgm`. Page unload removes its source, stops voices, cancels analysis and closes the AudioContext. Stale asynchronous starts are invalidated, and same-origin tabs claim one playback owner to avoid overlapping BGM.

The music has its own analyser, separate from the SFX bus. Low-frequency onset detection drives bounce, RMS loudness drives dance strength, and the observed beat interval drives alternating sway. Silence, pause, disabled audio and zero volume stop music-driven motion. The current model keeps its normal gentle idle motion when the music stops. Reduced motion and project dialogs keep the OC quiet. Background tabs pause music and resume it only if it had been playing. Unmuted project videos lower the BGM level to make their audio clear.

Background and OC use the same `music.currentTime` clock at 150 BPM, with a 30 ms onset offset measured from the loop. Background bars retain ascending frequency order and use actual FFT magnitudes, without alternating or shuffled patterns. Changing the song requires updating BPM/offset; this is a beat grid, not a per-note authored beat map.
