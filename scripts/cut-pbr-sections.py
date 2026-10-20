"""Rebuild focused, silent shader demos from the original shading showreel.

Ranges were chosen by inspecting labeled contact sheets at 2-second intervals,
then inspecting section boundaries at 0.25/0.5-second intervals. The source is
preserved. Supply --ffmpeg or install imageio-ffmpeg to run this script.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import re
import shutil
import subprocess


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/uploads/ShadingShowreel.mp4"
OUTPUT = ROOT / "assets/clips/pbr-sections"
# id, title, source start, source end, poster source time, visible content
SECTIONS = [
    ("pbr-nonmetal", "Opaque PBR · nonmetal", 5.05, 6.95, 6.25,
     "Side-by-side orange and cut-orange comparison: built-in URP PBR and custom PBR."),
    ("pbr-metal", "Opaque PBR · metal", 7.55, 20.10, 16.30,
     "Metallic compass comparison, moving-light support and ORM material parameter adjustments."),
    ("foliage-scattering", "Foliage · scattering", 26.85, 30.10, 28.20,
     "Leaf scattering and backlighting response while material parameters change."),
    ("foliage-wind", "Foliage · wind", 31.10, 33.95, 32.10,
     "Main and detailed wind deformation on a palm foliage cluster."),
    ("water", "Water · reflection and refraction", 45.15, 57.05, 50.65,
     "Water transparency gradient, planar reflection, submerged rocks, caustics and foam."),
    ("ice", "Ice material", 57.55, 63.10, 60.30,
     "Ice material on spheres and statues in an interior lighting environment."),
    ("final-scene", "Final scene rendering", 81.15, 88.20, 85.25,
     "Completed courtyard camera move with ice statue, foliage, water, atmospheric lighting, post-processing and SSAO."),
]


def run(ffmpeg: str, arguments: list[str]) -> subprocess.CompletedProcess[str]:
    result = subprocess.run([ffmpeg, "-hide_banner", *arguments],
                            capture_output=True, text=True)
    if result.returncode:
        raise RuntimeError(result.stderr)
    return result


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--ffmpeg", help="Path to an ffmpeg executable")
    args = parser.parse_args()
    ffmpeg = args.ffmpeg or shutil.which("ffmpeg")
    if not ffmpeg:
        import imageio_ffmpeg
        ffmpeg = imageio_ffmpeg.get_ffmpeg_exe()
    OUTPUT.mkdir(parents=True, exist_ok=True)
    clips = []
    for identifier, title, start, end, poster_time, description in SECTIONS:
        video = OUTPUT / f"{identifier}.mp4"
        poster = OUTPUT / f"{identifier}.webp"
        run(ffmpeg, ["-v", "error", "-ss", str(start), "-i", str(SOURCE),
                     "-t", f"{end - start:.3f}", "-map", "0:v:0", "-an",
                     "-vf", "scale=1600:-2:flags=lanczos,fps=30",
                     "-c:v", "libx264", "-preset", "medium", "-crf", "24",
                     "-pix_fmt", "yuv420p", "-movflags", "+faststart", "-threads", "2",
                     "-y", str(video)])
        run(ffmpeg, ["-v", "error", "-ss", str(poster_time), "-i", str(SOURCE),
                     "-frames:v", "1", "-vf", "scale=1600:-2:flags=lanczos",
                     "-c:v", "libwebp", "-quality", "84", "-y", str(poster)])
        # Decode the whole output and reject any fully black interval >= 0.1s.
        check = run(ffmpeg, ["-i", str(video), "-vf",
                            "blackdetect=d=0.1:pix_th=0.10:pic_th=0.98",
                            "-an", "-f", "null", "-"])
        if "black_start:" in check.stderr:
            raise RuntimeError(f"Black interval in {identifier}: {check.stderr}")
        dimensions = re.search(r"Video: h264.*?yuv420p.*?1600x900", check.stderr)
        if not dimensions:
            raise RuntimeError(f"Unexpected output format: {identifier}")
        duration_match = re.search(r"Duration: (\d+):(\d+):(\d+\.\d+)", check.stderr)
        hours, minutes, seconds = map(float, duration_match.groups())
        actual_duration = hours * 3600 + minutes * 60 + seconds
        if abs(actual_duration - (end - start)) > .05:
            raise RuntimeError(f"Unexpected duration: {identifier}: {actual_duration}")
        clips.append({"id": identifier, "title": title,
                      "src": video.relative_to(ROOT).as_posix(),
                      "poster": poster.relative_to(ROOT).as_posix(),
                      "start": start, "end": end,
                      "duration": round(actual_duration, 3),
                      "posterSourceTime": poster_time,
                      "description": description,
                      "bytes": video.stat().st_size})
        print(f"{identifier}: {actual_duration:.2f}s, {video.stat().st_size:,} bytes", flush=True)
    manifest = {
        "source": SOURCE.relative_to(ROOT).as_posix(),
        "sourceDuration": 88.25,
        "video": {"codec": "h264", "pixelFormat": "yuv420p", "width": 1600,
                  "height": 900, "fps": 30, "audio": False, "faststart": True},
        "selectionNotes": "Content inspected across the entire source and at section boundaries. Intro scene map and transitions to unrelated shader sections are excluded. Original in-video explanatory labels and editor panels are retained.",
        "clips": clips,
        "absentRequestedDemonstrations": [],
    }
    (OUTPUT / "manifest.json").write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
