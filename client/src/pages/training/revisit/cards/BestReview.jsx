import Board from '../../../../components/board/Board.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { orientationFor } from '../../stepUtils.js';
import { judgeBestTries, sanOf } from '../answerSummary.js';
import AnswerVerdict from './AnswerVerdict.jsx';
import TryList from './TryList.jsx';

const arrow = (uci, color) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), color });

export default function BestReview({ step, answer, coach, actions }) {
  const tries = judgeBestTries(step, answer);
  const accepted = tries[tries.length - 1];
  const misses = tries.filter((t) => !t.ok);
  const engineBest = answer?.best;
  const arrows = [
    ...misses.map((t) => arrow(t.uci, 'red')),
    ...(engineBest && engineBest !== accepted?.uci ? [arrow(engineBest, 'blue')] : []),
    ...(accepted ? [arrow(accepted.uci, 'green')] : []),
  ];
  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={step.fen} orientation={orientationFor(step)} arrows={arrows} />}
      feedback={(
        <AnswerVerdict
          known={Boolean(answer)}
          ok={!misses.length}
          okText={`Your first idea, ${accepted?.san}, was already a good move.`}
          badText={`You found a good move (${accepted?.san}) after ${misses.length} weaker tr${misses.length > 1 ? 'ies' : 'y'}.`}
        >
          {engineBest && engineBest !== accepted?.uci && <>The engine&apos;s top choice was <b>{sanOf(step.fen, engineBest)}</b> (blue arrow). </>}
          <TryList tries={tries} />
        </AnswerVerdict>
      )}
      actions={actions}
    />
  );
}
