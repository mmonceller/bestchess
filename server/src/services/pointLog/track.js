import { db, save } from '../../db/store.js';
import { balancesFor } from './balances.js';
import { gameNote, goalEarnNote, goalEditNote, lessonNote, lessonTitle, newAccountNote, trainerNote } from './notes.js';
import { appendPointRow, changeAmount, logChange } from './write.js';

const LESSON_KINDS = ['lessons', 'stars', 'progress'];
const TRAINER_KINDS = ['puzzles', 'training', 'puzzleRating'];

export function logGamePoints(userId, kind, before, after, game) {
  const delta = changeAmount(before, after);
  if (delta == null || delta === 0) return;
  logChange(userId, kind, before, after, gameNote(kind, { ...game, before, after, delta }));
}

export function logGoalEarn(userId, before, after, title, points) {
  logChange(userId, 'goal', before, after, goalEarnNote(title, points));
}

export function logGoalEdit(userId, before, after) {
  const delta = changeAmount(before, after);
  if (delta == null || delta === 0) return;
  logChange(userId, 'goal', before, after, goalEditNote(delta));
}

export function logNewAccount(userId, rating) {
  appendPointRow({
    userId,
    kind: 'online',
    delta: rating,
    balance: rating,
    note: newAccountNote(rating),
  });
  save();
}

function changedLesson(before, after) {
  const ids = new Set([...Object.keys(before.lessonRows), ...Object.keys(after.lessonRows)]);
  const changed = [...ids].filter((id) => JSON.stringify(before.lessonRows[id]) !== JSON.stringify(after.lessonRows[id]));
  if (changed.length !== 1) return { title: null, bonusOnly: false, starsAfter: null };
  const id = changed[0];
  const prev = before.lessonRows[id] || { stars: 0, bonusStars: 0 };
  const next = after.lessonRows[id] || { stars: 0, bonusStars: 0 };
  return {
    title: lessonTitle(id),
    bonusOnly: prev.stars === next.stars && prev.bonusStars !== next.bonusStars,
    starsAfter: next.stars,
  };
}

/* Wraps a lesson save and writes a row for each number that moved. */
export function trackLessonProgress(userId, mutate) {
  const before = balancesFor(userId);
  mutate();
  const after = balancesFor(userId);
  const context = changedLesson(before, after);
  for (const kind of LESSON_KINDS) {
    const delta = changeAmount(before[kind], after[kind]);
    if (delta == null || delta === 0) continue;
    logChange(userId, kind, before[kind], after[kind], lessonNote(kind, delta, context));
  }
}

/* Wraps a Pattern Trainer save. */
export function trackTrainer(userId, trainer) {
  const before = balancesFor(userId);
  db.trainer[userId] = trainer;
  const after = balancesFor(userId);
  for (const kind of TRAINER_KINDS) {
    const delta = changeAmount(before[kind], after[kind]);
    if (delta == null || delta === 0) continue;
    logChange(userId, kind, before[kind], after[kind], trainerNote(kind, delta, before[kind]));
  }
  save();
}
