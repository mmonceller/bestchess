import { useEffect, useState } from 'react';
import { formatDuration } from '../../../training/woodpecker/cycles.js';

/* Cycle time so far: the saved total plus the exercise on the board (when `from` is set). */
export default function CycleClock({ baseMs, from }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    if (!from) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [from]);
  const live = from ? Math.min(10 * 60_000, Math.max(0, now - from)) : 0;
  return <b>{formatDuration(baseMs + live)}</b>;
}
