"""Prepare an opening preview and the original 6.75s Lycoris character comparison.

Preserve the original aspect ratio and omit the effectively silent audio track.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/uploads/LycoriusShader迭代.mp4'
OUTPUT = ROOT / 'assets/clips/lycoris-sections'


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg')
    args = parser.parse_args()
    ffmpeg = args.ffmpeg or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    clips = []
    for identifier, duration in [('opening-preview', 3.0), ('character-comparison', 6.75)]:
        video, poster = OUTPUT / (identifier + '.mp4'), OUTPUT / (identifier + '.webp')
        subprocess.run([ffmpeg, '-v', 'error', '-i', str(SOURCE), '-t', str(duration),
                        '-map', '0:v:0', '-an', '-vf', 'scale=1600:-2:flags=lanczos,fps=30',
                        '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
                        '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-threads', '2',
                        '-y', str(video)], check=True)
        subprocess.run([ffmpeg, '-v', 'error', '-ss', '0.25', '-i', str(SOURCE),
                        '-frames:v', '1', '-vf', 'scale=1600:-2:flags=lanczos',
                        '-c:v', 'libwebp', '-quality', '84', '-y', str(poster)], check=True)
        clips.append(dict(id=identifier, src=video.relative_to(ROOT).as_posix(),
                          poster=poster.relative_to(ROOT).as_posix(), start=0,
                          end=duration, posterSourceTime=0.25, bytes=video.stat().st_size))
        print(identifier, duration, 'seconds', flush=True)
    (OUTPUT / 'manifest.json').write_text(json.dumps({
        'source': SOURCE.relative_to(ROOT).as_posix(), 'sourceDuration': 6.75,
        'content': 'Character shading comparison, not a gameplay or VFX recording.',
        'video': {'width':1600, 'height':1002, 'fps':30, 'audio':False, 'faststart':True},
        'clips': clips
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
