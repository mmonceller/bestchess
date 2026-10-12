import { Chess } from 'chess.js';
import { evalEngine } from '../../../engine/engineClient.js';
import { isMultiStep } from '../grace.js';
import { playBook, recaptureOf, sacrificed, toMove } from './moves.js';
import { moveNote, startNote } from './notes.js';
import { giftLabel, payoff } from './why.js';

const MAX_EXTRA = 10;
const MIN_EXTRA = 2;

/*
 * Book line did not mate, and either the student had more than one move to find
 * or they gave a bigger piece for a smaller one — so a continuation is worth showing.
 */
export function wantsSimulation(puzzle) {
  if (!puzzle?.moves?.length) return false;
  const { mate } = playBook(puzzle);
  if (mate) return false;
  return isMultiStep(puzzle) || sacrificed(puzzle);
}

export async function fetchContinuation(puzzle) {
  const { chess, last, mate } = playBook(puzzle);
  if (mate) return null;
  const us = puzzle.fen.split(' ')[1];
  const rec = chess.turn() !== us ? recaptureOf(chess, last) : null;
  const extra = [];
  if (rec) extra.push(chess.move(rec));

  if (!chess.isGameOver()) {
    let pv = [];
    try {
      const a = await evalEngine.analyse(chess.fen(), { timeMs: 1600 });
      pv = a?.pv || (a?.best ? [a.best] : []);
    } catch {
      pv = [];
    }
    for (const uci of pv.slice(0, MAX_EXTRA - extra.length)) {
      try { extra.push(chess.move(toMove(uci))); } catch { break; }
      if (chess.isCheckmate()) break;
    }
  }
  if (!chess.isGameOver() && extra.length < MAX_EXTRA) {
    const mate = chess.moves({ verbose: true }).find((m) => m.san.includes('#'));
    if (mate) extra.push(chess.move(mate));
  }
  if (extra.length < MIN_EXTRA) return null;

  const startFen = (() => {
    const c = new Chess(puzzle.fen);
    for (const uci of puzzle.moves || []) {
      try { c.move(toMove(uci)); } catch { break; }
    }
    return c.fen();
  })();

  const gift = giftLabel(puzzle);
  const walk = new Chess(startFen);
  const frames = [{ fen: startFen, move: null, ours: false, note: startNote(last, Boolean(rec)), why: null }];
  for (let i = 0; i < extra.length; i++) {
    const planned = extra[i];
    const before = new Chess(walk.fen());
    const onlyBefore = before.moves().length === 1;
    const number = before.moveNumber();
    const played = walk.move({ from: planned.from, to: planned.to, promotion: planned.promotion });
    if (!played) break;
    const ours = played.color === us;
    const isRec = rec && frames.length === 1 && played.from === rec.from && played.to === rec.to;
    const lastExtra = i === extra.length - 1;
    const cashIn = ours && (played.san.includes('#') || played.captured || (played.san.includes('+') && walk.moves().length <= 2));
    const firstWhy = cashIn && !frames.some((f) => f.why);
    frames.push({
      fen: walk.fen(),
      move: played,
      number,
      ours,
      note: moveNote(walk, played, { ours, recapture: isRec, onlyBefore }),
      why: (lastExtra || firstWhy) ? payoff(puzzle.fen, walk.fen(), us, { gift, last: lastExtra }) : null,
    });
  }
  if (frames.length < MIN_EXTRA + 1) return null;
  return { startFen, frames };
}
