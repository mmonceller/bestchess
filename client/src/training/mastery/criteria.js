import { CORE_LESSONS, lessonsInTrack } from '../lessons/index.js';
import { LEVELS } from '../../engine/levels.js';

/*
 * Master Class appears once every core lesson is finished, and unlocks when the
 * pattern trainer and real game results both show the player is very strong.
 */
export const MASTERY = {
  puzzleRating: 1150,
  puzzlesSolved: 30,
  strongWins: 3,
  strongLevel: 4,
};

const strongBot = LEVELS.find((l) => l.id === MASTERY.strongLevel);

export function countStrongWins(games) {
  return (games || []).filter((g) => g.result === 'win'
    && (g.mode === 'online' || (g.mode === 'computer' && Number(g.level) >= MASTERY.strongLevel))).length;
}

export function evaluateMastery({ progress, trainer, games }) {
  const checks = [
    {
      id: 'lessons',
      icon: 'book',
      label: 'Finish every lesson in the other worlds',
      current: CORE_LESSONS.filter((l) => progress[l.id]).length,
      target: CORE_LESSONS.length,
    },
    {
      id: 'rating',
      icon: 'puzzle',
      label: `Reach a Pattern Trainer rating of ${MASTERY.puzzleRating}`,
      current: trainer?.rating || 0,
      target: MASTERY.puzzleRating,
    },
    {
      id: 'solved',
      icon: 'target',
      label: `Solve ${MASTERY.puzzlesSolved} pattern puzzles`,
      current: trainer?.solved || 0,
      target: MASTERY.puzzlesSolved,
    },
    {
      id: 'wins',
      icon: 'trophy',
      label: `Win ${MASTERY.strongWins} games against the ${strongBot?.name || 'Club Player'} bot or stronger, or against real opponents online`,
      current: countStrongWins(games),
      target: MASTERY.strongWins,
    },
  ].map((c) => ({ ...c, done: c.current >= c.target }));

  const started = lessonsInTrack('master').some((l) => progress[l.id]);
  const unlocked = started || checks.every((c) => c.done);
  return { checks, unlocked, visible: unlocked || checks[0].done };
}
