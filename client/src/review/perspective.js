/*
 * Coach comments are written to the person who made the move ("you"). When the player reads
 * about their opponent's moves, this turns them around: "your opponent" becomes "you",
 * and "you" / "your" become "they" / "their".
 */
const OPP_POSS = '\u0001';
const OPP = '\u0002';

const SWAPS = [
  [/\byour opponent's\b/gi, OPP_POSS],
  [/\byour opponent\b/gi, OPP],
  [/\byou're\b/gi, "they're"],
  [/\byou've\b/gi, "they've"],
  [/\byou are\b/gi, 'they are'],
  [/\byou were\b/gi, 'they were'],
  [/\b(against|for|to|at|with) you\b/gi, '$1 them'],
  [/\byourself\b/gi, 'themselves'],
  [/\byours\b/gi, 'theirs'],
  [/\byour\b/gi, 'their'],
  [/\byou\b/gi, 'they'],
];

const keepCase = (from, to) => (from[0] === from[0].toUpperCase() && from[0] !== from[0].toLowerCase()
  ? to[0].toUpperCase() + to.slice(1)
  : to);

export function aboutOpponent(text) {
  if (!text) return text;
  let out = text;
  for (const [re, to] of SWAPS) {
    out = out.replace(re, (m, g1) => (to.includes('$1') ? to.replace('$1', g1) : keepCase(m, to)));
  }
  return out
    .replaceAll(OPP_POSS, 'your')
    .replaceAll(OPP, 'you')
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, start, ch) => start + ch.toUpperCase());
}
