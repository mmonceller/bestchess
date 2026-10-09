import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { orientationFor } from '../../stepUtils.js';
import { finalFen, numberLine } from '../answerSummary.js';
import AnswerVerdict from './AnswerVerdict.jsx';

const GOAL_DONE = { mate: 'You delivered checkmate', promote: 'You promoted the pawn', hold: 'You held the position' };

export default function DrillReview({ step, answer, coach, actions }) {
  const moves = answer?.moves || [];
  const fails = answer?.fails || 0;
  const done = GOAL_DONE[step.goal] || 'You completed it';
  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={moves.length ? finalFen(step.fen, moves) : step.fen} orientation={orientationFor(step)} />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={!fails}
          okText={`${done} on your first attempt. The board shows your final position.`}
          badText={`${done} after ${fails} failed attempt${fails > 1 ? 's' : ''}. The board shows your final position.`}
        >
          {moves.length > 0 && <><b>Your winning game:</b> {numberLine(step.fen, moves)}</>}
        </AnswerVerdict>
      )}
      actions={actions}
    />
  );
}
