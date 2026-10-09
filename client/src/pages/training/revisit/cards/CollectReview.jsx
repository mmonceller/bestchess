import { useMemo } from 'react';
import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { placementFen } from '../../../../training/pieceMoves.js';
import AnswerVerdict from './AnswerVerdict.jsx';

export default function CollectReview({ step, answer, coach, actions }) {
  const fen = useMemo(() => {
    const map = { [step.start]: step.piece.toUpperCase() };
    for (const b of step.blockers || []) map[b] = 'P';
    Object.assign(map, step.enemies || {});
    return placementFen(map);
  }, [step]);
  const path = answer?.path || [];
  const arrows = path.slice(1).map((to, i) => ({ from: path[i], to, color: 'green' }));
  const markers = Object.fromEntries(step.stars.map((s) => [s, 'star']));
  const moves = answer?.moves;
  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={fen} markers={markers} arrows={arrows} showCoords />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={moves <= step.par}
          okText={`Perfect route: ${moves} moves, the fewest possible. The arrows show your path.`}
          badText={`You collected everything in ${moves} moves — the best is ${step.par}. The arrows show your path.`}
        />
      )}
      actions={actions}
    />
  );
}
