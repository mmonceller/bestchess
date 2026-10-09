import { useLayoutEffect, useRef, useState } from 'react';
import { diffPieces } from './diffPieces.js';

const CLEAR_AFTER_MS = 450;

const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/*
 * Animates the board whenever the position changes: pieces slide from their old square,
 * captured pieces fade out, restored ones fade in. `dropped` holds the last drag-and-drop
 * move ({ from, to }); that piece is already where the player let go, so it doesn't slide.
 */
export function useMoveAnimation(pieces, flipped, dropped) {
  const prev = useRef(null);
  const count = useRef(0);
  const [anim, setAnim] = useState(null);

  useLayoutEffect(() => {
    const before = prev.current;
    prev.current = pieces;
    const drop = dropped.current;
    dropped.current = null;
    if (!before || before === pieces || reducedMotion()) { setAnim(null); return undefined; }

    const diff = diffPieces(before, pieces, flipped);
    if (!diff) { setAnim(null); return undefined; }
    if (drop && diff.slides[drop.to]?.from === drop.from) delete diff.slides[drop.to];
    count.current += 1;
    setAnim({ ...diff, id: count.current });
    const timer = setTimeout(() => setAnim(null), CLEAR_AFTER_MS);
    return () => clearTimeout(timer);
  }, [pieces]); // eslint-disable-line react-hooks/exhaustive-deps

  return anim;
}
