import { PATTERNS, PATTERN_IDS } from './patterns.js';
import { PUZZLES, baseOf } from './puzzles/index.js';
import { touchDay } from '../trainerStore.js';

/* Adaptive puzzle selection and Elo-style rating for the pattern trainer. */
export const unlockedPatterns = (rating) => PATTERN_IDS.filter((id) => PATTERNS[id].unlock <= rating);

const solveRate = (trainer, pattern) => {
  const s = trainer.patterns?.[pattern];
  return s?.seen ? s.solved / s.seen : 0.5;
};

export const RECENT_LIMIT = 60;
/* Share of the available puzzle ideas that must be shown before one comes back. */
const MEMORY_SHARE = 0.7;
const PATTERN_OF = new Map(PUZZLES.map((p) => [p.id, p.pattern]));
const randomItem = (list) => list[Math.floor(Math.random() * list.length)];

function weightedPick(items, weight) {
  const weights = items.map(weight);
  let roll = Math.random() * weights.reduce((a, b) => a + b, 0);
  for (let i = 0; i < items.length; i++) {
    roll -= weights[i];
    if (roll <= 0) return items[i];
  }
  return items[items.length - 1];
}

/*
 * Picks a puzzle near the player's rating, favoring patterns they solve least often.
 * An idea (a puzzle and its mirrored, colour-swapped or shifted versions) doesn't come back
 * until most other ideas have been shown, the same pattern never comes three times in a row,
 * and a returning idea is shown in a version the player hasn't seen recently.
 * `focus` restricts to a single pattern.
 */
export function pickPuzzle(trainer, focus = null) {
  const rating = trainer.rating;
  const unlocked = new Set(unlockedPatterns(rating));
  const recent = trainer.recent || [];
  const groups = new Map();
  for (const p of PUZZLES) {
    if (focus ? p.pattern !== focus : !unlocked.has(p.pattern)) continue;
    const b = baseOf(p.id);
    if (!groups.has(b)) groups.set(b, []);
    groups.get(b).push(p);
  }
  const ideas = [...groups.keys()];
  const recentIdeas = recent.map(baseOf);
  const blocked = new Set(recentIdeas.slice(-Math.max(1, Math.floor(ideas.length * MEMORY_SHARE))));
  let choices = ideas.filter((b) => !blocked.has(b));
  if (!choices.length) choices = ideas.filter((b) => b !== recentIdeas.at(-1));
  if (!choices.length) choices = ideas;

  const [a, b] = recent.slice(-2).map((id) => PATTERN_OF.get(id));
  if (!focus && a && a === b) {
    const other = choices.filter((idea) => groups.get(idea)[0].pattern !== a);
    if (other.length) choices = other;
  }

  const idea = weightedPick(choices, (id) => {
    const p = groups.get(id)[0];
    return Math.exp(-Math.abs(p.rating - rating) / 220) * (1.6 - solveRate(trainer, p.pattern));
  });
  const versions = groups.get(idea);
  const unseen = versions.filter((v) => !recent.includes(v.id));
  return randomItem(unseen.length ? unseen : versions);
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
    recent: [...(trainer.recent || []).filter((id) => id !== puzzle.id), puzzle.id].slice(-RECENT_LIMIT),
  });
  const newlyUnlocked = unlockedPatterns(next.rating).filter((id) => !unlockedPatterns(trainer.rating).includes(id));
  return { trainer: next, delta, xp, newlyUnlocked };
}
