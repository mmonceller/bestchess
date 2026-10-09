import { useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton, HintButton, HintNotice } from '../components/StepButtons.jsx';
import { fb } from '../stepUtils.js';
import { sounds } from '../../../utils/sound.js';

const EMPTY = '8/8/8/8/8/8/8/8 w - - 0 1';

/* Coordinate game: tap each named square in turn. */
export default function SquaresStep({ step, coach, onNext, onMistake, onHint }) {
  const [index, setIndex] = useState(0);
  const [found, setFound] = useState([]);
  const [wrong, setWrong] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [hinted, setHinted] = useState(false);
  const missed = useRef(new Set());
  const done = index >= step.squares.length;
  const target = step.squares[index];

  function click(sq) {
    if (done) return;
    if (sq === target) {
      sounds.good();
      setFound((f) => [...f, sq]);
      setIndex(index + 1);
      setFeedback(index + 1 >= step.squares.length ? fb('good', step.success) : null);
      return;
    }
    if (!missed.current.has(target)) { missed.current.add(target); onMistake(); }
    sounds.bad();
    setWrong(sq);
    setTimeout(() => setWrong(null), 650);
    setFeedback(fb('bad', `That one is ${sq}. Find the letter "${target[0]}" along the bottom edge, then go up to row ${target[1]}.`));
  }

  const highlights = Object.fromEntries(found.map((s) => [s, 'good']));
  if (wrong) highlights[wrong] = 'bad';
  if (hinted && !done) highlights[target] = 'hint';

  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={<Board fen={step.fen || EMPTY} highlights={highlights} onSquareClick={click} showCoords />}
      feedback={<>
        {!done && (
          <div className="square-call pop-in" key={target}>
            <span className="muted small">Tap the square</span>
            <b>{target}</b>
            <span className="muted small">{index + 1} of {step.squares.length}</span>
          </div>
        )}
        {hinted && !done && <HintNotice>The glowing square is {target}. Letters name the columns, numbers name the rows.</HintNotice>}
        <Feedback fb={feedback} />
      </>}
      actions={done
        ? <ContinueButton onClick={onNext} />
        : <HintButton onClick={() => { if (!hinted) onHint(); setHinted(true); }} disabled={hinted} />}
    />
  );
}
