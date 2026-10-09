import { parseFen } from '../components/board/pieces.js';

const START = { p: 8, n: 2, b: 2, r: 2, q: 1 };
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9 };

/* Pieces each side has captured (inferred from the board) and the point balance for White. */
export function materialInfo(fen) {
  const counts = { w: { p: 0, n: 0, b: 0, r: 0, q: 0 }, b: { p: 0, n: 0, b: 0, r: 0, q: 0 } };
  for (const p of Object.values(parseFen(fen))) if (p.type !== 'k') counts[p.color][p.type]++;
  const captured = { w: [], b: [] };
  let balance = 0;
  for (const t of ['q', 'r', 'b', 'n', 'p']) {
    for (let i = counts.b[t]; i < START[t]; i++) captured.w.push(t);
    for (let i = counts.w[t]; i < START[t]; i++) captured.b.push(t);
    balance += (counts.w[t] - counts.b[t]) * VALUE[t];
  }
  return { captured, balance };
}
