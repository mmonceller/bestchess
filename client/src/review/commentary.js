import { tradeLesson } from '../training/hints/tradeLesson.js';

/*
 * Turns an engine review of one move into short coach-style commentary.
 * Engine reasons are full sentences ("Grabs a free knight."), so they are used as-is.
 * A trade while ahead or behind is worded from that lesson.
 */
const first = (exp) => exp?.reasons?.[0] || '';

function opening(kind) {
  switch (kind) {
    case 'best': return 'Best move!';
    case 'excellent': return 'Excellent move.';
    case 'good': return 'Good move.';
    case 'forced': return 'This was the only legal move.';
    case 'inaccuracy': return 'Inaccuracy. Not a disaster, but there was something better.';
    case 'mistake': return 'Mistake. This makes your position clearly worse.';
    default: return 'Blunder! This move hands your opponent a big chance.';
  }
}

export function buildComment(kind, r, { bestSan, replySan }) {
  const trade = tradeLesson(r.played, { loss: r.loss });
  const parts = [opening(kind)];
  const bad = kind === 'inaccuracy' || kind === 'mistake' || kind === 'blunder';

  if (trade?.behind && bad) {
    return {
      text: `You're behind, so keep pieces on and mix it up. Trading makes their win easier.${bestSan ? ` ${bestSan} keeps more on the board.` : ''}`,
      idea: first(r.played),
      better: bestSan ? { san: bestSan, why: 'It leaves more pieces on the board.' } : null,
      punish: bad && replySan ? { san: replySan, why: first(r.reply?.explanation) } : null,
    };
  }
  if (trade && !trade.behind && !trade.bad && bad) {
    return {
      text: `You traded while ahead — that is the right plan.${bestSan ? ` ${bestSan} was another way to keep the advantage.` : ''}`,
      idea: first(r.played),
      better: bestSan ? { san: bestSan, why: 'It keeps your extra material too.' } : null,
      punish: replySan ? { san: replySan, why: first(r.reply?.explanation) } : null,
    };
  }
  if (trade?.bad && !trade.behind && bad) {
    return {
      text: `You're ahead, so trading is right — but this one leaves them too much play.${bestSan ? ` ${bestSan} was safer.` : ''}`,
      idea: first(r.played),
      better: bestSan ? { san: bestSan, why: 'It keeps the extra material without handing them play.' } : null,
      punish: replySan ? { san: replySan, why: first(r.reply?.explanation) } : null,
    };
  }

  if (kind === 'best' || kind === 'excellent' || kind === 'forced') {
    if (first(r.played)) parts.push(first(r.played));
  } else if (kind === 'good') {
    if (first(r.played)) parts.push(first(r.played));
    if (bestSan) parts.push(`${bestSan} was a little more precise.`);
  }

  if (r.bestMate > 0 && !(r.playedMate > 0)) {
    parts.push(`You had checkmate in ${r.bestMate} starting with ${bestSan}.`);
  } else if (r.playedMate < 0 && !(r.bestMate < 0)) {
    parts.push('This allows a forced checkmate against you.');
  }

  return {
    text: parts.join(' '),
    idea: bad ? first(r.played) : '',
    better: bad && bestSan ? { san: bestSan, why: first(r.bestExplanation) } : null,
    punish: bad && replySan ? { san: replySan, why: first(r.reply?.explanation) } : null,
  };
}
