import { FILES } from '../pieces.js';

/* Beyond this many pieces moving at once (e.g. a new game set up), the board just redraws. */
const MAX_SLIDES = 16;

const same = (a, b) => a && b && a.type === b.type && a.color === b.color;

function screenXY(sq, flipped) {
  const file = FILES.indexOf(sq[0]);
  const rank = Number(sq[1]);
  return flipped ? { x: 7 - file, y: rank - 1 } : { x: file, y: 8 - rank };
}

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/*
 * What changed between two positions ({ square: { type, color } } maps):
 *   slides:   { toSquare: { from, dx, dy } } — a piece that travelled; dx/dy are in squares, on screen
 *   captured: [{ square, piece }] — pieces that vanished (taken), faded out where they stood
 *   appeared: Set of squares whose piece came from nowhere (e.g. an un-capture when stepping back)
 * Returns null when nothing changed or too much changed to animate sensibly.
 */
export function diffPieces(before, after, flipped) {
  const removed = Object.keys(before).filter((sq) => !same(before[sq], after[sq]));
  const added = Object.keys(after).filter((sq) => !same(before[sq], after[sq]));
  if (!removed.length && !added.length) return null;

  const slides = {};
  const used = new Set();
  const match = (to, accept) => {
    let best = null;
    for (const from of removed) {
      if (used.has(from) || !accept(before[from], after[to])) continue;
      const d = distance(screenXY(from, flipped), screenXY(to, flipped));
      if (!best || d < best.d) best = { from, d };
    }
    return best;
  };
  const link = (to, from) => {
    used.add(from);
    const a = screenXY(from, flipped);
    const b = screenXY(to, flipped);
    slides[to] = { from, dx: a.x - b.x, dy: a.y - b.y };
  };

  for (const to of added) {
    const m = match(to, same);
    if (m) link(to, m.from);
  }
  /* Promotion (pawn becomes queen) and its reverse: same colour, one step away. */
  for (const to of added) {
    if (slides[to]) continue;
    const m = match(to, (a, b) => a.color === b.color && (a.type === 'p' || b.type === 'p'));
    if (m && m.d < 1.5) link(to, m.from);
  }

  if (Object.keys(slides).length > MAX_SLIDES) return null;
  const captured = removed.filter((sq) => !used.has(sq)).map((square) => ({ square, piece: before[square] }));
  const appeared = new Set(added.filter((sq) => !slides[sq]));
  return { slides, captured, appeared };
}
