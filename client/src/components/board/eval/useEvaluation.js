import { useEffect, useState } from 'react';
import { Chess } from 'chess.js';
import { evalEngine } from '../../../engine/engineClient.js';

const EVAL_MS = 450;

/* Winning chances in [-1, 1] for a centipawn score, the same curve Lichess uses. */
const winningChances = (cp) => 2 / (1 + Math.exp(-0.00368208 * cp)) - 1;

const formatCp = (cp) => `${cp > 0 ? '+' : cp < 0 ? '−' : ''}${(Math.abs(cp) / 100).toFixed(1)}`;

/* Positions that are already decided need no search. */
function finalEval(fen) {
  let c;
  try { c = new Chess(fen); } catch { return null; }
  if (c.isCheckmate()) {
    const whiteWon = c.turn() === 'b';
    return { white: whiteWon ? 1 : 0, label: whiteWon ? '1-0' : '0-1' };
  }
  if (c.isDraw() || c.isStalemate()) return { white: 0.5, label: '½-½' };
  return null;
}

/*
 * Engine evaluation of `fen` from White's side, refreshed after every move:
 * `white` is White's share of the bar (0..1) and `label` reads like "+1.3" or "M3".
 * `fen` names the position the numbers belong to (the previous one until the engine answers).
 */
export function useEvaluation(fen, enabled = true) {
  const [evaluation, setEvaluation] = useState({ white: 0.5, label: '0.0' });

  useEffect(() => {
    if (!enabled || !fen) return undefined;
    const done = finalEval(fen);
    if (done) { setEvaluation({ ...done, fen, over: true }); return undefined; }
    let alive = true;
    const whiteToMove = fen.split(' ')[1] === 'w';
    evalEngine.evaluate(fen, EVAL_MS)
      .then((res) => {
        if (!alive) return;
        const sign = whiteToMove ? 1 : -1;
        if (res.mate != null) {
          const mate = res.mate * sign;
          setEvaluation({ white: mate > 0 ? 1 : 0, label: `M${Math.abs(mate)}`, mate, fen });
          return;
        }
        const cp = res.score * sign;
        setEvaluation({ white: 0.5 + 0.5 * winningChances(cp), label: formatCp(cp), cp, fen });
      })
      .catch(() => {});
    return () => { alive = false; };
  }, [fen, enabled]);

  return evaluation;
}
