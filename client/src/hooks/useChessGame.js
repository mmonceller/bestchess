import { useCallback, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import { kingSquare } from '../components/board/pieces.js';
import { gameStatus } from '../chess/status.js';

/* React wrapper around a mutable chess.js instance. */
export function useChessGame(initialFen, initialPgn) {
  const ref = useRef(null);
  if (!ref.current) {
    ref.current = new Chess(initialFen);
    if (initialPgn) {
      try { ref.current.loadPgn(initialPgn); } catch { /* start fresh on a corrupt save */ }
    }
  }
  const chess = ref.current;
  const [version, setVersion] = useState(0);
  const bump = useCallback(() => setVersion((v) => v + 1), []);

  const move = useCallback((m) => {
    try {
      const res = chess.move(typeof m === 'string' ? { from: m.slice(0, 2), to: m.slice(2, 4), promotion: m[4] } : m);
      bump();
      return res;
    } catch {
      return null;
    }
  }, [chess, bump]);

  const undo = useCallback((n = 1) => {
    for (let i = 0; i < n; i++) chess.undo();
    bump();
  }, [chess, bump]);

  const reset = useCallback((fen) => {
    if (fen) chess.load(fen);
    else chess.reset();
    bump();
  }, [chess, bump]);

  const loadPgn = useCallback((pgn) => {
    try { chess.loadPgn(pgn); bump(); return true; } catch { return false; }
  }, [chess, bump]);

  const getMoves = useCallback((sq) => chess.moves({ square: sq, verbose: true }), [chess, version]);

  const derived = useMemo(() => {
    const fen = chess.fen();
    const history = chess.history({ verbose: true });
    const last = history[history.length - 1];
    return {
      fen,
      turn: chess.turn(),
      history,
      lastMove: last ? { from: last.from, to: last.to } : null,
      checkSquare: chess.inCheck() ? kingSquare(fen, chess.turn()) : null,
      status: gameStatus(chess),
      positionsBefore: history.map((h) => h.before),
    };
  }, [chess, version]);

  return { chess, move, undo, reset, loadPgn, getMoves, version, ...derived };
}
