import { Chess } from 'chess.js';
import { uciLineToSan } from '../../chess/status.js';
import { tradeLesson } from '../../training/hints/tradeLesson.js';

/*
 * Turns an engine grade of the player's move into coach feedback. For inaccurate moves,
 * `bestHint` describes the better move so it can be tied to a lesson tip.
 * A trade while ahead or behind is judged by the trade lesson, not by a different
 * idea in the engine's alternative.
 */
export function moveFeedback(g, fen) {
  const bestSan = uciLineToSan(Chess, fen, [g.best])[0];
  const why = g.explanation?.reasons?.[0] || '';
  const trade = tradeLesson(g.played, { loss: g.loss });
  const bestHint = trade
    ? { tags: trade.tags, piece: g.played?.piece || null, san: bestSan }
    : { tags: g.explanation?.tags || [], piece: g.explanation?.piece || null, san: bestSan };
  if (g.loss <= 15) {
    return {
      tone: 'good',
      icon: 'sparkle',
      text: g.loss === 0 ? 'Best move!' : 'Excellent move.',
      bestHint: trade && !trade.bad && !trade.behind ? bestHint : undefined,
    };
  }
  if (trade?.behind && g.loss > 60) {
    const tone = g.loss <= 140 ? 'ok' : 'bad';
    return {
      tone,
      icon: tone === 'ok' ? 'info' : 'warning',
      text: `You're behind, so keep pieces on and mix it up. Trading makes their win easier.${bestSan ? ` ${bestSan} keeps more on the board.` : ''}`,
      bestHint,
    };
  }
  if (trade && !trade.behind && !trade.bad && g.loss <= 300) {
    return {
      tone: g.loss <= 60 ? 'good' : 'ok',
      icon: g.loss <= 60 ? 'checkCircle' : 'info',
      text: g.loss <= 60
        ? 'Good trade. You\'re ahead, so swapping pieces makes the extra material count more.'
        : `You're ahead, so trading is the right plan.${bestSan ? ` ${bestSan} keeps that advantage a little more cleanly.` : ''}`,
      bestHint,
    };
  }
  if (trade?.bad && !trade.behind) {
    return {
      tone: 'bad',
      icon: 'warning',
      text: `You're ahead, so trading is right — but this one leaves them too much play.${bestSan ? ` ${bestSan} was safer.` : ''}`,
      bestHint,
    };
  }
  if (g.loss <= 15) return { tone: 'good', icon: 'sparkle', text: g.loss === 0 ? 'Best move!' : 'Excellent move.' };
  if (g.loss <= 60) return { tone: 'good', icon: 'checkCircle', text: `Good move. ${bestSan} was slightly better.` };
  if (g.loss <= 140) return { tone: 'ok', icon: 'info', text: `Not the best. ${bestSan} was stronger. ${why}`, bestHint };
  if (g.loss <= 300) return { tone: 'bad', icon: 'warning', text: `Mistake. Try ${bestSan} next time. ${why}`, bestHint };
  return { tone: 'bad', icon: 'xCircle', text: `Big mistake! ${bestSan} was much stronger. ${why}`, bestHint };
}
