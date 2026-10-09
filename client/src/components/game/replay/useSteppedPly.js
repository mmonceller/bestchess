import { useCallback, useEffect, useRef, useState } from 'react';

/* Jumps longer than this skip the walk-through; the board slides everything at once instead. */
const MAX_STEPS = 12;
/* A walk-through takes about this long in total, each step between the two limits. */
const SPAN_MS = 900;
const STEP_MIN_MS = 90;
const STEP_MAX_MS = 240;

const stepFor = (gap) => Math.round(Math.min(STEP_MAX_MS, Math.max(STEP_MIN_MS, SPAN_MS / gap)));

/*
 * The ply the board should show while it travels to `target` one move at a time, so jumping
 * to a move in the list plays the moves in between. `moveMs` is the current step length,
 * for the board's slide animation. `jump(ply)` moves there instantly (e.g. on first load);
 * with `instant` the shown ply simply follows the target.
 */
export function useSteppedPly(target, { instant = false } = {}) {
  const [shown, setShown] = useState(target);
  const [moveMs, setMoveMs] = useState(STEP_MAX_MS);
  const lastStep = useRef(0);

  useEffect(() => {
    if (shown === target) return undefined;
    const gap = Math.abs(target - shown);
    if (instant || gap > MAX_STEPS) {
      setMoveMs(STEP_MAX_MS);
      setShown(target);
      return undefined;
    }
    const interval = stepFor(gap);
    const wait = Math.max(0, interval - (Date.now() - lastStep.current));
    const timer = setTimeout(() => {
      lastStep.current = Date.now();
      setMoveMs(interval);
      setShown((s) => s + Math.sign(target - s));
    }, wait);
    return () => clearTimeout(timer);
  }, [shown, target, instant]);

  const jump = useCallback((ply) => setShown(ply), []);
  return { shown, moveMs, jump };
}
