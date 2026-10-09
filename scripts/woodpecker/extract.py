"""
Reads the exercise diagrams and solution lines out of a PDF of "The Woodpecker Method"
and writes them to scripts/woodpecker/.cache/raw.json for build.js to turn into puzzles.

    python scripts/woodpecker/extract.py "path/to/The Woodpecker Method.pdf"

Diagrams are typeset with the Chess Merida font, so each board row is a line of glyphs:
lower case = piece on a light square, upper case = on a dark square; p n b r q k are
White's pieces and o m v t w l are Black's; ' ' and '+' are empty light and dark squares.
An arrow (Wingdings 3) beside the diagram marks the side to move.
The cache holds the book's solution text, so it is git-ignored and never shipped.
"""
import json
import os
import re
import sys

import pymupdf

WHITE = {"p": "P", "n": "N", "b": "B", "r": "R", "q": "Q", "k": "K"}
BLACK = {"o": "p", "m": "n", "v": "b", "t": "r", "w": "q", "l": "k"}
RANK_LABELS = {0xF0C7 - i: 8 - i for i in range(8)}
EXERCISE_PAGES = range(31, 223)
SOLUTION_PAGES = range(223, 380)


def square_piece(ch):
    if ch in (" ", "+"):
        return None
    low = ch.lower()
    if low in WHITE:
        return WHITE[low]
    if low in BLACK:
        return BLACK[low]
    raise ValueError(f"unknown glyph {ch!r}")


def page_items(page):
    rows, texts, arrows = [], [], []
    for block in page.get_text("rawdict")["blocks"]:
        for line in block.get("lines", []):
            for span in line["spans"]:
                chars = span["chars"]
                if not chars:
                    continue
                if "Merida" in span["font"]:
                    codes = [ord(c["c"]) for c in chars]
                    if codes[0] in RANK_LABELS:
                        squares = []
                        for c in chars[1:9]:
                            code = ord(c["c"])
                            squares.append(" " if code == 0x20 else chr(code - 0xF000))
                        rows.append({"rank": RANK_LABELS[codes[0]], "x": chars[0]["origin"][0], "y": chars[0]["origin"][1], "squares": squares})
                elif "Wingdings" in span["font"]:
                    for c in chars:
                        arrows.append({"code": ord(c["c"]), "x": c["origin"][0], "y": c["origin"][1]})
                else:
                    txt = "".join(c["c"] for c in chars)
                    if txt.strip():
                        texts.append({"text": txt, "x": chars[0]["origin"][0], "y": chars[0]["origin"][1], "size": span["size"]})
    return rows, texts, arrows


def boards_on_page(page):
    rows, texts, arrows = page_items(page)
    boards = []
    for row in rows:
        if row["rank"] != 8:
            continue
        group = [r for r in rows if abs(r["x"] - row["x"]) < 1 and 0 <= r["y"] - row["y"] < 18 * 7 + 5]
        group.sort(key=lambda r: -r["rank"])
        if [r["rank"] for r in group] != list(range(8, 0, -1)):
            raise ValueError(f"incomplete board on page {page.number}")
        placement = []
        for r in group:
            fen_row, empty = "", 0
            for ch in r["squares"]:
                piece = square_piece(ch)
                if piece is None:
                    empty += 1
                    continue
                if empty:
                    fen_row += str(empty)
                    empty = 0
                fen_row += piece
            placement.append(fen_row + (str(empty) if empty else ""))
        top, bottom, left = row["y"], group[-1]["y"], row["x"]
        side = None
        for a in arrows:
            if left + 100 < a["x"] < left + 220 and top - 20 < a["y"] < bottom + 10:
                side = "b" if a["code"] == 0xF071 else "w" if a["code"] == 0xF072 else side
        caption = " ".join(t["text"].strip() for t in sorted(texts, key=lambda t: t["x"]) if left - 5 < t["x"] < left + 200 and top - 40 < t["y"] < top - 15)
        numbers = sorted(
            (t for t in texts if re.fullmatch(r"\d{1,4}", t["text"].strip()) and left - 60 < t["x"] < left and top - 25 < t["y"] < top + 25),
            key=lambda t: -t["x"],
        )
        number = int(numbers[0]["text"]) if numbers else None
        boards.append({"number": number, "placement": "/".join(placement), "side": side, "caption": re.sub(r"\s+,", ",", caption), "page": page.number, "y": top, "x": left})
    return boards


def solutions(doc):
    text = "\n".join(doc[p].get_text("text") for p in SOLUTION_PAGES)
    entries = {}
    pattern = re.compile(r"^(\d{1,4})\. ([^\n]*? – [^\n]*?\d{4})\s*$", re.M)
    matches = list(pattern.finditer(text))
    for i, m in enumerate(matches):
        end = matches[i + 1].start() if i + 1 < len(matches) else len(text)
        n = int(m.group(1))
        if n not in entries:
            entries[n] = {"header": m.group(2).strip(), "text": text[m.end():end].strip()}
    return entries


def main():
    pdf = sys.argv[1]
    doc = pymupdf.open(pdf)
    boards = []
    for p in EXERCISE_PAGES:
        boards.extend(boards_on_page(doc[p]))
    sols = solutions(doc)
    out = []
    relabelled = 0
    for i, b in enumerate(boards):
        if b["number"] != i + 1:
            relabelled += 1
            b["number"] = i + 1
        sol = sols.get(b["number"], {})
        out.append({**b, "solutionHeader": sol.get("header"), "solution": sol.get("text")})
    print(f"numbered by reading order; {relabelled} printed labels disagreed")
    here = os.path.dirname(os.path.abspath(__file__))
    os.makedirs(os.path.join(here, ".cache"), exist_ok=True)
    path = os.path.join(here, ".cache", "raw.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=1)
    missing = [b["number"] for b in out if not b["solution"]]
    no_side = [b["number"] for b in out if not b["side"]]
    no_num = sum(1 for b in out if b["number"] is None)
    print(f"{len(out)} diagrams, {len(sols)} solutions -> {path}")
    print(f"without number: {no_num}, without side: {len(no_side)} {no_side[:10]}, without solution: {len(missing)} {missing[:10]}")


if __name__ == "__main__":
    main()
