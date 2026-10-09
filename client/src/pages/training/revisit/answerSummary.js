import { Chess } from 'chess.js';
import { uciLineToSan } from '../../../chess/status.js';

const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

/* "1. Nc7+ Ke7 2. Nxa6" from a start position and a list of moves in SAN. */
export function numberLine(fen, sans) {
  const [, side, , , , full] = fen.split(' ');
  let num = Number(full) || 1;
  let white = side === 'w';
  const out = [];
  sans.forEach((san, i) => {
    if (white) out.push(`${num}. ${san}`);
    else out.push(i === 0 ? `${num}... ${san}` : san);
    if (!white) num++;
    white = !white;
  });
  return out.join(' ');
}

export const solutionText = (step) => numberLine(step.fen, uciLineToSan(Chess, step.fen, step.line));

/*
 * Replays the student's attempts at a `move` step against the scripted line and
 * marks each one right or wrong, with SAN taken from the position it was tried in.
 */
export function judgeMoveTries(step, tries = []) {
  const game = new Chess(step.fen);
  let ply = 0;
  const out = [];
  for (const uci of tries) {
    if (ply >= step.line.length) break;
    const expected = step.accept?.[ply] || [step.line[ply]];
    let san = uci;
    try { san = new Chess(game.fen()).move(toMove(uci)).san; } catch { /* keep uci */ }
    const ok = expected.includes(uci);
    out.push({ uci, san, ok, first: ply === 0 });
    if (!ok) continue;
    if (uci !== step.line[ply]) break;
    try {
      game.move(toMove(uci));
      if (step.line[ply + 1]) game.move(toMove(step.line[ply + 1]));
    } catch { break; }
    ply += 2;
  }
  return out;
}

/* Attempts at a `best` step are all made from the starting position. */
export function judgeBestTries(step, answer) {
  const tries = answer?.tries || [];
  return tries.map((uci, i) => {
    let san = uci;
    try { san = new Chess(step.fen).move(toMove(uci)).san; } catch { /* keep uci */ }
    return { uci, san, ok: i === tries.length - 1 };
  });
}

export function sanOf(fen, uci) {
  try { return new Chess(fen).move(toMove(uci)).san; } catch { return uci; }
}

/* Final position of a played-out drill. */
export function finalFen(fen, sans = []) {
  const game = new Chess(fen);
  for (const san of sans) {
    try { game.move(san); } catch { break; }
  }
  return game.fen();
}
