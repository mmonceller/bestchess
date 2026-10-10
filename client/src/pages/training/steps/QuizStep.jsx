import { useEffect, useMemo, useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import StepLayout from '../components/StepLayout.jsx';
import { ContinueButton } from '../components/StepButtons.jsx';
import { GlossText } from '../components/Glossary.jsx';
import { orientationFor, pick, toArrows, toHighlights } from '../stepUtils.js';
import { sounds } from '../../../utils/sound.js';
import { freshOptionOrder, optionLetter, optionOrder, rememberOptionOrder } from '../../../training/quiz/optionOrder.js';

/* `reshuffle` gives the options a new order on every try instead of the fixed lesson order. */
export default function QuizStep({ step, coach, onNext, onMistake, onAnswer, reshuffle = false }) {
  const [tried, setTried] = useState({});
  const [solved, setSolved] = useState(false);
  const [reaction, setReaction] = useState('');
  const picks = useRef([]);
  const order = useMemo(() => (reshuffle ? freshOptionOrder(step) : optionOrder(step)), [step, reshuffle]);
  useEffect(() => { if (reshuffle) rememberOptionOrder(step, order); }, [step, order, reshuffle]);

  function choose(i) {
    if (solved || tried[i]) return;
    setTried((t) => ({ ...t, [i]: true }));
    picks.current.push(i);
    if (step.options[i].correct) {
      setSolved(true);
      onAnswer?.(reshuffle ? { picks: picks.current, order } : { picks: picks.current });
      setReaction(pick(coach.praise));
      sounds.good();
    } else {
      onMistake();
      setReaction(pick(coach.oops));
      sounds.bad();
    }
  }

  const board = step.fen && (
    <Board fen={step.fen} orientation={orientationFor(step)} arrows={toArrows(step.arrows)} highlights={toHighlights(step.highlights)} />
  );

  return (
    <StepLayout
      coach={coach}
      message={<><GlossText>{step.question}</GlossText>{reaction && <div className="reaction">“{reaction}”</div>}</>}
      board={board}
      actions={solved && <ContinueButton onClick={onNext} />}
    >
      <div className="quiz-options">
        {order.map((i, position) => {
          const o = step.options[i];
          const state = tried[i] ? (o.correct ? 'right' : 'wrong') : '';
          return (
            <div key={i} className={`quiz-option ${state}`}>
              <button className="quiz-pick" onClick={() => choose(i)} disabled={solved && !tried[i]}>
                <span className="quiz-letter">
                  {state === 'right' ? <Icon name="check" size={16} /> : state === 'wrong' ? <Icon name="close" size={16} /> : optionLetter(position)}
                </span>
                <span>{o.text}</span>
              </button>
              {tried[i] && <div className="quiz-why fade-in"><GlossText>{o.why}</GlossText></div>}
            </div>
          );
        })}
      </div>
    </StepLayout>
  );
}
