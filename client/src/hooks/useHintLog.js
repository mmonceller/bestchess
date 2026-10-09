import { useCallback, useRef, useState } from 'react';

/* Remembers on which plies the player asked for a hint, so the saved game can report it. */
export function useHintLog(initial = []) {
  const ref = useRef(new Set(initial));
  const [count, setCount] = useState(ref.current.size);

  const note = useCallback((ply) => {
    ref.current.add(ply);
    setCount(ref.current.size);
  }, []);

  const plies = useCallback((moves) => [...ref.current].filter((p) => moves == null || p < moves).sort((a, b) => a - b), []);

  return { count, note, plies };
}
