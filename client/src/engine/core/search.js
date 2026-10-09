import {
  PAWN, KING, MATE, MATE_BOUND, INF, PIECE_VALUE, FLAG_CAPTURE,
  moveFrom, moveTo, movePromo, moveFlags, typeOf,
} from './constants.js';
import { evaluate } from './evaluate.js';

const TT_BITS = 19;
const TT_SIZE = 1 << TT_BITS;
const TT_MASK = TT_SIZE - 1;
const TT_EXACT = 1;
const TT_LOWER = 2;
const TT_UPPER = 3;
const MAX_DEPTH = 64;

class AbortSearch extends Error {}

export class Searcher {
  constructor() {
    this.ttKey = new Int32Array(TT_SIZE);
    this.ttMove = new Int32Array(TT_SIZE);
    this.ttScore = new Int16Array(TT_SIZE);
    this.ttDepth = new Int8Array(TT_SIZE);
    this.ttFlag = new Uint8Array(TT_SIZE);
    this.moveBufs = Array.from({ length: MAX_DEPTH * 2 + 16 }, () => new Int32Array(256));
    this.scoreBufs = Array.from({ length: MAX_DEPTH * 2 + 16 }, () => new Int32Array(256));
    this.killers = new Int32Array((MAX_DEPTH * 2 + 16) * 2);
    this.history = new Int32Array(16 * 128);
  }

  clear() {
    this.ttKey.fill(0);
    this.ttFlag.fill(0);
    this.history.fill(0);
  }

  ttStore(pos, depth, score, flag, move, ply) {
    const i = pos.h1 & TT_MASK;
    if (this.ttFlag[i] && this.ttKey[i] === pos.h2 && this.ttDepth[i] > depth && flag !== TT_EXACT) return;
    if (score > MATE_BOUND) score += ply;
    else if (score < -MATE_BOUND) score -= ply;
    this.ttKey[i] = pos.h2;
    this.ttMove[i] = move;
    this.ttScore[i] = score;
    this.ttDepth[i] = depth;
    this.ttFlag[i] = flag;
  }

  checkTime() {
    if ((++this.nodes & 2047) === 0 && performance.now() > this.deadline) throw new AbortSearch();
  }

  scoreMoves(pos, moves, scores, n, ttMove, ply) {
    const b = pos.board;
    const k1 = this.killers[ply * 2];
    const k2 = this.killers[ply * 2 + 1];
    for (let i = 0; i < n; i++) {
      const m = moves[i];
      if (m === ttMove) { scores[i] = 10_000_000; continue; }
      const flags = moveFlags(m);
      const promo = movePromo(m);
      if (flags & FLAG_CAPTURE) {
        const victim = typeOf(b[moveTo(m)]) || PAWN;
        const attacker = typeOf(b[moveFrom(m)]);
        scores[i] = 1_000_000 + PIECE_VALUE[victim] * 10 - attacker;
      } else if (promo) {
        scores[i] = 900_000 + promo;
      } else if (m === k1) {
        scores[i] = 800_000;
      } else if (m === k2) {
        scores[i] = 700_000;
      } else {
        scores[i] = this.history[b[moveFrom(m)] * 128 + moveTo(m)];
      }
    }
  }

  pickNext(moves, scores, start, n) {
    let best = start;
    for (let j = start + 1; j < n; j++) if (scores[j] > scores[best]) best = j;
    if (best !== start) {
      const m = moves[start]; moves[start] = moves[best]; moves[best] = m;
      const s = scores[start]; scores[start] = scores[best]; scores[best] = s;
    }
    return moves[start];
  }

  isDrawn(pos) {
    if (pos.halfmove >= 100 || pos.isInsufficientMaterial()) return true;
    const limit = Math.min(pos.halfmove, pos.ply);
    for (let k = 2; k <= limit; k += 2) {
      const i = pos.ply - k;
      if (pos.stackH1[i] === pos.h1 && pos.stackH2[i] === pos.h2) return true;
    }
    for (let k = 0; k < this.gameH1.length; k++) {
      if (this.gameH1[k] === pos.h1 && this.gameH2[k] === pos.h2) return true;
    }
    return false;
  }

  quiesce(pos, alpha, beta, ply) {
    this.checkTime();
    const stand = evaluate(pos);
    if (stand >= beta) return stand;
    if (stand > alpha) alpha = stand;
    if (ply >= MAX_DEPTH * 2) return stand;

    const moves = this.moveBufs[ply];
    const scores = this.scoreBufs[ply];
    const n = pos.generate(moves, true);
    this.scoreMoves(pos, moves, scores, n, 0, ply);
    for (let i = 0; i < n; i++) {
      const m = this.pickNext(moves, scores, i, n);
      if (!movePromo(m)) {
        const victim = typeOf(pos.board[moveTo(m)]) || PAWN;
        if (stand + PIECE_VALUE[victim] + 200 < alpha) continue;
      }
      if (!pos.make(m)) continue;
      const score = -this.quiesce(pos, -beta, -alpha, ply + 1);
      pos.unmake();
      if (score >= beta) return score;
      if (score > alpha) alpha = score;
    }
    return alpha;
  }

  negamax(pos, depth, alpha, beta, ply, allowNull) {
    this.checkTime();
    const isPv = beta - alpha > 1;
    if (ply > 0 && this.isDrawn(pos)) return 0;

    alpha = Math.max(alpha, -MATE + ply);
    beta = Math.min(beta, MATE - ply - 1);
    if (alpha >= beta) return alpha;

    const inCheck = pos.inCheck();
    if (inCheck) depth++;
    if (depth <= 0) return this.quiesce(pos, alpha, beta, ply);

    const ti = pos.h1 & TT_MASK;
    let ttMove = 0;
    if (this.ttFlag[ti] && this.ttKey[ti] === pos.h2) {
      ttMove = this.ttMove[ti];
      if (ply > 0 && this.ttDepth[ti] >= depth && !isPv) {
        let s = this.ttScore[ti];
        if (s > MATE_BOUND) s -= ply;
        else if (s < -MATE_BOUND) s += ply;
        const f = this.ttFlag[ti];
        if (f === TT_EXACT || (f === TT_LOWER && s >= beta) || (f === TT_UPPER && s <= alpha)) return s;
      }
    }

    const staticEval = inCheck ? -INF : evaluate(pos);

    if (!isPv && !inCheck && depth <= 3 && staticEval - 120 * depth >= beta && Math.abs(beta) < MATE_BOUND) {
      return staticEval;
    }

    if (allowNull && !isPv && !inCheck && depth >= 3 && staticEval >= beta && pos.hasNonPawnMaterial(pos.side)) {
      const R = depth > 6 ? 3 : 2;
      pos.makeNull();
      const s = -this.negamax(pos, depth - 1 - R, -beta, -beta + 1, ply + 1, false);
      pos.unmakeNull();
      if (s >= beta) return s >= MATE_BOUND ? beta : s;
    }

    const moves = this.moveBufs[ply];
    const scores = this.scoreBufs[ply];
    const n = pos.generate(moves);
    this.scoreMoves(pos, moves, scores, n, ttMove, ply);

    let best = -INF;
    let bestMove = 0;
    let legal = 0;
    const origAlpha = alpha;

    for (let i = 0; i < n; i++) {
      const m = this.pickNext(moves, scores, i, n);
      if (!pos.make(m)) continue;
      legal++;
      const quiet = !(moveFlags(m) & FLAG_CAPTURE) && !movePromo(m);
      const givesCheck = pos.inCheck();
      let score;
      if (legal === 1) {
        score = -this.negamax(pos, depth - 1, -beta, -alpha, ply + 1, true);
      } else {
        let reduction = 0;
        if (depth >= 3 && quiet && !inCheck && !givesCheck && legal > 3) {
          reduction = legal > 10 ? 2 : 1;
          if (isPv) reduction = Math.max(0, reduction - 1);
        }
        score = -this.negamax(pos, depth - 1 - reduction, -alpha - 1, -alpha, ply + 1, true);
        if (score > alpha && reduction) {
          score = -this.negamax(pos, depth - 1, -alpha - 1, -alpha, ply + 1, true);
        }
        if (score > alpha && score < beta) {
          score = -this.negamax(pos, depth - 1, -beta, -alpha, ply + 1, true);
        }
      }
      pos.unmake();

      if (score > best) {
        best = score;
        bestMove = m;
        if (score > alpha) {
          alpha = score;
          if (score >= beta) {
            if (quiet) {
              if (this.killers[ply * 2] !== m) {
                this.killers[ply * 2 + 1] = this.killers[ply * 2];
                this.killers[ply * 2] = m;
              }
              const hi = pos.board[moveFrom(m)] * 128 + moveTo(m);
              this.history[hi] = Math.min(this.history[hi] + depth * depth, 600_000);
            }
            break;
          }
        }
      }
    }

    if (!legal) return inCheck ? -MATE + ply : 0;

    const flag = best >= beta ? TT_LOWER : best > origAlpha ? TT_EXACT : TT_UPPER;
    this.ttStore(pos, depth, best, flag, bestMove, ply);
    return best;
  }

  extractPv(pos, first, maxLen = 8) {
    const pv = [];
    let m = first;
    let made = 0;
    const seen = new Set();
    while (m && pv.length < maxLen) {
      const legal = pos.legalMoves();
      if (!legal.includes(m)) break;
      pv.push(m);
      pos.make(m);
      made++;
      const key = `${pos.h1}:${pos.h2}`;
      if (seen.has(key)) break;
      seen.add(key);
      const ti = pos.h1 & TT_MASK;
      m = this.ttFlag[ti] && this.ttKey[ti] === pos.h2 ? this.ttMove[ti] : 0;
    }
    while (made--) pos.unmake();
    return pv;
  }

  /*
   * Iterative deepening search.
   * options: { maxDepth, timeMs, multi } — `multi` scores every root move with a full window
   * (slower, used for weaker levels and for grading moves).
   * gameHistory: arrays of prior position hashes, for repetition detection.
   */
  search(pos, { maxDepth = MAX_DEPTH, timeMs = 1000, multi = false } = {}, gameHistory = { h1: [], h2: [] }) {
    this.gameH1 = gameHistory.h1;
    this.gameH2 = gameHistory.h2;
    this.nodes = 0;
    this.killers.fill(0);
    for (let i = 0; i < this.history.length; i++) this.history[i] >>= 2;
    const start = performance.now();
    this.deadline = start + timeMs;

    const rootMoves = pos.legalMoves();
    if (!rootMoves.length) {
      return { bestMove: 0, score: pos.inCheck() ? -MATE : 0, depth: 0, pv: [], rootScores: [], nodes: 0 };
    }

    let bestMove = rootMoves[0];
    let bestScore = 0;
    let completedDepth = 0;
    let rootScores = rootMoves.map((m) => ({ move: m, score: 0 }));
    const rootPly = pos.ply;

    for (let depth = 1; depth <= Math.min(maxDepth, MAX_DEPTH); depth++) {
      try {
        const res = multi ? this.searchRootMulti(pos, rootMoves, depth, bestMove) : this.searchRoot(pos, rootMoves, depth, bestMove);
        bestMove = res.bestMove;
        bestScore = res.score;
        if (res.rootScores) rootScores = res.rootScores;
        completedDepth = depth;
      } catch (e) {
        if (!(e instanceof AbortSearch)) throw e;
        while (pos.ply > rootPly) pos.unmake();
        break;
      }
      const elapsed = performance.now() - start;
      if (Math.abs(bestScore) > MATE_BOUND && depth > 2 + (MATE - Math.abs(bestScore))) break;
      if (rootMoves.length === 1 && depth >= 4) break;
      if (elapsed > timeMs * 0.55) break;
    }

    return {
      bestMove,
      score: bestScore,
      depth: completedDepth,
      pv: this.extractPv(pos, bestMove),
      rootScores,
      nodes: this.nodes,
      timeMs: Math.round(performance.now() - start),
    };
  }

  searchRoot(pos, rootMoves, depth, prevBest) {
    const ordered = [prevBest, ...rootMoves.filter((m) => m !== prevBest)];
    let alpha = -INF;
    const beta = INF;
    let bestMove = ordered[0];
    for (let i = 0; i < ordered.length; i++) {
      const m = ordered[i];
      pos.make(m);
      let score;
      if (i === 0) score = -this.negamax(pos, depth - 1, -beta, -alpha, 1, true);
      else {
        score = -this.negamax(pos, depth - 1, -alpha - 1, -alpha, 1, true);
        if (score > alpha) score = -this.negamax(pos, depth - 1, -beta, -alpha, 1, true);
      }
      pos.unmake();
      if (score > alpha) { alpha = score; bestMove = m; }
    }
    this.ttStore(pos, depth, alpha, TT_EXACT, bestMove, 0);
    return { bestMove, score: alpha };
  }

  searchRootMulti(pos, rootMoves, depth, prevBest) {
    const rootScores = [];
    let bestMove = prevBest;
    let bestScore = -INF;
    for (const m of rootMoves) {
      pos.make(m);
      const score = -this.negamax(pos, depth - 1, -INF, INF, 1, true);
      pos.unmake();
      rootScores.push({ move: m, score });
      if (score > bestScore) { bestScore = score; bestMove = m; }
    }
    rootScores.sort((a, b) => b.score - a.score);
    this.ttStore(pos, depth, bestScore, TT_EXACT, bestMove, 0);
    return { bestMove, score: bestScore, rootScores };
  }
}

export function isMateScore(score) {
  return Math.abs(score) > MATE_BOUND;
}

export function mateIn(score) {
  const plies = MATE - Math.abs(score);
  return Math.ceil(plies / 2) * Math.sign(score);
}