#!/usr/bin/env python3
"""Generates the extension's toolbar icons.

Deliberately geometric: a rounded square with an "H" cut out of it, drawn from
rectangles so it stays crisp at 16px without depending on a font. The palette is
neutral on purpose — it is not Duolingo's owl or brand green, since the
extension is unofficial.

Run: python3 scripts/generate-icons.py
"""
from PIL import Image, ImageDraw

SIZES = (16, 32, 48, 128)
STATES = {
    # active: hard mode on. inactive: hard mode off.
    "active": ((0x2E, 0x7D, 0x32, 0xFF), (0xFF, 0xFF, 0xFF, 0xFF)),
    "inactive": ((0x9E, 0x9E, 0x9E, 0xFF), (0xF5, 0xF5, 0xF5, 0xFF)),
}


def draw_icon(size, bg, fg):
    scale = 8
    big = size * scale
    img = Image.new("RGBA", (big, big), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)

    radius = int(big * 0.22)
    d.rounded_rectangle([0, 0, big - 1, big - 1], radius=radius, fill=bg)

    # "H" from three bars: two stems and a crossbar.
    stem_w = int(big * 0.14)
    left = int(big * 0.28)
    right = int(big * 0.72) - stem_w
    top = int(big * 0.26)
    bottom = int(big * 0.74)
    bar_h = int(big * 0.13)
    mid = (top + bottom) // 2

    d.rectangle([left, top, left + stem_w, bottom], fill=fg)
    d.rectangle([right, top, right + stem_w, bottom], fill=fg)
    d.rectangle([left, mid - bar_h // 2, right + stem_w, mid + bar_h // 2], fill=fg)

    return img.resize((size, size), Image.LANCZOS)


for state, (bg, fg) in STATES.items():
    for size in SIZES:
        draw_icon(size, bg, fg).save(f"icons/icon-{state}-{size}.png")
        print(f"icons/icon-{state}-{size}.png")
