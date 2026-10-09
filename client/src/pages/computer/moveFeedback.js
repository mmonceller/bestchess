import { Chess } from 'chess.js';
import { uciLineToSan } from '../../chess/status.js';

/*
 * Turns an engine grade of the player's move into coach feedback. For inaccurate moves,
 * `bestHint` describes the better move so it can be tied to a lesson tip.
 */
export function moveFeedback(g, fen) {
  const bestSan = uciLineToSan(Chess, fen, [g.best])[0];
  const why = g.explanation?.reasons?.[0] || '';
  const bestHint = { tags: g.explanation?.tags || [], piece: g.explanation?.piece || null, san: bestSan };
  if (g.loss <= 15) return { tone: 'good', icon: 'sparkle', text: g.loss === 0 ? 'Best move!' : 'Excellent move.' };
  if (g.loss <= 60) return { tone: 'good', icon: 'checkCircle', text: `Good move. ${bestSan} was slightly better.` };
  if (g.loss <= 140) return { tone: 'ok', icon: 'info', text: `Not the best. ${bestSan} was stronger. ${why}`, bestHint };
  if (g.loss <= 300) return { tone: 'bad', icon: 'warning', text: `Mistake. Try ${bestSan} next time. ${why}`, bestHint };
  return { tone: 'bad', icon: 'xCircle', text: `Big mistake! ${bestSan} was much stronger. ${why}`, bestHint };
}
