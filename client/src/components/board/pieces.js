/* Filled glyphs for both colors, recolored with CSS; U+FE0E forces text (not emoji) rendering. */
export const GLYPH = {
  k: '\u265A\uFE0E',
  q: '\u265B\uFE0E',
  r: '\u265C\uFE0E',
  b: '\u265D\uFE0E',
  n: '\u265E\uFE0E',
  p: '\u265F\uFE0E',
};

export const FILES = 'abcdefgh';

/* Parses the placement field of a FEN into { e4: { type: 'p', color: 'w' }, ... }. */
export function parseFen(fen) {
  const out = {};
  const rows = fen.split(' ')[0].split('/');
  rows.forEach((row, r) => {
    let f = 0;
    for (const ch of row) {
      if (/\d/.test(ch)) { f += +ch; continue; }
      const lower = ch.toLowerCase();
      out[FILES[f] + (8 - r)] = { type: lower, color: ch === lower ? 'b' : 'w' };
      f++;
    }
  });
  return out;
}

export function kingSquare(fen, color) {
  const pieces = parseFen(fen);
  return Object.keys(pieces).find((sq) => pieces[sq].type === 'k' && pieces[sq].color === color);
}
