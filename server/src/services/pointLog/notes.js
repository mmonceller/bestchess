import { getLesson } from '../../../../client/src/training/lessons/index.js';
import { POINT_LABELS } from './kinds.js';

export const lessonTitle = (id) => getLesson(id)?.title || 'a lesson';

function count(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

/* A finished game moved skill points or the online rating. */
export function gameNote(kind, { result, opponent, before, after, delta }) {
  const word = result === 'win' ? 'win' : result === 'loss' ? 'loss' : 'draw';
  const who = opponent || 'an opponent';
  if (before == null) return `A game ${word} against ${who} set ${POINT_LABELS[kind].toLowerCase()} at ${after}.`;
  const n = Math.abs(delta);
  const verb = delta > 0 ? 'added' : 'deducted';
  if (kind === 'online') return `A game ${word} against ${who} ${verb} ${n} from the online rating.`;
  return `A game ${word} against ${who} ${verb} ${count(n, 'skill point', 'skill points')}.`;
}

export function goalEarnNote(title, points) {
  return `${title}. Added ${count(points, 'goal point', 'goal points')}.`;
}

export function goalEditNote(delta) {
  const n = Math.abs(delta);
  const verb = delta > 0 ? 'added' : 'deducted';
  return `The admin page ${verb} ${count(n, 'goal point', 'goal points')}.`;
}

export function newAccountNote(rating) {
  return `New account. Online rating starts at ${rating}.`;
}

/* Lesson stars, lesson count, and lesson XP changed together or on their own. */
export function lessonNote(kind, delta, { title, bonusOnly, starsAfter }) {
  const n = Math.abs(delta);
  const verb = delta > 0 ? 'Added' : 'Deducted';
  if (!title) {
    if (kind === 'lessons') return `${verb} ${count(n, 'lesson', 'lessons')} done.`;
    if (kind === 'stars') return `${verb} ${count(n, 'training star', 'training stars')}.`;
    return `${verb} ${count(n, 'progress point', 'progress points')}.`;
  }
  if (kind === 'lessons') return `Finished "${title}". Added ${count(n, 'lesson', 'lessons')} done.`;
  if (kind === 'stars') {
    return bonusOnly
      ? `Bonus on "${title}" ${delta > 0 ? 'added' : 'deducted'} ${count(n, 'training star', 'training stars')}.`
      : `Finished "${title}" with ${starsAfter} stars. ${verb} ${count(n, 'training star', 'training stars')}.`;
  }
  const where = bonusOnly ? `the bonus on "${title}"` : `"${title}"`;
  return `${verb} ${count(n, 'progress point', 'progress points')} from ${where}.`;
}

export function trainerNote(kind, delta, before) {
  const n = Math.abs(delta);
  const verb = delta > 0 ? 'Added' : 'Deducted';
  if (kind === 'puzzles') return `${verb} ${count(n, 'puzzle solved', 'puzzles solved')}.`;
  if (kind === 'training') return `${verb} ${count(n, 'training point', 'training points')}.`;
  if (before == null) return `Puzzle rating is now ${n}.`;
  return `${verb} ${n} puzzle rating ${n === 1 ? 'point' : 'points'}.`;
}
