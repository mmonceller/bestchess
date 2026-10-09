/*
 * Board transforms that keep a puzzle's idea but change how it looks: mirror left–right,
 * swap the colours (Black to play), and slide every piece sideways. Castling rights are
 * dropped where the transform would break them; the variant builder re-checks every result.
 */
const FILES = 'abcdefgh';

function expand(placement) {
  return placement.split('/').map((row) => {
    const cells = [];
    for (const ch of row) {
      if (/\d/.test(ch)) for (let i = 0; i < Number(ch); i++) cells.push(null);
      else cells.push(ch);
    }
    return cells;
  });
}

function collapse(rows) {
  return rows.map((cells) => {
    let out = '';
    let gap = 0;
    for (const c of cells) {
      if (!c) { gap++; continue; }
      if (gap) { out += gap; gap = 0; }
      out += c;
    }
    return out + (gap || '');
  }).join('/');
}

const mapSquare = (sq, f) => (sq === '-' ? '-' : f(sq));
const swapCase = (c) => (c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase());

function apply(puzzle, { board, square, side = (s) => s, castling = () => '-' }) {
  const [placement, turn, rights, ep, ...rest] = puzzle.fen.split(' ');
  const fen = [collapse(board(expand(placement))), side(turn), castling(rights), mapSquare(ep, square), ...rest].join(' ');
  const moves = puzzle.moves.map((m) => square(m.slice(0, 2)) + square(m.slice(2, 4)) + m.slice(4));
  return { fen, moves };
}

export const mirror = (puzzle) => apply(puzzle, {
  board: (rows) => rows.map((r) => [...r].reverse()),
  square: (sq) => FILES[7 - FILES.indexOf(sq[0])] + sq[1],
});

export const swapColours = (puzzle) => apply(puzzle, {
  board: (rows) => [...rows].reverse().map((r) => r.map((c) => c && swapCase(c))),
  square: (sq) => sq[0] + (9 - Number(sq[1])),
  side: (t) => (t === 'w' ? 'b' : 'w'),
  castling: (r) => (r === '-' ? '-' : [...r].map(swapCase).sort().join('')),
});

/* Moves every piece `dx` files sideways, or returns null if a piece would fall off the board. */
export function shift(puzzle, dx) {
  const rows = expand(puzzle.fen.split(' ')[0]);
  const fits = rows.every((r) => r.every((c, f) => !c || (f + dx >= 0 && f + dx < 8)));
  if (!fits) return null;
  return apply(puzzle, {
    board: (rs) => rs.map((r) => r.map((_, f) => r[f - dx] || null)),
    square: (sq) => FILES[FILES.indexOf(sq[0]) + dx] + sq[1],
  });
}
