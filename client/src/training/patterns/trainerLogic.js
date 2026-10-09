import { PATTERNS, PATTERN_IDS } from './patterns.js';
import { PUZZLES } from './puzzles.js';
import { touchDay } from '../trainerStore.js';

/* Adaptive puzzle selection and Elo-style rating for the pattern trainer. */
export const unlockedPatterns = (rating) => PATTERN_IDS.filter((id) => PATTERNS[id].unlock <= rating);

const solveRate = (trainer, pattern) => {
  const s = trainer.patterns?.[pattern];
  return s?.seen ? s.solved / s.seen : 0.5;
};

/*
 * Picks a puzzle near the player's rating, favoring patterns they solve least often
 * and skipping ones seen recently. `focus` restricts to a single pattern.
 */
export function pickPuzzle(trainer, focus = null) {
  const rating = trainer.rating;
  const unlocked = new Set(unlockedPatterns(rating));
  let pool = PUZZLES.filter((p) => (focus ? p.pattern === focus : unlocked.has(p.pattern)));
  const fresh = pool.filter((p) => !trainer.recent?.includes(p.id));
  if (fresh.length) pool = fresh;
  const weights = pool.map((p) => Math.exp(-Math.abs(p.rating - rating) / 220) * (1.6 - solveRate(trainer, p.pattern)));
  let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < pool.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return pool[i];
  }
  return pool[pool.length - 1];
}

/* score: 1 = solved cleanly, 0.6 = solved with a hint, 0 = failed. */
export function ratingDelta(trainer, puzzle, score) {
  const k = trainer.games < 15 ? 44 : 24;
  const expected = 1 / (1 + 10 ** ((puzzle.rating - trainer.rating) / 400));
  return Math.round(k * (score - expected));
}

export function applyResult(trainer, puzzle, { solved, usedHint }) {
  const score = solved ? (usedHint ? 0.6 : 1) : 0;
  const delta = ratingDelta(trainer, puzzle, score);
  const streak = solved ? trainer.streak + 1 : 0;
  const xp = solved ? 10 + (usedHint ? 0 : 5) + Math.min(10, trainer.streak * 2) : 2;
  const stats = trainer.patterns?.[puzzle.pattern] || { seen: 0, solved: 0 };
  const next = touchDay({
    ...trainer,
    rating: Math.max(100, trainer.rating + delta),
    games: trainer.games + 1,
    xp: trainer.xp + xp,
    solved: trainer.solved + (solved ? 1 : 0),
    streak,
    bestStreak: Math.max(trainer.bestStreak, streak),
    patterns: { ...trainer.patterns, [puzzle.pattern]: { seen: stats.seen + 1, solved: stats.solved + (solved ? 1 : 0) } },
    recent: [...(trainer.recent || []).filter((id) => id !== puzzle.id), puzzle.id].slice(-12),
  });
  const newlyUnlocked = unlockedPatterns(next.rating).filter((id) => !unlockedPatterns(trainer.rating).includes(id));
  return { trainer: next, delta, xp, newlyUnlocked };
}
