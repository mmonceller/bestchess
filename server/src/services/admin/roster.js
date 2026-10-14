import { db } from '../../db/store.js';
import { skillFor } from '../skill/skillRating.js';
import { lessonsDone } from '../daily/stats.js';
import { bonusXp, lessonXp, levelInfo } from '../../../../client/src/training/xp.js';

function progressPoints(progress) {
  return Object.values(progress || {}).reduce((sum, row) => sum + lessonXp(row?.stars || 0) + bonusXp(row?.bonusStars || 0), 0);
}

function starsOf(progress) {
  return Object.values(progress || {}).reduce((sum, row) => sum + (row?.stars || 0), 0);
}

/* One row per account: lesson XP, skill rating, goal points, and pattern-trainer XP. */
export function userRoster() {
  return db.users.map((user) => {
    const progress = db.progress[user.id] || {};
    const trainer = db.trainer[user.id] || null;
    const skill = skillFor(user.id);
    const lessons = progressPoints(progress);
    const training = trainer?.xp || 0;
    const stats = user.stats || {};
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      onlineRating: user.rating,
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      draws: stats.draws || 0,
      skill: skill.rating,
      skillTier: skill.tier,
      goalPoints: Math.max(0, Number(db.daily?.[user.id]?.points) || 0),
      progressPoints: lessons,
      trainingPoints: training,
      level: levelInfo(lessons + training).level,
      puzzleRating: trainer ? trainer.rating || 0 : null,
      puzzlesSolved: trainer?.solved || 0,
      lessonsDone: lessonsDone(user.id),
      stars: starsOf(progress),
    };
  }).sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: 'base' }));
}
