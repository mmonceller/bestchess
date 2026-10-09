import { useCallback, useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { engine } from '../engine/engineClient.js';
import { uciLineToSan } from '../chess/status.js';

/* Asks the engine for the best move in a position and packages it as a coach hint. */
export function useHint() {
  const [hint, setHint] = useState(null);
  const [loading, setLoading] = useState(false);
  const reqId = useRef(0);

  const request = useCallback(async (fen, history = [], timeMs = 1200) => {
    const id = ++reqId.current;
    setLoading(true);
    setHint(null);
    try {
      const res = await engine.analyse(fen, { timeMs, history });
      if (id !== reqId.current || !res.best) return null;
      const line = uciLineToSan(Chess, fen, res.pv.slice(0, 5));
      const h = {
        fen,
        uci: res.best,
        san: line[0],
        line,
        reasons: res.explanation?.reasons || [],
        assessment: res.explanation?.assessment,
        tags: res.explanation?.tags || [],
        piece: res.explanation?.piece || null,
        score: res.score,
        arrow: { from: res.best.slice(0, 2), to: res.best.slice(2, 4), color: 'blue' },
      };
      setHint(h);
      return h;
    } catch {
      return null;
    } finally {
      if (id === reqId.current) setLoading(false);
    }
  }, []);

  const clear = useCallback(() => {
    reqId.current++;
    setHint(null);
    setLoading(false);
  }, []);

  useEffect(() => () => { reqId.current++; }, []);

  return { hint, loading, request, clear };
}
