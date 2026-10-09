import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton, HintButton, HintNotice } from '../components/StepButtons.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { engine } from '../../../engine/engineClient.js';
import { toUci, uciLineToSan } from '../../../chess/status.js';
import { fb, orientationFor, pick } from '../stepUtils.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';

/* Engine-graded step: any move within `maxLoss` centipawns of the best move is accepted. */
export default function BestStep({ step, coach, onNext, onMistake, onHint, onAnswer }) {
  const game = useChessGame(step.fen);
  const [grading, setGrading] = useState(false);
  const [solved, setSolved] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [fails, setFails] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [bestUci, setBestUci] = useState(null);
  const alive = useRef(true);
  const tries = useRef([]);
  const studentColor = step.fen.split(' ')[1];

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; };
  }, []);

  async function onMove(m) {
    if (grading || solved) return;
    const mv = game.move(m);
    if (!mv) return;
    playMoveSound(mv);
    setGrading(true);
    setFeedback(fb('ok', `${coach.name} is checking your move…`));
    let g;
    try {
      g = await engine.grade(step.fen, toUci(mv), 1500);
    } catch {
      if (!alive.current) return;
      setGrading(false);
      game.undo();
      setFeedback(fb('bad', `${coach.name} couldn't check that move. Please try it again.`));
      return;
    }
    if (!alive.current) return;
    setGrading(false);
    setBestUci(g.best);
    const bestSan = uciLineToSan(Chess, step.fen, [g.best])[0];
    tries.current.push(toUci(mv));
    if (g.loss <= step.maxLoss) {
      setSolved(true);
      onAnswer?.({ tries: tries.current, best: g.best });
      sounds.good();
      const extra = g.best === toUci(mv)
        ? ' That was the very best move!'
        : ` Another strong idea was [[${bestSan}]] — ${g.explanation?.reasons?.[0]?.toLowerCase() || 'also good.'}`;
      setFeedback(fb('good', `${step.success}${extra}`));
    } else {
      onMistake();
      sounds.bad();
      setFails((f) => f + 1);
      const cost = Math.abs(g.loss) > 5000 ? 'could lose the game' : `gives away about ${(g.loss / 100).toFixed(1)} pawns' worth`;
      setFeedback(fb('bad', `${pick(coach.oops)} [[${mv.san}]] ${cost}. Try again.`));
      setTimeout(() => { if (alive.current) game.undo(); }, 900);
    }
  }

  function hint() {
    if (hintLevel === 0) onHint();
    setHintLevel((h) => Math.min(2, h + 1));
  }

  const showBest = !solved && bestUci && (hintLevel >= 2 || fails >= 2);
  const arrows = showBest ? [{ from: bestUci.slice(0, 2), to: bestUci.slice(2, 4), color: 'blue' }] : undefined;

  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={(
        <Board
          fen={game.fen}
          orientation={orientationFor(step)}
          movableColor={!grading && !solved && game.turn === studentColor ? studentColor : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          arrows={arrows}
        />
      )}
      feedback={<>
        <div className="engine-note muted small icon-text">
          <Icon name="cpu" size={14} /> There's more than one right answer — any good move counts.
        </div>
        {hintLevel >= 1 && !solved && <HintNotice>{step.hint}</HintNotice>}
        {showBest && <Notice tone="ok" icon="arrowRight">The blue arrow shows a strong move.</Notice>}
        <Feedback fb={feedback} />
      </>}
      actions={solved
        ? <ContinueButton onClick={onNext} />
        : <HintButton onClick={hint} disabled={hintLevel >= 1 && !bestUci} label={hintLevel === 0 ? 'Hint' : 'Show me a good move'} />}
    />
  );
}
