import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { GlossText } from '../../components/Glossary.jsx';
import { orientationFor } from '../../stepUtils.js';
import { judgeMoveTries, solutionText } from '../answerSummary.js';
import AnswerVerdict from './AnswerVerdict.jsx';
import TryList from './TryList.jsx';

export default function MoveReview({ step, answer, coach, actions }) {
  const tries = judgeMoveTries(step, answer?.tries);
  const misses = tries.filter((t) => !t.ok);
  const first = step.line[0];
  const arrows = [
    ...misses.filter((t) => t.first).map((t) => ({ from: t.uci.slice(0, 2), to: t.uci.slice(2, 4), color: 'red' })),
    { from: first.slice(0, 2), to: first.slice(2, 4), color: 'green' },
  ];
  return (
    <StepLayout
      coach={coach}
      message={<GlossText>{step.prompt}</GlossText>}
      board={<Board fen={step.fen} orientation={orientationFor(step)} arrows={arrows} />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={!misses.length}
          okText="You found every move on your first try."
          badText={`You solved it after ${misses.length} wrong move${misses.length > 1 ? 's' : ''}.`}
        >
          <b>Solution:</b> {solutionText(step)}
          <TryList tries={tries} />
        </AnswerVerdict>
      )}
      actions={actions}
    />
  );
}
