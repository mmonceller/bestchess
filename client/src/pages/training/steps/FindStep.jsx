import { useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton, HintButton, HintNotice } from '../components/StepButtons.jsx';
import { fb, orientationFor, pick } from '../stepUtils.js';
import { sounds } from '../../../utils/sound.js';

export default function FindStep({ step, coach, onNext, onMistake, onHint }) {
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hinted, setHinted] = useState(false);
  const solved = found.length === step.targets.length;

  function click(sq) {
    if (solved || found.includes(sq)) return;
    if (step.targets.includes(sq)) {
      const next = [...found, sq];
      setFound(next);
      sounds.good();
      setFeedback(next.length === step.targets.length
        ? fb('good', step.success)
        : fb('good', `Yes! ${step.targets.length - next.length} more to go.`));
    } else {
      onMistake();
      sounds.bad();
      setWrong(sq);
      setTimeout(() => setWrong(null), 650);
      setFeedback(fb('bad', pick(coach.oops)));
    }
  }

  const highlights = Object.fromEntries(found.map((s) => [s, 'good']));
  if (wrong) highlights[wrong] = 'bad';

  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={step.fen} orientation={orientationFor(step)} highlights={highlights} onSquareClick={click} />}
      feedback={<>
        <div className="find-progress">{step.targets.map((t, i) => <span key={t} className={i < found.length ? 'on' : ''} />)}</div>
        {hinted && !solved && <HintNotice>{step.hint}</HintNotice>}
        <Feedback fb={feedback} />
      </>}
      actions={solved
        ? <ContinueButton onClick={onNext} />
        : <HintButton onClick={() => { if (!hinted) onHint(); setHinted(true); }} disabled={hinted} />}
    />
  );
}
