import { db, findUserById } from '../../db/store.js';
import { skillFor } from '../skill/skillRating.js';
import { lessonsDone } from '../daily/stats.js';
import { bonusXp, lessonXp, levelInfo } from '../../../../client/src/training/xp.js';

export function progressPoints(progress) {
  return Object.values(progress || {}).reduce((sum, row) => sum + lessonXp(row?.stars || 0) + bonusXp(row?.bonusStars || 0), 0);
}

export function starsOf(progress) {
  return Object.values(progress || {}).reduce((sum, row) => sum + (row?.stars || 0), 0);
}

/* The same figures the admin page shows. Skill and puzzle rating stay null until they exist. */
export function balancesFor(userId) {
  const user = findUserById(userId);
  const progress = db.progress[userId] || {};
  const trainer = db.trainer[userId] || null;
  const skill = skillFor(userId);
  const lessons = progressPoints(progress);
  const training = trainer?.xp || 0;
  return {
    skill: skill.rating,
    skillTier: skill.tier,
    online: user?.rating ?? 0,
    stars: starsOf(progress),
    goal: Math.max(0, Number(db.daily?.[userId]?.points) || 0),
    puzzles: trainer?.solved || 0,
    lessons: lessonsDone(userId),
    progress: lessons,
    training,
    puzzleRating: trainer ? trainer.rating || 0 : null,
    level: levelInfo(lessons + training).level,
    lessonRows: Object.fromEntries(Object.entries(progress).map(([id, row]) => [id, {
      stars: row?.stars || 0,
      bonusStars: row?.bonusStars || 0,
    }])),
  };
}
