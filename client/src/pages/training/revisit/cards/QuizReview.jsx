import Board from '../../../../components/board/Board.jsx';
import Icon from '../../../../components/icons/Icon.jsx';
import StepLayout from '../../components/StepLayout.jsx';
import { GlossText } from '../../components/Glossary.jsx';
import { orientationFor, toArrows, toHighlights } from '../../stepUtils.js';
import AnswerVerdict from './AnswerVerdict.jsx';
import { optionLetter, optionOrder } from '../../../../training/quiz/optionOrder.js';

const ORDINAL = ['1st', '2nd', '3rd', '4th', '5th'];

export default function QuizReview({ step, answer, coach, actions }) {
  const picks = answer?.picks || [];
  const correctIndex = step.options.findIndex((o) => o.correct);
  const firstTry = picks.length ? picks[0] === correctIndex : null;

  const board = step.fen && (
    <Board fen={step.fen} orientation={orientationFor(step)} arrows={toArrows(step.arrows)} highlights={toHighlights(step.highlights)} />
  );

  return (
    <StepLayout
      coach={coach}
      message={<GlossText>{step.question}</GlossText>}
      board={board}
      feedback={<AnswerVerdict known={Boolean(answer)} ok={firstTry} okText="You got this right on your first try." badText={`You found the answer on your ${ORDINAL[picks.length - 1] || 'last'} try.`} />}
      actions={actions}
    >
      <div className="quiz-options review">
        {optionOrder(step, answer?.order).map((i, position) => {
          const o = step.options[i];
          const order = picks.indexOf(i);
          const state = o.correct ? 'right' : order >= 0 ? 'wrong' : 'unpicked';
          return (
            <div key={i} className={`quiz-option ${state}`}>
              <div className="quiz-pick static">
                <span className="quiz-letter">
                  {o.correct ? <Icon name="check" size={16} /> : order >= 0 ? <Icon name="close" size={16} /> : optionLetter(position)}
                </span>
                <span>{o.text}</span>
                {order >= 0 && <span className="pick-tag">Your {ORDINAL[order] || ''} pick</span>}
              </div>
              <div className="quiz-why"><GlossText>{o.why}</GlossText></div>
            </div>
          );
        })}
      </div>
    </StepLayout>
  );
}
