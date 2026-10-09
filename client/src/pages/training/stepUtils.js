export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

export function orientationFor(step) {
  if (step.orientation) return step.orientation;
  return step.fen?.split(' ')[1] === 'b' ? 'black' : 'white';
}

export const toArrows = (pairs, color = 'orange') => (pairs || []).map(([from, to]) => ({ from, to, color }));

export const toHighlights = (squares, kind = 'focus') => Object.fromEntries((squares || []).map((s) => [s, kind]));

let fbId = 0;
export const fb = (tone, text) => ({ tone, text, id: ++fbId });

export function starsFor(mistakes, hints) {
  const penalty = mistakes + hints * 0.5;
  if (penalty <= 0.5) return 3;
  if (penalty <= 2.5) return 2;
  return 1;
}
