#!/usr/bin/env python3
"""Generate one Open Graph share card per post.

Why this exists
---------------
X (and every other unfurler) reads `og:image`. Without a `cover:` in a post's
front matter, `_includes/head.html` falls back to `/images/og-default.png`, so
every link on the site shares the *same* generic card. This script gives each
post its own 1200x630 card, in the same visual language as the hand-made
`ai-fatigue-cover.png`.

Usage
-----
    python tools/gen-og-cards.py            # write images + add `cover:` to front matter
    python tools/gen-og-cards.py --check    # report only, change nothing
    python tools/gen-og-cards.py --force    # also redraw existing cards

It is intentionally dependency-light: Pillow plus the standard library. Re-run it
after adding a post (a card is only drawn when one does not exist yet), commit
`images/og/` and the front-matter line, and the card is live.

Line endings: posts in this repository are a mix of LF and CRLF. The `cover:`
line is inserted while preserving whatever the file already used, so a change
that adds one line stays a one-line diff.

Fonts: it looks for a monospace bold face matching the theme's own typeface
(Consolas on Windows, DejaVu/Liberation elsewhere) and falls back to Pillow's
built-in font, which is ugly but never fails.
"""

from __future__ import annotations

import argparse
import re
import sys
import unicodedata
from pathlib import Path

try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:  # pragma: no cover
    sys.exit("Pillow is required:  python -m pip install pillow")

# Windows consoles default to cp1252 and choke on anything decorative.
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parent.parent
POST_DIR = ROOT / "_posts"
OUT_DIR = ROOT / "images" / "og"

W, H = 1200, 630
MARGIN = 70
BG = (255, 255, 255)
INK = (17, 17, 17)
MUTED = (130, 130, 130)
ACCENT = (20, 122, 107)  # the theme's $blue-color

CRLF = chr(13) + chr(10)
LF = chr(10)

FONT_CANDIDATES = [
    ("C:/Windows/Fonts/consolab.ttf", "C:/Windows/Fonts/consola.ttf"),
    (
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono-Bold.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ),
    (
        "/usr/share/fonts/truetype/liberation/LiberationMono-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationMono-Regular.ttf",
    ),
    ("/System/Library/Fonts/Menlo.ttc", "/System/Library/Fonts/Menlo.ttc"),
]

MONTHS = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
]

_FONT_CACHE: dict[tuple[int, bool], object] = {}


# ---------------------------------------------------------------------------
# Front matter
# ---------------------------------------------------------------------------

def file_eol(path: Path) -> str:
    """The line ending this file already uses.

    Rewriting a whole post just to add one line would be a noisy diff, so the
    ending is detected and reused.
    """
    head = path.read_bytes()[:4096]
    return CRLF if b"\r\n" in head else LF


def read_front_matter(path: Path) -> tuple[dict[str, str], str]:
    """Return (fields, raw front matter) with line endings normalised to LF."""
    text = path.read_text(encoding="utf-8").replace(CRLF, LF)
    m = re.match(r"^---\n(.*?)\n---\n", text, re.S)
    if not m:
        return {}, ""

    fields: dict[str, str] = {}
    for line in m.group(1).split(LF):
        if ":" not in line:
            continue
        key, _, value = line.partition(":")
        fields[key.strip()] = value.strip().strip('"').strip("'")
    return fields, m.group(1)


def add_cover(path: Path, cover: str) -> bool:
    """Insert `cover:` into the front matter. Returns True when it changed."""
    fields, fm = read_front_matter(path)
    if "cover" in fields or not fm:
        return False

    eol = file_eol(path)
    text = path.read_text(encoding="utf-8").replace(CRLF, LF)
    marker = "---" + LF + fm + LF + "---" + LF
    replacement = "---" + LF + fm + LF + "cover: " + cover + LF + "---" + LF
    if marker not in text:
        return False

    path.write_text(text.replace(marker, replacement, 1).replace(LF, eol),
                    encoding="utf-8", newline="")
    return True


# ---------------------------------------------------------------------------
# Text helpers
# ---------------------------------------------------------------------------

def ascii_safe(s: str) -> str:
    """Drop glyphs a monospace face cannot draw (emoji, box drawing, ...)."""
    keep_extra = set("—–‘’“”·…")
    out = []
    for ch in s:
        if ch in "\t\n":
            out.append(" ")
        elif unicodedata.combining(ch):
            continue
        elif ch in keep_extra:
            out.append(ch)
        elif ord(ch) < 0x2500 and unicodedata.category(ch) not in {"Cc", "Cf"}:
            out.append(ch)
    return re.sub(r"\s+", " ", "".join(out)).strip()


def load_font(size: int, bold: bool = False):
    key = (size, bold)
    if key in _FONT_CACHE:
        return _FONT_CACHE[key]

    for bold_path, regular_path in FONT_CANDIDATES:
        try:
            font = ImageFont.truetype(bold_path if bold else regular_path, size)
            _FONT_CACHE[key] = font
            return font
        except OSError:
            continue

    font = ImageFont.load_default()
    _FONT_CACHE[key] = font
    return font


def wrap(text: str, font, draw, max_width: int) -> list[str]:
    lines, current = [], ""
    for word in text.split():
        candidate = (current + " " + word).strip()
        if draw.textlength(candidate, font=font) <= max_width or not current:
            current = candidate
        else:
            lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def fit_title(title: str, draw, max_width: int, max_lines: int = 3):
    """The biggest size that keeps the title within `max_lines`."""
    for size in range(54, 27, -2):
        font = load_font(size, bold=True)
        lines = wrap(title, font, draw, max_width)
        if len(lines) <= max_lines:
            return font, lines

    font = load_font(28, bold=True)
    all_lines = wrap(title, font, draw, max_width)
    lines = all_lines[:max_lines]
    if len(all_lines) > max_lines:
        while lines and draw.textlength(lines[-1] + "…", font=font) > max_width:
            lines[-1] = lines[-1][:-1]
        lines[-1] += "…"
    return font, lines


def pretty_date(raw: str) -> str:
    m = re.match(r"(\d{4})-(\d{2})-(\d{2})", raw or "")
    if not m:
        return ""
    year, month, day = m.groups()
    return f"{int(day)} {MONTHS[int(month) - 1]} {year}"


# ---------------------------------------------------------------------------
# Rendering
# ---------------------------------------------------------------------------

def render_card(title: str, kicker: str, date: str, out: Path) -> None:
    img = Image.new("RGB", (W, H), BG)
    d = ImageDraw.Draw(img)

    # Kicker: the post's first category, upper-cased.
    if kicker:
        d.text((MARGIN, 56), kicker.upper(), font=load_font(24, bold=True), fill=ACCENT)

    # Signature on the right, so a screenshot of the card still says where it is from.
    sig_font = load_font(24)
    sig = "yggdrasil.id"
    d.text((W - MARGIN - d.textlength(sig, font=sig_font), 56), sig,
           font=sig_font, fill=MUTED)

    # Title.
    title = ascii_safe(title) or "untitled"
    font, lines = fit_title(title, d, W - 2 * MARGIN)
    line_height = int(font.size * 1.28)
    y = 150
    for line in lines:
        d.text((MARGIN, y), line, font=font, fill=INK)
        y += line_height

    # Divider just under the text block.
    rule_y = min(y + 34, H - 150)
    d.line([(MARGIN, rule_y), (W - MARGIN, rule_y)], fill=(228, 228, 228), width=2)

    # Footer.
    foot = load_font(24)
    bottom = H - MARGIN - 10
    if date:
        d.text((MARGIN, bottom), date, font=foot, fill=MUTED)
    author = "Yahya F. Al Fatih"
    d.text((W - MARGIN - d.textlength(author, font=foot), bottom), author,
           font=foot, fill=MUTED)

    out.parent.mkdir(parents=True, exist_ok=True)
    img.save(out, optimize=True)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def collect_posts() -> list[Path]:
    return sorted(POST_DIR.rglob("*.md"))


def main() -> int:
    ap = argparse.ArgumentParser(description="generate per-post Open Graph cards")
    ap.add_argument("--check", action="store_true", help="report only")
    ap.add_argument("--force", action="store_true", help="redraw existing cards")
    args = ap.parse_args()

    posts = collect_posts()
    seen: dict[str, Path] = {}
    for p in posts:
        if p.stem in seen:
            sys.exit(f"duplicate post filename: {p.stem} ({p} and {seen[p.stem]})")
        seen[p.stem] = p

    drawn = patched = kept = 0
    for path in posts:
        fields, fm = read_front_matter(path)
        if not fm:
            print(f"  skip (no front matter): {path.relative_to(ROOT)}")
            continue

        slug = path.stem
        cover = f"/images/og/{slug}.png"
        declared = fields.get("cover", "")

        # A hand-made card (the AI-fatigue one) always wins.
        if declared and declared != cover:
            print(f"  keep its own cover: {slug} -> {declared}")
            kept += 1
            continue

        target = OUT_DIR / f"{slug}.png"
        if args.check:
            state = "ok" if target.exists() and declared else "MISSING"
            print(f"  {state:8} {slug}")
            continue

        if args.force or not target.exists():
            title = fields.get("title", slug)
            categories = (fields.get("categories", "") or "").split()
            render_card(title, categories[0] if categories else "post",
                        pretty_date(fields.get("date", "")), target)
            drawn += 1
            print(f"  card   {slug}  <-  {title[:52]}")

        if add_cover(path, cover):
            patched += 1

    if args.check:
        print(f"\n{len(posts)} posts checked")
        return 0

    print(f"\n{len(posts)} posts: {drawn} card(s) drawn, {patched} front matter patched, "
          f"{kept} left with their own cover")
    print(f"cards live in {OUT_DIR.relative_to(ROOT)} - commit both and unfurlers pick them up")
    print("note: X caches cards per URL, so an already-shared link needs a cache "
          "bust or the Card Validator while logged in")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
