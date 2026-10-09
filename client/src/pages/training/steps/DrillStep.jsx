import { useEffect, useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import HintCard from '../../../components/game/HintCard.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton } from '../components/StepButtons.jsx';
import { GlossText } from '../components/Glossary.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { useHint } from '../../../hooks/useHint.js';
import { engine } from '../../../engine/engineClient.js';
import { parseFen } from '../../../components/board/pieces.js';
import { gameStatus } from '../../../chess/status.js';
import { fb, orientationFor, pick } from '../stepUtils.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';

const VALUE = { n: 3, b: 3, r: 5, q: 9 };
const pieceMaterial = (fen, color) => Object.values(parseFen(fen))
  .reduce((n, p) => n + (p.color === color ? VALUE[p.type] || 0 : 0), 0);

const GOAL_TEXT = { mate: 'Checkmate', promote: 'Promote', hold: 'Hold the draw' };

/* Play the position out against the engine until the goal is reached or the move budget runs out. */
export default function DrillStep({ step, coach, onNext, onMistake, onHint, onAnswer }) {
  const game = useChessGame(step.fen);
  const hint = useHint();
  const me = step.fen.split(' ')[1];
  const startMaterial = useRef(pieceMaterial(step.fen, me));
  const [state, setState] = useState('playing');
  const [thinking, setThinking] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const token = useRef(0);
  const fails = useRef(0);
  const myMoves = game.history.filter((h) => h.color === me).length;

  useEffect(() => () => { token.current++; }, []);

  function fail(reason) {
    setState('failed');
    fails.current++;
    onMistake();
    sounds.bad();
    setFeedback(fb('bad', `${reason} ${pick(coach.oops)}`));
  }

  function succeed() {
    setState('won');
    onAnswer?.({ moves: game.chess.history(), fails: fails.current });
    sounds.end();
    setFeedback(fb('good', step.success));
  }

  /* Evaluates the goal after any move; returns true when the drill has ended. */
  function judge(lastMove) {
    const c = game.chess;
    const status = gameStatus(c);
    const madeByMe = lastMove.color === me;
    const myCount = c.history({ verbose: true }).filter((h) => h.color === me).length;
    if (step.goal === 'mate' && status.over && status.winner === me) { succeed(); return true; }
    if (step.goal === 'promote' && madeByMe && lastMove.promotion) { succeed(); return true; }
    if (status.over) {
      if (status.winner === me) { succeed(); return true; }
      fail(status.winner ? 'You got checkmated.' : `The game ended in a draw (${status.reason}).`);
      return true;
    }
    if (step.goal === 'hold') {
      if (!madeByMe && lastMove.promotion) { fail('The pawn promoted.'); return true; }
      if (pieceMaterial(c.fen(), me) < startMaterial.current) { fail('You lost material.'); return true; }
      if (madeByMe && myCount >= step.moves) { succeed(); return true; }
      return false;
    }
    if (madeByMe && myCount >= step.moves) { fail(`Out of moves — ${step.moves} moves used.`); return true; }
    return false;
  }

  function engineReply() {
    const my = ++token.current;
    setThinking(true);
    const c = game.chess;
    const before = c.history({ verbose: true }).map((h) => h.before);
    engine.move(c.fen(), step.level || 5, before)
      .then((res) => {
        if (my !== token.current || !res) return;
        const mv = game.move(res.uci);
        playMoveSound(mv);
        setThinking(false);
        if (mv) judge(mv);
      })
      .catch(() => { if (my === token.current) setThinking(false); });
  }

  function onMove(m) {
    if (state !== 'playing' || thinking) return;
    const mv = game.move(m);
    if (!mv) return;
    playMoveSound(mv);
    hint.clear();
    if (!judge(mv)) engineReply();
  }

  function retry() {
    token.current++;
    setThinking(false);
    hint.clear();
    game.reset(step.fen);
    setState('playing');
    setFeedback(null);
  }

  function askHint() {
    onHint();
    hint.request(game.fen, game.positionsBefore, 1200);
  }

  const remaining = Math.max(0, step.moves - myMoves);

  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={(
        <Board
          fen={game.fen}
          orientation={orientationFor(step)}
          movableColor={state === 'playing' && !thinking && game.turn === me ? me : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          arrows={hint.hint ? [hint.hint.arrow] : undefined}
        />
      )}
      feedback={<>
        <div className="drill-status">
          <span className="badge icon-text"><Icon name="target" size={14} /> {GOAL_TEXT[step.goal]}</span>
          <span className="badge">{step.goal === 'hold' ? `Survive ${remaining} more` : `${remaining} moves left`}</span>
          {thinking && <span className="muted small">Your opponent is thinking…</span>}
        </div>
        {state === 'playing' && <div className="muted small drill-tip"><Icon name="hint" size={14} /> <span><GlossText>{step.hint}</GlossText></span></div>}
        <HintCard hint={hint.hint} loading={hint.loading} onClose={hint.clear} title={`${coach.name}'s suggestion`} />
        <Feedback fb={feedback} />
      </>}
      actions={(
        <>
          {state === 'won' && <ContinueButton onClick={onNext} />}
          {state === 'failed' && <button className="btn primary block icon-text" onClick={retry}><Icon name="retry" size={18} /> Try again</button>}
          {state === 'playing' && (
            <div className="controls">
              <button className="btn icon-text" onClick={askHint} disabled={thinking || hint.loading || game.turn !== me}><Icon name="hint" size={18} /> Hint</button>
              <button className="btn icon-text" onClick={retry}><Icon name="retry" size={18} /> Restart</button>
            </div>
          )}
        </>
      )}
    />
  );
}
