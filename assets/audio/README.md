# Portfolio audio

Six short interface effects are from **Kenney, Interface Sounds 1.0 (2020)**, licensed CC0. The original license is retained in `KENNEY-LICENSE.txt`.

Source: https://kenney.nl/assets/interface-sounds

| Site file | Original file | Trigger |
| --- | --- | --- |
| browse.ogg | select_001.ogg | Changing the selected project, pointer or keyboard |
| switch.ogg | switch_002.ogg | Changing a category, including Q/E and number shortcuts |
| confirm.ogg | confirmation_001.ogg | Opening a project or activating navigation |
| back.ogg | back_001.ogg | Closing the project dialog |
| pet.ogg | pluck_001.ogg | Clicking the OC's face |
| ready.ogg | glass_001.ogg | Enabling website sound |

Sound starts only after explicit enable/play. Master volume is adjustable and stored locally; automatic playback is not enabled on page load. Browse cues have a 95 ms cooldown and other cues 160 ms, with at most three simultaneous sound voices. The switch cue fades out over 120–180 ms and stops at 190 ms. Category changes suppress their accompanying preview cue. Audio files are fetched once and decoded by Web Audio.

## Portfolio BGM

`portfolio-bgm-loop.wav` is the user's selected first ACE-Step track, edited into a 48-second loop with a 3.2-second tail/head crossfade. It retains the original 150 BPM prompt, instruments and main arrangement; it is not the second generated track. The source is `C:\AI\ACE-Step-1.5\outputs\portfolio_bgm_01_loop.wav` (XL Turbo, BF16, seed 20261015).

`audio-config.js` points to this same-origin WAV, preserving Web Audio analysis for the companion's dance. The file is 48 kHz stereo, 32-bit float, 18,432,088 bytes. The original uncompressed samples preserve the edited loop without an additional encoding step. `music.loop = true` repeats it; playback starts only after the visitor presses Play BGM. `preload = 'none'` avoids downloading the song on initial page load. To replace it later, update `src` in `audio-config.js` and bump that script's query version in `portfolio.html`.

On localhost, **Choose music / 选择音乐** opens a local file for immediate BGM and dance preview. This uses a temporary object URL, does not upload the file, and does not publish or save that selection to the repository. This file chooser is hidden on the public site.

The music has its own analyser, separate from the SFX bus. Low-frequency onset detection drives bounce, RMS loudness drives dance strength, and the observed beat interval drives alternating sway. Silence, pause, disabled audio and zero volume stop music-driven motion. The current model keeps its normal gentle idle motion when the music stops. Reduced motion and project dialogs keep the OC quiet. Background tabs pause music and resume it only if it had been playing. Unmuted project videos lower the BGM level to make their audio clear.

The lightweight beat follower is reactive, not an authored beat map: syncopation or songs without distinct bass attacks can produce less exact beat detection. With the final song, timing can be tuned against that recording.
