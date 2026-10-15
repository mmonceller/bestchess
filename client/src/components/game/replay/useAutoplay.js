import { useCallback, useEffect, useState } from 'react';

/* How long each move stays on the board while a game is playing through. */
const STEP_MS = 1500;

/*
 * Plays a recorded game from the current ply to the end, one move at a time.
 * Waits until the board has finished sliding to that ply before starting the next.
 * At the last move, play starts again from the position before move one.
 */
export function useAutoplay({ ply, last, shown, setPly, jump }) {
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    if (!playing) return undefined;
    if (shown !== ply) return undefined;
    if (ply >= last) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setPly((p) => Math.min(last, p + 1)), STEP_MS);
    return () => clearTimeout(timer);
  }, [playing, ply, shown, last, setPly]);

  const pause = useCallback(() => setPlaying(false), []);

  const togglePlay = useCallback(() => {
    if (last < 0) return;
    if (ply >= last) {
      jump(-1);
      setPly(-1);
      setPlaying(true);
      return;
    }
    setPlaying((on) => !on);
  }, [ply, last, jump, setPly]);

  return { playing, pause, togglePlay, atEnd: ply >= last && last >= 0 };
}
