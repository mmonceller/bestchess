import { CORE_LESSONS } from '../index.js';
import { WOODPECKER_SETS } from '../../woodpecker/sets.js';
import { TUNE_UP_ID } from './shell.js';

const runFor = (trainer, setId) => trainer?.woodpecker?.[setId] || { index: 0, solved: 0, history: [] };

/* "Mostly misses": under half of the attempts are solved, with enough tries to mean it. */
export const FAIL_RATE = 0.5;
const MIN_PATTERN = 10;
const MIN_WOODPECKER = 8;

export const lessonsDone = (progress) => CORE_LESSONS.every((l) => progress?.[l.id]);

export function patternAccuracy(trainer) {
  const tried = trainer?.games || 0;
  const solved = trainer?.solved || 0;
  return { tried, solved, rate: tried ? solved / tried : 1 };
}

export function woodpeckerAccuracy(trainer) {
  let tried = 0;
  let solved = 0;
  for (const set of WOODPECKER_SETS) {
    const run = runFor(trainer, set.id);
    tried += run.index;
    solved += run.solved;
    for (const cycle of run.history || []) {
      tried += cycle.total || 0;
      solved += cycle.solved || 0;
    }
  }
  return { tried, solved, rate: tried ? solved / tried : 1 };
}

/* Finished the course, and both the Pattern Trainer and Woodpecker Mode are still mostly misses. */
export function needsTuneUp(progress, trainer) {
  if (!trainer || !lessonsDone(progress)) return false;
  const puzzles = patternAccuracy(trainer);
  const wood = woodpeckerAccuracy(trainer);
  return puzzles.tried >= MIN_PATTERN && puzzles.rate < FAIL_RATE
    && wood.tried >= MIN_WOODPECKER && wood.rate < FAIL_RATE;
}

/* Keep the world available after they start it, so a later improvement doesn't hide the review. */
export function showTuneUp(progress, trainer) {
  return needsTuneUp(progress, trainer) || Boolean(progress?.[TUNE_UP_ID]);
}
