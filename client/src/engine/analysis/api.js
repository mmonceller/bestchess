import { Position } from '../core/position.js';
import { Searcher, mateIn } from '../core/search.js';
import { MATE_BOUND } from '../core/constants.js';
import { getLevel } from '../levels.js';
import { explainMove } from './explain.js';

const searcher = new Searcher();

function historyHashes(fens = []) {
  const h1 = [];
  const h2 = [];
  for (const f of fens) {
    const p = new Position(f);
    h1.push(p.h1);
    h2.push(p.h2);
  }
  return { h1, h2 };
}

const toUci = (pos, moves) => {
  const out = [];
  let made = 0;
  for (const m of moves) {
    out.push(pos.moveToUci(m));
    pos.make(m);
    made++;
  }
  while (made--) pos.unmake();
  return out;
};

export function chooseMove(fen, levelId, history = []) {
  const level = getLevel(levelId);
  const pos = new Position(fen);
  const legal = pos.legalMoves();
  if (!legal.length) return null;
  if (level.blunder && Math.random() < level.blunder) {
    const m = legal[Math.floor(Math.random() * legal.length)];
    return { uci: pos.moveToUci(m), score: 0 };
  }
  const multi = level.noise > 0;
  const res = searcher.search(pos, { maxDepth: level.depth, timeMs: level.timeMs, multi }, historyHashes(history));
  if (!multi) return { uci: pos.moveToUci(res.bestMove), score: res.score };

  /* Never miss a forced mate or a mate-in-one threat, even at low levels; noise applies otherwise. */
  let best = null;
  let bestNoisy = -Infinity;
  for (const r of res.rootScores) {
    const mateish = Math.abs(r.score) > MATE_BOUND;
    const noisy = mateish ? r.score : r.score + (Math.random() * 2 - 1) * level.noise;
    if (noisy > bestNoisy) { bestNoisy = noisy; best = r; }
  }
  return { uci: pos.moveToUci(best.move), score: best.score };
}

export function analyse(fen, { timeMs = 1200, history = [] } = {}) {
  const pos = new Position(fen);
  const res = searcher.search(pos, { timeMs }, historyHashes(history));
  if (!res.bestMove) return { best: null, score: res.score, pv: [], depth: 0 };
  const best = pos.moveToUci(res.bestMove);
  return {
    best,
    score: res.score,
    depth: res.depth,
    pv: toUci(pos, res.pv),
    explanation: explainMove(fen, best, res.score),
  };
}

/*
 * Grades a candidate move by comparing it against every root move searched at the same depth.
 * Returns centipawn loss (0 = engine's choice) so lessons can accept any "good enough" move.
 */
export function gradeMove(fen, uci, { timeMs = 1200, maxDepth = 6 } = {}) {
  const pos = new Position(fen);
  const res = searcher.search(pos, { timeMs, maxDepth, multi: true });
  const entry = res.rootScores.find((r) => pos.moveToUci(r.move) === uci);
  const best = res.rootScores[0];
  if (!entry || !best) return { legal: false };
  let loss = Math.max(0, best.score - entry.score);
  if (best.score > MATE_BOUND && entry.score > MATE_BOUND) loss = Math.min(loss, 10);
  const bestUci = pos.moveToUci(best.move);
  return {
    legal: true,
    loss,
    moveScore: entry.score,
    bestScore: best.score,
    best: bestUci,
    explanation: explainMove(fen, bestUci, best.score),
  };
}

/* Mate scores become large centipawn values so move losses stay comparable. */
const toCp = (score) => (Math.abs(score) > MATE_BOUND ? Math.sign(score) * (3000 - Math.abs(mateIn(score)) * 10) : score);

/*
 * Reviews one played move: how much it lost compared with the engine's choice, why each move
 * works, the best continuation, and (after a real slip) the reply that punishes it.
 * Scores are from the mover's point of view, in centipawns.
 */
export function reviewMove(fen, uci, { timeMs = 900 } = {}) {
  const pos = new Position(fen);
  const legal = pos.legalMoves();
  const played = pos.uciToMove(uci);
  if (!played) return { legal: false };
  if (legal.length === 1) {
    const res = searcher.search(pos, { timeMs: 200, maxDepth: 6 });
    const cp = toCp(res.score);
    return { legal: true, forced: true, loss: 0, best: uci, bestCp: cp, playedCp: cp, bestLine: [uci], played: explainMove(fen, uci, res.score) };
  }

  const res = searcher.search(pos, { timeMs, multi: true });
  const entry = res.rootScores.find((r) => pos.moveToUci(r.move) === uci);
  const best = res.rootScores[0];
  if (!entry || !best) return { legal: false };
  const bestUci = pos.moveToUci(best.move);
  const bestCp = toCp(best.score);
  const playedCp = toCp(entry.score);
  const out = {
    legal: true,
    forced: false,
    loss: Math.max(0, bestCp - playedCp),
    best: bestUci,
    bestCp,
    playedCp,
    bestMate: Math.abs(best.score) > MATE_BOUND ? mateIn(best.score) : null,
    playedMate: Math.abs(entry.score) > MATE_BOUND ? mateIn(entry.score) : null,
    bestLine: res.pv.length && res.pv[0] === best.move ? toUci(pos, res.pv).slice(0, 5) : [bestUci],
    played: explainMove(fen, uci, entry.score),
    bestExplanation: bestUci === uci ? null : explainMove(fen, bestUci, best.score),
  };

  if (out.loss >= 80) {
    pos.make(played);
    const after = pos.fen();
    const r = searcher.search(pos, { timeMs: Math.round(timeMs / 2) });
    if (r.bestMove) {
      const replyUci = pos.moveToUci(r.bestMove);
      out.reply = { uci: replyUci, line: toUci(pos, r.pv).slice(0, 4), explanation: explainMove(after, replyUci, r.score) };
    }
    pos.unmake();
  }
  return out;
}

export function evaluatePosition(fen, { timeMs = 600 } = {}) {
  const pos = new Position(fen);
  const res = searcher.search(pos, { timeMs });
  return { score: res.score, best: res.bestMove ? pos.moveToUci(res.bestMove) : null };
}
