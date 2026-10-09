/*
 * Difficulty ladder. Weak levels search every root move at shallow depth and pick
 * among near-best moves with noise; occasional "blunders" mimic human beginners.
 */
export const LEVELS = [
  { id: 1, name: 'Pawn Pusher', elo: '~400', icon: 'pawn', tint: '#3ccf7a', depth: 1, timeMs: 250, noise: 260, blunder: 0.22 },
  { id: 2, name: 'Rookie', elo: '~700', icon: 'knight', tint: '#4fd1c5', depth: 2, timeMs: 350, noise: 150, blunder: 0.1 },
  { id: 3, name: 'Casual', elo: '~1000', icon: 'bishop', tint: '#3d8bd9', depth: 3, timeMs: 500, noise: 80, blunder: 0.04 },
  { id: 4, name: 'Club Player', elo: '~1300', icon: 'rook', tint: '#7c5cff', depth: 4, timeMs: 700, noise: 35, blunder: 0.01 },
  { id: 5, name: 'Tournament', elo: '~1600', icon: 'queen', tint: '#9b6ce6', depth: 7, timeMs: 900, noise: 0, blunder: 0 },
  { id: 6, name: 'Expert', elo: '~1900', icon: 'king', tint: '#f08a3e', depth: 64, timeMs: 1800, noise: 0, blunder: 0 },
  { id: 7, name: 'Master', elo: '~2100+', icon: 'crown', tint: '#e5534b', depth: 64, timeMs: 3500, noise: 0, blunder: 0 },
];

export const getLevel = (id) => LEVELS.find((l) => l.id === id) || LEVELS[2];
