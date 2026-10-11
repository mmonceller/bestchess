export const MAX_ONLINE_GAMES = 10;

export const isOngoing = (g) => g.status === 'waiting' || g.status === 'playing';
