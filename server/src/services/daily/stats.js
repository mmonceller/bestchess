import { db } from '../../db/store.js';
import { LEVELS } from '../../../../client/src/engine/levels.js';
import { LESSONS, TRACKS } from '../../../../client/src/training/lessons/index.js';
import { PATTERNS } from '../../../../client/src/training/patterns/patterns.js';
import { LEVEL_RATING } from '../skill/levelStrength.js';

const CLOSED = new Set(TRACKS.filter((track) => track.gated || track.supplement).map((track) => track.id));
const OPEN_TRACKS = TRACKS.filter((track) => !CLOSED.has(track.id));
const OPEN_LESSONS = LESSONS.filter((lesson) => !CLOSED.has(lesson.track));

export const BOTS = Object.fromEntries(LEVELS.map((level) => [level.id, level.name]));

export function botName(level) {
  return BOTS[level] || 'a bot';
}

/* Bot level whose strength is closest to a skill rating. A tie keeps the earlier level. */
export function recommendedLevelId(rating) {
  if (!rating) return null;
  return Object.keys(LEVEL_RATING)
    .map(Number)
    .reduce((best, id) => (Math.abs(LEVEL_RATING[id] - rating) < Math.abs(LEVEL_RATING[best] - rating) ? id : best));
}

export function woodpeckerCounts(woodpecker) {
  let tried = 0;
  let solved = 0;
  for (const run of Object.values(woodpecker || {})) {
    tried += run.index || 0;
    solved += run.solved || 0;
    for (const cycle of run.history || []) {
      tried += cycle.total || 0;
      solved += cycle.solved || 0;
    }
  }
  return { tried, solved };
}

export function lessonsDone(userId) {
  const mine = db.progress[userId] || {};
  return OPEN_LESSONS.filter((lesson) => mine[lesson.id]).length;
}

export function lessonsRemaining(userId) {
  const mine = db.progress[userId] || {};
  return OPEN_LESSONS.filter((lesson) => !mine[lesson.id]).length;
}

export function nextWorldName(userId) {
  const mine = db.progress[userId] || {};
  for (const track of OPEN_TRACKS) {
    const lessons = OPEN_LESSONS.filter((lesson) => lesson.track === track.id);
    if (lessons.some((lesson) => !mine[lesson.id])) return track.name;
  }
  return null;
}

export function patternSeen(userId) {
  const patterns = db.trainer[userId]?.patterns || {};
  const out = {};
  for (const [id, stats] of Object.entries(patterns)) out[id] = stats?.seen || 0;
  return out;
}

export function patternName(id) {
  return PATTERNS[id]?.name || null;
}

export function patternUnlocked(id, rating) {
  const pattern = PATTERNS[id];
  return Boolean(pattern) && (pattern.unlock || 0) <= (rating || 0);
}
