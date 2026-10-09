import { Chess } from 'chess.js';
import { engine } from '../engine/engineClient.js';
import { uciLineToSan } from '../chess/status.js';
import { classify, moveAccuracy, KIND_ORDER } from './classify.js';
import { buildComment } from './commentary.js';
import { dangerNote, dangerState } from './dangerNotes.js';
import { threatensMate } from '../chess/danger/mateThreat.js';

export const REVIEW_VERSION = 1;

/* Replays a PGN into the list of moves with the position before and after each one. */
export function replayPgn(pgn) {
  const c = new Chess();
  try { c.loadPgn(pgn || ''); } catch { return { moves: [], fens: [new Chess().fen()] }; }
  const moves = c.history({ verbose: true });
  return { moves, fens: [moves[0]?.before || c.fen(), ...moves.map((m) => m.after)] };
}

const uciOf = (m) => m.from + m.to + (m.promotion || '');

/*
 * Reviews every move `color` played. Calls onProgress(done, total) as it goes and stops
 * early (returning null) when isCancelled() turns true. `danger` adds warnings for the
 * moments the game turned dangerous for `color` (see dangerNotes).
 */
export async function analyzeGame(pgn, color, { onProgress, isCancelled, timeMs = 900, danger = true } = {}) {
  const { moves } = replayPgn(pgn);
  const mine = moves.map((m, ply) => ({ m, ply })).filter(({ m }) => m.color === color);
  const opponent = color === 'w' ? 'b' : 'w';
  const items = [];
  let prevDanger = null;

  for (let i = 0; i < mine.length; i++) {
    if (isCancelled?.()) return null;
    onProgress?.(i, mine.length);
    const { m, ply } = mine[i];
    const uci = uciOf(m);
    const r = await engine.review(m.before, uci, timeMs);
    if (!r?.legal) continue;

    const kind = classify(r, uci);
    const showBest = r.best !== uci && kind !== 'best' && kind !== 'forced';
    const bestLineSan = showBest ? uciLineToSan(Chess, m.before, r.bestLine || [r.best]) : [];
    const replySan = r.reply ? uciLineToSan(Chess, m.after, [r.reply.uci])[0] : null;
    const comment = buildComment(kind, r, { bestSan: bestLineSan[0] || null, replySan });
    const bestExp = r.bestExplanation || r.played;
    const note = danger ? dangerNote(r, { threat: threatensMate(m.before, opponent), prev: prevDanger }) : null;
    prevDanger = dangerState(r);

    items.push({
      ply,
      color,
      san: m.san,
      uci,
      kind,
      accuracy: Math.round(moveAccuracy(r)),
      eval: r.playedCp,
      best: showBest ? r.best : null,
      bestLine: bestLineSan,
      reply: r.reply && comment.punish ? r.reply.uci : null,
      ...comment,
      tags: bestExp?.tags?.slice(0, 6) || [],
      piece: bestExp?.piece || null,
      danger: note,
    });
  }
  onProgress?.(mine.length, mine.length);
  return { version: REVIEW_VERSION, color, createdAt: Date.now(), summary: summarize(items), moves: items };
}

export function summarize(items) {
  const counts = Object.fromEntries(KIND_ORDER.map((k) => [k, 0]));
  for (const it of items) counts[it.kind]++;
  const accuracy = items.length ? Math.round(items.reduce((s, it) => s + it.accuracy, 0) / items.length) : null;
  return { accuracy, counts, moves: items.length };
}
