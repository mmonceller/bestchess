import { useCallback, useEffect, useMemo, useState } from 'react';
import { replayPositions } from './positions.js';
import { useSteppedPly } from './useSteppedPly.js';

/*
 * Looking back through a live game. `select(ply)` shows an earlier position (the board walks
 * there move by move); selecting the latest move, or `backToGame()`, returns to the live board.
 * While `browsing`, the page should show `fen` / `lastMove` / `check` and block moves.
 */
export function useHistoryView(sans) {
  const key = sans.join(' ');
  const positions = useMemo(() => replayPositions(sans), [key]); // eslint-disable-line react-hooks/exhaustive-deps
  const last = positions.moves.length - 1;
  const [target, setTarget] = useState(null);
  const goal = target === null ? last : Math.min(target, last);
  const { shown, moveMs } = useSteppedPly(goal, { instant: target === null });

  useEffect(() => {
    if (target !== null && target >= last && shown >= last) setTarget(null);
  }, [target, shown, last]);

  const select = useCallback((ply) => setTarget(ply), []);
  const backToGame = useCallback(() => setTarget(last), [last]);
  const at = Math.min(shown, last);

  return {
    browsing: target !== null,
    goal,
    moveMs,
    fen: positions.fens[at + 1],
    lastMove: positions.moves[at] || null,
    check: positions.checks[at + 1],
    select,
    backToGame,
  };
}
