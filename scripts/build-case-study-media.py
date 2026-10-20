"""Build lossless-in-layout, per-Figma-node portfolio crops from preserved sources.

Run with Python + Pillow from any working directory. The normalized Figma image
transform describes a source rectangle, not a browser object-fit instruction.
Editorial bounds below remove observed desktop/editor chrome only; useful shader
controls, code, graphs and comparison imagery remain in the pictures.
"""
from __future__ import annotations

import hashlib
import json
import re
from collections import defaultdict
from pathlib import Path

from PIL import Image, ImageStat

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "assets/uploads/figma/source"
DEST = ROOT / "assets/uploads/figma/cropped"

# Coordinates are normalized left/top/right/bottom, measured on the full source.
# Unity maximized game view uses a 64px tab/toolbar and, for fixed aspect ratios,
# 120px side gutters. Windows taskbars occupy the final 72px of 2160px captures.
BOUNDS = {}
for node in (103, 104, 105, 106, 197, 204, 237, 238, 243, 371, 372,
             379, 380, 383, 385, 402, 440, 441, 442, 444, 445,
             451, 452, 453, 455):
    BOUNDS[f"920:{node}"] = (120 / 3840, 68 / 2088, 3720 / 3840, 1)
# This source includes a Windows taskbar and FPS overlay as well as game chrome.
for node in (103, 104, 197, 402):
    BOUNDS[f"920:{node}"] = (120 / 3840, 78 / 2160, 3720 / 3840, 2086 / 2160)
BOUNDS.update({
    "920:76": (0, 68 / 2088, 1, 1),
    "920:195": (0, 54 / 1380, 1, 1),
    "920:196": (0, 54 / 1380, 1, 1),
    "920:290": (52 / 3840, 82 / 2160, 3828 / 3840, 2086 / 2160),
    "920:291": (120 / 3840, 82 / 2160, 3720 / 3840, 2086 / 2160),
    "920:313": (0, 56 / 1458, 1, 1),
    "920:326": (48 / 3840, 70 / 2088, 1, 1),
    "920:356": (0, 78 / 2054, 1, 1),
    "920:357": (0, 78 / 2054, 1, 1),
    # Procedural graph captures deliberately retain their node and property panes.
    "744:25": (0, 88 / 2066, 1, 1),
    "744:33": (0, 88 / 2066, 1, 1),
    "744:37": (0, 88 / 2066, 1, 1),
    "744:84": (0, 52 / 1040, 1, 1),
    "744:85": (0, 52 / 1040, 1, 1),
    "744:127": (302 / 1920, 94 / 1080, 1536 / 1920, 686 / 1080),
    "744:128": (0, 30 / 864, 1050 / 1449, 584 / 864),
    "744:140": (0, 52 / 918, 1, 1),
    "744:189": (58 / 2560, 166 / 1400, 2170 / 2560, 1280 / 1400),
    # Pillarboxed monster demos are cropped to their rendered scene.
    "611:40": (104 / 1928, 0, 1824 / 1928, 1),
    "611:45": (350 / 1920, 0, 1568 / 1920, 1),
    "611:52": (0, 64 / 2100, 1, 1),
    "800:31": (120 / 3840, 78 / 2160, 3720 / 3840, 2086 / 2160),
    "805:43": (100 / 2560, 90 / 1389, 2460 / 2560, 1),
})


def imported_data():
    text = (ROOT / "js/figma-case-studies.js").read_text(encoding="utf-8")
    match = re.search(r"var imported = (.*);\nwindow.FIGMA_CASE_STUDIES", text)
    if not match:
        raise ValueError("Could not find the local Figma import")
    return json.loads(match.group(1))


def image_nodes(value):
    if isinstance(value, dict):
        if value.get("kind") == "image":
            yield value
        for child in value.values():
            yield from image_nodes(child)
    elif isinstance(value, list):
        for child in value:
            yield from image_nodes(child)


def intersect(a, b):
    return (max(a[0], b[0]), max(a[1], b[1]),
            min(a[2], b[2]), min(a[3], b[3]))


def web_path(path):
    return path.relative_to(ROOT).as_posix()


def save_variant(im, path, maximum):
    variant = im.copy()
    # No upscaling, stretching, or loss of alpha.
    variant.thumbnail((maximum, maximum), Image.Resampling.LANCZOS)
    if path.exists():
        with Image.open(path) as cached:
            cached.verify()
            if cached.size == variant.size:
                return variant.size
    variant.save(path, "WEBP", quality=88, method=6)
    return variant.size


def main():
    data = imported_data()
    figma_crops = json.loads((ROOT / "assets/uploads/figma/image-crops.json").read_text())
    nodes = {}
    for item in image_nodes([data["works"], data.get("portfolioCover", {})]):
        node = item.get("sourceNode") or item.get("node")
        if node and item.get("src", "").startswith("assets/uploads/figma/source/"):
            nodes[node] = item
    active_frames = {chapter["id"] for chapters in data["works"].values() for chapter in chapters}
    active_frames.add(data.get("portfolioCover", {}).get("id"))
    for item in data.get("coverage", []):
        if item.get("classification") == "background" and item.get("frame") in active_frames:
            nodes.setdefault(item["node"], {"src": item["path"], "sourceImageHash": item["hash"]})
    DEST.mkdir(parents=True, exist_ok=True)
    manifest, aliases, variants = {}, defaultdict(list), {}
    actual_crops = 0
    for node, item in sorted(nodes.items()):
        original = item["src"]
        source_hash = item.get("sourceImageHash") or Path(original).stem
        source = SOURCE / f"{source_hash}.full.webp"
        if not source.exists():
            source = ROOT / original
        with Image.open(source) as opened:
            opened.load()
            im = opened.copy()
        bounds = (0.0, 0.0, 1.0, 1.0)
        crop = figma_crops.get(node)
        if crop:
            matrix = crop[3]
            bounds = (matrix[0][2], matrix[1][2],
                      matrix[0][2] + matrix[0][0], matrix[1][2] + matrix[1][1])
        bounds = intersect(bounds, (0, 0, 1, 1))
        if node in BOUNDS:
            bounds = intersect(bounds, BOUNDS[node])
        rectangle = tuple(round(v * (im.width if i % 2 == 0 else im.height))
                          for i, v in enumerate(bounds))
        if rectangle[2] <= rectangle[0] or rectangle[3] <= rectangle[1]:
            raise ValueError(f"Empty crop for {node}: {rectangle}")
        cropped = im.crop(rectangle)
        if sum(ImageStat.Stat(cropped.convert("RGB")).mean) < 0.5:
            raise ValueError(f"Unexpected empty/black image for {node}")
        changed = rectangle != (0, 0, im.width, im.height)
        actual_crops += changed
        key = (source_hash, rectangle)
        if key not in variants:
            # A stable content key lets repeated nodes share identical output.
            digest = hashlib.sha256(repr(key).encode()).hexdigest()[:12]
            basename = f"{source_hash[:10]}-{digest}"
            preview = DEST / f"{basename}.webp"
            full = DEST / f"{basename}.full.webp"
            dimensions = save_variant(cropped, preview, 1600)
            if max(cropped.size) <= 1600:
                full = preview
            else:
                save_variant(cropped, full, 3200)
            variants[key] = (preview, full, dimensions)
        preview, full, dimensions = variants[key]
        entry = {
            "src": web_path(preview), "full": web_path(full),
            "width": dimensions[0], "height": dimensions[1],
            "original": original,
            "crop": {"pixels": list(rectangle), "sourceWidth": im.width,
                     "sourceHeight": im.height,
                     "method": "figma+editorial" if node in BOUNDS else "figma" if crop else "original"},
        }
        manifest[node] = entry
        aliases[original].append(entry)
    # Source aliases are safe only when every use agrees on its crop.
    media = dict(manifest)
    for path, entries in aliases.items():
        if len({entry["src"] for entry in entries}) == 1:
            for alias in (path, str(Path(path).with_suffix(".webp")).replace("\\", "/"),
                          str(Path(path).with_suffix(".full.webp")).replace("\\", "/")):
                media[alias] = entries[0]
    (ROOT / "assets/uploads/figma/cropped-manifest.json").write_text(
        json.dumps(manifest, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    (ROOT / "js/case-study-media.js").write_text(
        "/* Generated by scripts/build-case-study-media.py; originals preserved. */\n"
        "window.CaseStudyMedia=" + json.dumps(media, separators=(",", ":"), ensure_ascii=False) + ";\n",
        encoding="utf-8")
    # Decode the deliverables, including alpha, before reporting success.
    paths = {path for preview, full, _ in variants.values() for path in (preview, full)}
    for path in paths:
        with Image.open(path) as output:
            output.load()
            if min(output.size) < 1:
                raise ValueError(f"Invalid dimensions: {path}")
    for stale in DEST.glob("*.webp"):
        if stale not in paths and re.fullmatch(r"[a-f0-9]{10}-[a-f0-9]{12}(?:\.full)?\.webp", stale.name):
            stale.unlink()
    print(f"{len(manifest)} nodes, {actual_crops} crops, {len(variants)} variants, "
          f"{len(paths)} decoded WebP files, {sum(p.stat().st_size for p in paths)/1024/1024:.1f} MiB")


if __name__ == "__main__":
    main()
