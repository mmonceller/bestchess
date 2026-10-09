import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import AnswerVerdict from './AnswerVerdict.jsx';

const EMPTY = '8/8/8/8/8/8/8/8 w - - 0 1';

export default function SquaresReview({ step, answer, coach, actions }) {
  const misses = answer?.misses || [];
  const highlights = Object.fromEntries(step.squares.map((s) => [s, misses.includes(s) ? 'bad' : 'good']));
  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={step.fen || EMPTY} highlights={highlights} showCoords />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={!misses.length}
          okText={`You found all ${step.squares.length} squares first time.`}
          badText={`You found them all. These took more than one try (red): ${misses.join(', ')}.`}
        />
      )}
      actions={actions}
    />
  );
}
