import { touchDay } from '../trainerStore.js';

/*
 * Woodpecker cycles: solve the whole set in order, then solve it again, faster each time.
 * One run per set lives in trainer.woodpecker[setId]:
 *   { cycle, index, solved, ms, missed: [exercise numbers], history: [{ cycle, solved, total, ms, day }] }
 */
const MAX_PUZZLE_MS = 10 * 60_000;

export const newRun = () => ({ cycle: 1, index: 0, solved: 0, ms: 0, missed: [], history: [] });

export const runFor = (trainer, setId) => trainer?.woodpecker?.[setId] || newRun();

const today = () => new Date().toISOString().slice(0, 10);

/* Records one attempt; when it was the last puzzle in the set the cycle is closed. */
export function recordAttempt(run, { n, solved, ms }, total) {
  const next = {
    ...run,
    index: run.index + 1,
    solved: run.solved + (solved ? 1 : 0),
    ms: run.ms + Math.min(MAX_PUZZLE_MS, Math.max(0, Math.round(ms))),
    missed: solved ? run.missed : [...run.missed, n],
  };
  if (next.index < total) return { run: next, finished: null };
  const finished = { cycle: run.cycle, solved: next.solved, total, ms: next.ms, day: today() };
  return {
    run: { cycle: run.cycle + 1, index: 0, solved: 0, ms: 0, missed: [], history: [...run.history, finished].slice(-50) },
    finished,
  };
}

export const xpFor = (solved) => (solved ? 6 : 1);

export function applyAttempt(trainer, setId, attempt, total) {
  const { run, finished } = recordAttempt(runFor(trainer, setId), attempt, total);
  const xp = xpFor(attempt.solved);
  const next = touchDay({
    ...trainer,
    xp: trainer.xp + xp,
    woodpecker: { ...(trainer.woodpecker || {}), [setId]: run },
  });
  return { trainer: next, xp, finished };
}

export const restartCycle = (trainer, setId) => {
  const run = runFor(trainer, setId);
  return { ...trainer, woodpecker: { ...(trainer.woodpecker || {}), [setId]: { ...newRun(), cycle: run.cycle, history: run.history } } };
};

/* The time to beat this cycle: half of the previous one (the method's rhythm). */
export const targetMs = (run) => {
  const last = run.history[run.history.length - 1];
  return last ? Math.round(last.ms / 2) : null;
};

export const accuracy = (solved, total) => (total ? Math.round((solved / total) * 100) : 0);

export function formatDuration(ms) {
  const s = Math.round(ms / 1000);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h) return `${h}h ${String(m).padStart(2, '0')}m`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}
