import { useMemo } from 'react';
import Board from '../../../components/board/Board.jsx';
import StepLayout from '../components/StepLayout.jsx';
import { ContinueButton } from '../components/StepButtons.jsx';
import { parseFen } from '../../../components/board/pieces.js';
import { reachInPosition } from '../../../training/pieceMoves.js';
import { orientationFor, toArrows, toHighlights } from '../stepUtils.js';

/* `showMoves` lists squares whose pieces should display every square they can reach. */
function moveHighlights(fen, showMoves) {
  if (!fen || !showMoves) return {};
  const pieces = parseFen(fen);
  const out = {};
  for (const sq of [].concat(showMoves)) {
    for (const t of reachInPosition(pieces, sq)) out[t.to] = t.capture ? 'capture' : 'move';
    out[sq] = 'focus';
  }
  return out;
}

export default function TalkStep({ step, coach, onNext }) {
  const highlights = useMemo(
    () => ({ ...moveHighlights(step.fen, step.showMoves), ...toHighlights(step.highlights) }),
    [step],
  );
  const board = step.fen && (
    <Board fen={step.fen} orientation={orientationFor(step)} arrows={toArrows(step.arrows)} highlights={highlights} markers={step.markers} />
  );
  return (
    <StepLayout
      coach={coach}
      message={step.text}
      board={board}
      actions={<ContinueButton onClick={onNext} />}
    />
  );
}
