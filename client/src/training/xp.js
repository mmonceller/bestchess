/* Experience points and player levels shared by lessons and the pattern trainer. */
export const lessonXp = (stars) => (stars ? 20 + stars * 10 : 0);
export const bonusXp = (stars) => (stars ? 10 + stars * 5 : 0);

export const totalXp = (progress, trainer) =>
  Object.values(progress || {}).reduce((n, p) => n + lessonXp(p.stars || 0) + bonusXp(p.bonusStars || 0), 0) + (trainer?.xp || 0);

const xpForLevel = (n) => 50 * n * (n - 1);

const TITLES = ['Newcomer', 'Pawn', 'Apprentice', 'Knight', 'Bishop', 'Rook', 'Queen', 'King', 'Grandmaster'];

export function levelInfo(xp) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const base = xpForLevel(level);
  const span = xpForLevel(level + 1) - base;
  return {
    level,
    title: TITLES[Math.min(TITLES.length - 1, Math.floor((level - 1) / 2))],
    into: xp - base,
    span,
    pct: Math.round(((xp - base) / span) * 100),
  };
}
