/* Clock options for friend games: minutes each player starts with, plus seconds added after each move. */
export const SPEEDS = {
  blitz: { name: 'Blitz', icon: 'bolt', feel: 'Fast and exciting — quick decisions.' },
  rapid: { name: 'Rapid', icon: 'clock', feel: 'Time to think, but keep moving.' },
  classical: { name: 'Classical', icon: 'mind', feel: 'Slow and thoughtful — plan every move.' },
  casual: { name: 'Casual', icon: 'seedling', feel: 'No time pressure at all.' },
};

export const TIME_CONTROLS = [
  { label: '3 + 2', minutes: 3, increment: 2, speed: 'blitz' },
  { label: '5 + 0', minutes: 5, increment: 0, speed: 'blitz' },
  { label: '10 + 0', minutes: 10, increment: 0, speed: 'rapid' },
  { label: '15 + 10', minutes: 15, increment: 10, speed: 'rapid' },
  { label: '30 + 0', minutes: 30, increment: 0, speed: 'classical' },
  { label: 'No clock', minutes: 0, increment: 0, speed: 'casual' },
];

export const DEFAULT_TIME_CONTROL = 2;

const AVERAGE_MOVES = 40;

/* Rough upper bound on game length in minutes, assuming each player makes about 40 moves. */
export function gameLength({ minutes, increment }) {
  if (!minutes) return null;
  const total = 2 * (minutes + (AVERAGE_MOVES * increment) / 60);
  return Math.round(total / 5) * 5 || total;
}

/* Plain-language sentences describing how a clock option plays. */
export function explainTimeControl(t) {
  if (!t.minutes) {
    return ['There is no clock, so take as long as you like on every move.', 'Good for learning, chatting or playing over a long break.'];
  }
  const lines = [`You each get ${t.minutes} minutes for the whole game. Your clock only runs on your turn, and if it reaches zero you lose.`];
  lines.push(t.increment
    ? `The +${t.increment} means ${t.increment} seconds are added to your clock after every move you make, so you never get completely stuck.`
    : 'The +0 means no time is added after moves, so spread your time across the whole game.');
  return lines;
}
