import { Chess } from 'chess.js';
import { engine } from '../../../engine/engineClient.js';
import { aboutOpponent } from '../../../review/perspective.js';
import { mainTarget } from './threat.js';
import { guardSentence } from './guard.js';
import { outcomeSentence } from './outcome.js';
import { NAME } from './pieces.js';

const lowerFirst = (s) => s.charAt(0).toLowerCase() + s.slice(1);

/*
 * Why a move that didn't solve the puzzle fails. `fen` is the position after the player's
 * `move` (a chess.js verbose move). Returns null if the engine has no answer.
 */
export async function findRefutation(fen, move, timeMs = 800) {
  try {
    const a = await engine.analyse(fen, { timeMs });
    if (!a?.best) return null;
    const chess = new Chess(fen);
    const reply = new Chess(fen).move({ from: a.best.slice(0, 2), to: a.best.slice(2, 4), promotion: a.best[4] || 'q' });
    const target = move ? mainTarget(chess, move.to) : null;
    const reason = a.explanation?.reasons?.[0];
    return {
      san: reply.san,
      why: reason ? aboutOpponent(reason) : '',
      threat: target && move ? `Your ${NAME[move.promotion || move.piece]} goes after the ${NAME[target.type]} on ${target.square}` : (chess.inCheck() ? 'It gives check' : ''),
      guard: target && move ? guardSentence(fen, a.best, move.to, target) : '',
      outcome: outcomeSentence(a.score),
    };
  } catch {
    return null;
  }
}

/* "Your rook goes after the bishop on e3, but White answers [[Nxd5]] — … You would end up …" */
export function refutationText(ref, opponentName) {
  if (!ref) return '';
  const answer = `${opponentName} answers [[${ref.san}]]${ref.why ? `, which ${lowerFirst(ref.why).replace(/\.?$/, '.')}` : '.'}`;
  const opening = ref.threat ? `${ref.threat}, but ${answer}` : answer;
  return [opening, ref.guard, ref.outcome].filter(Boolean).map((s) => ` ${s}`).join('');
}
