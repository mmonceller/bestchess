import { db } from '../../db/store.js';
import { balancesFor } from '../pointLog/balances.js';

/* One row per account. The point figures come from the same read the history log uses. */
export function userRoster() {
  return db.users.map((user) => {
    const balances = balancesFor(user.id);
    const stats = user.stats || {};
    return {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt,
      onlineRating: balances.online,
      wins: stats.wins || 0,
      losses: stats.losses || 0,
      draws: stats.draws || 0,
      skill: balances.skill,
      skillTier: balances.skillTier,
      goalPoints: balances.goal,
      progressPoints: balances.progress,
      trainingPoints: balances.training,
      level: balances.level,
      puzzleRating: balances.puzzleRating,
      puzzlesSolved: balances.puzzles,
      lessonsDone: balances.lessons,
      stars: balances.stars,
    };
  }).sort((a, b) => a.username.localeCompare(b.username, undefined, { sensitivity: 'base' }));
}
