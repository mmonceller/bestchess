import { Chess } from 'chess.js';

/*
 * Tags the tactical ideas in a Woodpecker solution line by replaying it.
 * Only the solver's moves (even plies) are checked; the replies tell us whether a piece
 * offered as a sacrifice was taken, and by what.
 */
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 100 };
const DIRS = { b: [[1, 1], [1, -1], [-1, 1], [-1, -1]], r: [[1, 0], [-1, 0], [0, 1], [0, -1]] };
DIRS.q = [...DIRS.b, ...DIRS.r];
const FILES = 'abcdefgh';

const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
const coords = (sq) => [FILES.indexOf(sq[0]), Number(sq[1]) - 1];
const square = (f, r) => (f >= 0 && f < 8 && r >= 0 && r < 8 ? FILES[f] + (r + 1) : null);
const other = (c) => (c === 'w' ? 'b' : 'w');

function kingSquare(chess, color) {
  for (const row of chess.board()) for (const p of row) if (p && p.type === 'k' && p.color === color) return p.square;
  return null;
}

function piecesOf(chess, color) {
  return chess.board().flat().filter((p) => p && p.color === color);
}

const defended = (chess, sq, color) => chess.attackers(sq, color).length > 0;

/* Enemy pieces the piece on `from` attacks, worth hitting: the king, bigger pieces, or loose ones. */
function forkTargets(chess, from, me) {
  const mover = chess.get(from);
  return piecesOf(chess, other(me)).filter((p) => {
    if (!chess.attackers(p.square, me).includes(from)) return false;
    if (p.type === 'k') return true;
    if (VALUE[p.type] < 3) return false;
    return VALUE[p.type] > VALUE[mover.type] || !defended(chess, p.square, other(me));
  });
}

/* Pins and skewers along the lines of a slider standing on `from`. */
function lineTactics(chess, from, me) {
  const mover = chess.get(from);
  const found = new Set();
  for (const [df, dr] of DIRS[mover.type] || []) {
    const [f0, r0] = coords(from);
    const hits = [];
    for (let k = 1; k < 8 && hits.length < 2; k++) {
      const sq = square(f0 + df * k, r0 + dr * k);
      if (!sq) break;
      const p = chess.get(sq);
      if (!p) continue;
      if (p.color === me) break;
      hits.push(p);
    }
    if (hits.length < 2) continue;
    const [front, back] = hits;
    if (VALUE[front.type] >= 3 && (back.type === 'k' || VALUE[back.type] > VALUE[front.type]) && VALUE[back.type] >= 5) found.add('pin');
    if ((front.type === 'k' || front.type === 'q') && VALUE[back.type] >= 3 && VALUE[back.type] < VALUE[front.type]) found.add('skewer');
  }
  return found;
}

function mateShape(chess, mover, to) {
  const tags = [];
  const loser = chess.turn();
  const ks = kingSquare(chess, loser);
  const [kf, kr] = coords(ks);
  const homeRank = loser === 'w' ? 0 : 7;
  const neighbours = [];
  for (let df = -1; df <= 1; df++) for (let dr = -1; dr <= 1; dr++) if (df || dr) { const s = square(kf + df, kr + dr); if (s) neighbours.push(s); }
  if (mover === 'n' && neighbours.every((s) => chess.get(s)?.color === loser || chess.attackers(s, other(loser)).length)) {
    if (neighbours.filter((s) => chess.get(s)?.color === loser).length >= neighbours.length - 1) tags.push('smothered');
  }
  if (kr === homeRank && (mover === 'r' || mover === 'q') && coords(to)[1] === homeRank) tags.push('backRank');
  return tags;
}

export function tagMotifs({ fen, moves, first, goal }) {
  const chess = new Chess(fen);
  const me = chess.turn();
  const tags = new Set();
  if (first === 'quiet') tags.add('quiet');
  if (goal === 'mate') tags.add('mate');
  for (let i = 0; i < moves.length; i++) {
    const solver = i % 2 === 0;
    const beforeFen = chess.fen();
    let mv;
    try { mv = chess.move(toMove(moves[i])); } catch { break; }
    if (!solver) continue;
    const them = other(me);
    if (mv.promotion) tags.add('promotion');

    if (chess.inCheck()) {
      const checkers = chess.attackers(kingSquare(chess, them), me);
      if (checkers.length >= 2) tags.add('doubleCheck');
      else if (!checkers.includes(mv.to)) tags.add('discovered');
    }
    if (chess.isCheckmate()) {
      tags.add('mate');
      for (const t of mateShape(chess, mv.piece, mv.to)) tags.add(t);
      break;
    }

    const before = new Chess(beforeFen);
    for (const p of piecesOf(chess, them)) {
      if (p.type !== 'q' && p.type !== 'r') continue;
      const fresh = chess.attackers(p.square, me).filter((s) => s !== mv.to && !before.attackers(p.square, me).includes(s));
      if (fresh.length) tags.add('discovered');
    }
    if (forkTargets(chess, mv.to, me).length >= 2) tags.add('fork');
    for (const t of lineTactics(chess, mv.to, me)) tags.add(t);

    const reply = moves[i + 1] && toMove(moves[i + 1]);
    const given = VALUE[mv.promotion || mv.piece];
    if (reply && reply.to === mv.to && given - VALUE[mv.captured || 'p'] * (mv.captured ? 1 : 0) >= 2) {
      const taker = chess.get(reply.from);
      tags.add('sacrifice');
      if (taker?.type === 'k') tags.add('decoy');
      else if (taker) {
        const next = moves[i + 2] && toMove(moves[i + 2]);
        const guarded = next && before.attackers(next.to, them).includes(reply.from);
        if (guarded) tags.add('deflection');
      }
    }
    if (mv.captured && VALUE[mv.captured] >= 3) {
      const next = moves[i + 2] && toMove(moves[i + 2]);
      if (next && next.to !== mv.to && before.attackers(next.to, them).includes(mv.to)) tags.add('removeDefender');
    }
  }
  return [...tags];
}
