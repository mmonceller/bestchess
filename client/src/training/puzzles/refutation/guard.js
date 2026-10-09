import { Chess } from 'chess.js';
import { VALUE, NAME } from './pieces.js';

const playUci = (chess, uci) => chess.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' });

/*
 * After the opponent's reply, says why the threatened piece is no longer a target:
 * it stepped away, or taking it now loses material to a recapture. Empty when neither applies.
 */
export function guardSentence(afterFen, replyUci, from, target) {
  const chess = new Chess(afterFen);
  let reply;
  try { reply = playUci(chess, replyUci); } catch { return ''; }
  if (reply.from === target.square) return `The ${NAME[target.type]} simply steps out of the way.`;
  if (reply.to === from) return '';

  const mover = chess.get(from);
  const still = chess.get(target.square);
  if (!mover || still?.type !== target.type || still.color !== target.color) return '';
  if (VALUE[mover.type] <= VALUE[target.type]) return '';

  let take;
  try { take = chess.move({ from, to: target.square, promotion: 'q' }); } catch { return ''; }
  const back = chess.moves({ verbose: true })
    .filter((m) => m.to === target.square)
    .sort((a, b) => VALUE[a.piece] - VALUE[b.piece])[0];
  if (!back) return '';

  const guard = back.from === reply.to
    ? `From ${back.from} the ${NAME[back.piece]} now guards ${target.square}`
    : `The ${NAME[back.piece]} on ${back.from} guards ${target.square}`;
  return `${guard}, so [[${take.san}]] [[${back.san}]] would cost you a ${NAME[mover.type]} for a ${NAME[target.type]}.`;
}
