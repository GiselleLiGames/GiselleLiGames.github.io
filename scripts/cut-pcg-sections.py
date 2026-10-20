"""Build focused PCG demos from the original 51.85-second showreel.

Ranges were selected from contact sheets covering the complete source and its
chapter boundaries. Concept-art transitions are excluded from technical clips.
Run with --ffmpeg PATH, or install imageio-ffmpeg.
"""
import argparse
import json
from pathlib import Path
import shutil
import subprocess

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'assets/uploads/PCG.mp4'
OUTPUT = ROOT / 'assets/clips/pcg-sections'
# id, start, end, poster time, content
SECTIONS = [
    ('opening-preview', 0.00, 2.50, 0.25, 'Opening scene preview, ending before the concept-art wipe.'),
    ('materials', 9.10, 17.75, 16.50, 'Maya house blockout, roof geometry and Substance Designer wood material.'),
    ('brick-wall', 24.05, 30.90, 29.00, 'Height-map mesh generation, doorway adjustment and use in Unreal Engine.'),
    ('mountains', 33.45, 39.25, 37.00, 'HeightField shaping, erosion, automatic terrain coloring and height map.'),
    ('stone-wall', 41.35, 51.75, 49.00, 'Spline wall, stone dimensions, weathering and spline editing in Unreal Engine.'),
]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ffmpeg')
    args = parser.parse_args()
    ffmpeg = args.ffmpeg or shutil.which('ffmpeg')
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    OUTPUT.mkdir(exist_ok=True, parents=True)
    clips = []
    for identifier, start, end, poster, description in SECTIONS:
        video = OUTPUT / (identifier + '.mp4')
        image = OUTPUT / (identifier + '.webp')
        subprocess.run([ffmpeg, '-v', 'error', '-ss', str(start), '-i', str(SOURCE),
                        '-t', str(round(end-start, 3)), '-map', '0:v:0', '-an',
                        '-vf', 'scale=1600:-2:flags=lanczos,fps=30', '-c:v', 'libx264',
                        '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p',
                        '-movflags', '+faststart', '-threads', '2', '-y', str(video)], check=True)
        subprocess.run([ffmpeg, '-v', 'error', '-ss', str(poster), '-i', str(SOURCE),
                        '-frames:v', '1', '-vf', 'scale=1600:-2:flags=lanczos',
                        '-c:v', 'libwebp', '-quality', '84', '-y', str(image)], check=True)
        result = subprocess.run([ffmpeg, '-hide_banner', '-i', str(video), '-vf',
                                 'blackdetect=d=0.1:pix_th=0.10:pic_th=0.98', '-an',
                                 '-f', 'null', '-'], capture_output=True, text=True, check=True)
        if 'black_start:' in result.stderr:
            raise RuntimeError('Black interval detected in ' + identifier)
        clips.append(dict(id=identifier, src=video.relative_to(ROOT).as_posix(),
                          poster=image.relative_to(ROOT).as_posix(), start=start, end=end,
                          duration=round(end-start, 3), posterSourceTime=poster,
                          description=description, bytes=video.stat().st_size))
        print(identifier, round(end-start, 3), 'seconds', flush=True)
    (OUTPUT / 'manifest.json').write_text(json.dumps({
        'source': SOURCE.relative_to(ROOT).as_posix(), 'sourceDuration': 51.85,
        'video': {'width':1600, 'height':900, 'fps':30, 'audio':False, 'codec':'h264', 'faststart':True},
        'clips': clips,
        'selectionNotes': 'Original technical labels are retained; concept-art interludes and unrelated chapter transitions are excluded.'
    }, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')


if __name__ == '__main__':
    main()
