import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { orientationFor } from '../../stepUtils.js';
import AnswerVerdict from './AnswerVerdict.jsx';

export default function FindReview({ step, answer, coach, actions }) {
  const wrong = (answer?.picks || []).filter((sq) => !step.targets.includes(sq));
  const highlights = Object.fromEntries(step.targets.map((s) => [s, 'good']));
  for (const sq of wrong) highlights[sq] = 'bad';
  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={step.fen} orientation={orientationFor(step)} highlights={highlights} />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={!wrong.length}
          okText={`You found ${step.targets.length > 1 ? `all ${step.targets.length} squares` : 'it'} without a single wrong tap.`}
          badText={`You found ${step.targets.length > 1 ? 'them all' : 'it'}, after ${wrong.length} wrong tap${wrong.length > 1 ? 's' : ''} (shown in red): ${wrong.join(', ')}.`}
        >
          {step.success}
        </AnswerVerdict>
      )}
      actions={actions}
    />
  );
}
