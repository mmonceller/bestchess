import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import { kingSquare } from '../../../../components/board/pieces.js';
import { useSteppedPly } from '../../../../components/game/replay/useSteppedPly.js';
import { fetchContinuation, wantsSimulation } from '../../../../training/woodpecker/simulate/index.js';

const STEP_MS = 2200;
const OPEN_MS = 1400;

/*
 * After a Woodpecker solve, optionally walks one continuation on the same board.
 * Continuation is fetched on the eval worker so grading is not delayed.
 */
export function useSimulate(puzzle) {
  const [data, setData] = useState(null);
  const [open, setOpen] = useState(false);
  const [ply, setPly] = useState(0);
  const [playing, setPlaying] = useState(false);
  const { shown, moveMs, jump } = useSteppedPly(ply);
  const last = (data?.frames.length || 1) - 1;

  useEffect(() => {
    setData(null);
    setOpen(false);
    setPly(0);
    setPlaying(false);
    jump(0);
    if (!wantsSimulation(puzzle)) return undefined;
    let on = true;
    fetchContinuation(puzzle).then((c) => { if (on) setData(c); });
    return () => { on = false; };
  }, [puzzle, jump]);

  useEffect(() => {
    if (!open || !playing || !data) return undefined;
    if (shown !== ply) return undefined;
    if (ply >= last) {
      setPlaying(false);
      return undefined;
    }
    const timer = setTimeout(() => setPly((p) => p + 1), ply === 0 ? OPEN_MS : STEP_MS);
    return () => clearTimeout(timer);
  }, [open, playing, ply, shown, last, data]);

  const openIt = useCallback(() => {
    jump(0);
    setPly(0);
    setPlaying(true);
    setOpen(true);
  }, [jump]);

  const close = useCallback(() => {
    setOpen(false);
    setPlaying(false);
    setPly(0);
    jump(0);
  }, [jump]);

  const pick = useCallback((next) => {
    setPlaying(false);
    setPly(Math.max(0, Math.min(last, next)));
  }, [last]);

  const replay = useCallback(() => {
    jump(0);
    setPly(0);
    setPlaying(true);
  }, [jump]);

  const frame = data?.frames[shown];
  const view = useMemo(() => {
    if (!open || !frame) return null;
    const chess = new Chess(frame.fen);
    const mv = frame.move;
    return {
      fen: frame.fen,
      lastMove: mv ? { from: mv.from, to: mv.to } : null,
      checkSquare: chess.inCheck() ? kingSquare(frame.fen, chess.turn()) : null,
      arrows: mv ? [{ from: mv.from, to: mv.to, color: mv.san.includes('#') ? 'red' : frame.ours ? 'green' : 'orange' }] : null,
      moveMs: Math.max(moveMs, 320),
    };
  }, [open, frame, moveMs]);

  return {
    ready: Boolean(data),
    open,
    playing,
    ply,
    shown,
    last,
    frame,
    view,
    openIt,
    close,
    pick,
    replay,
    togglePlay: () => (ply >= last ? replay() : setPlaying((v) => !v)),
  };
}
