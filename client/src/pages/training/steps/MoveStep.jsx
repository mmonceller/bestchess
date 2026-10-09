import { useEffect, useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton, HintButton, HintNotice } from '../components/StepButtons.jsx';
import { GlossText } from '../components/Glossary.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { toUci } from '../../../chess/status.js';
import { fb, orientationFor, pick, toHighlights } from '../stepUtils.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';

/* Student must find the scripted move(s); odd entries in `line` are auto-played replies. */
export default function MoveStep({ step, coach, onNext, onMistake, onHint }) {
  const game = useChessGame(step.fen);
  const [ply, setPly] = useState(0);
  const [busy, setBusy] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [hintLevel, setHintLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(step.timeLimit || null);
  const timedOut = useRef(false);
  const timers = useRef([]);
  const studentColor = step.fen.split(' ')[1];

  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  useEffect(() => {
    if (!step.timeLimit || solved) return undefined;
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id);
          if (!timedOut.current) {
            timedOut.current = true;
            onMistake();
            setFeedback(fb('ok', "Time's up! Keep going — try to be a little faster next time."));
          }
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [solved]); // eslint-disable-line react-hooks/exhaustive-deps

  function finish() {
    setSolved(true);
    sounds.good();
    setFeedback(fb('good', `${step.success || pick(coach.praise)}`));
  }

  function onMove(m) {
    if (busy || solved) return;
    const mv = game.move(m);
    if (!mv) return;
    const uci = toUci(mv);
    const expected = step.accept?.[ply] || [step.line[ply]];
    if (expected.includes(uci)) {
      playMoveSound(mv);
      setHintLevel(0);
      const isMainLine = uci === step.line[ply];
      const reply = step.line[ply + 1];
      if (!reply || !isMainLine) { finish(); return; }
      setBusy(true);
      setFeedback(fb('good', pick(coach.praise)));
      later(() => {
        playMoveSound(game.move(reply));
        setBusy(false);
        if (ply + 2 >= step.line.length) finish();
        else setPly(ply + 2);
      }, 550);
    } else {
      onMistake();
      sounds.bad();
      setBusy(true);
      setFeedback(fb('bad', step.wrong?.[uci] || pick(coach.oops)));
      later(() => { game.undo(); setBusy(false); }, 800);
    }
  }

  function hint() {
    if (hintLevel === 0) onHint();
    setHintLevel((h) => Math.min(2, h + 1));
  }

  const target = step.line[ply];
  const highlights = {
    ...(solved ? {} : toHighlights(step.highlights)),
    ...(hintLevel >= 1 && !solved ? { [target.slice(0, 2)]: 'hint' } : {}),
  };
  const arrows = hintLevel >= 2 && !solved ? [{ from: target.slice(0, 2), to: target.slice(2, 4), color: 'blue' }] : undefined;

  return (
    <StepLayout
      coach={coach}
      message={<><GlossText>{step.prompt}</GlossText>{timeLeft != null && !solved && <span className={`timer${timeLeft <= 10 ? ' low' : ''}`}><Icon name="clock" size={14} /> {timeLeft}s</span>}</>}
      board={(
        <Board
          fen={game.fen}
          orientation={orientationFor(step)}
          movableColor={!busy && !solved && game.turn === studentColor ? studentColor : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          highlights={highlights}
          arrows={arrows}
        />
      )}
      feedback={<>
        {hintLevel >= 1 && !solved && <HintNotice extra={hintLevel >= 2 && ' The arrow shows the move.'}>{step.hint}</HintNotice>}
        <Feedback fb={feedback} />
      </>}
      actions={solved
        ? <ContinueButton onClick={onNext} />
        : <HintButton onClick={hint} disabled={hintLevel >= 2} label={hintLevel === 0 ? 'Hint' : 'Show me'} />}
    />
  );
}
