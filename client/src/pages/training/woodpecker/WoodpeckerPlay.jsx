import { useEffect, useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { engine } from '../../../engine/engineClient.js';
import { Chess } from 'chess.js';
import { toUci, uciLineToSan } from '../../../chess/status.js';
import { solvesPuzzle } from '../../../training/puzzles/judgeMove.js';
import { graceNote, inGraceWindow } from '../../../training/woodpecker/grace.js';
import { alternativeCaption, alternativeNote } from '../../../training/woodpecker/alternativeNote.js';
import { firstMoveHint, goalText } from '../../../training/woodpecker/describe.js';
import { goalAside } from '../../../training/woodpecker/aim.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';
import PuzzleThemes from './themes/PuzzleThemes.jsx';
import PlayActions from './play/PlayActions.jsx';
import StepProgress from './play/StepProgress.jsx';
import SimulateStrip from './play/SimulateStrip.jsx';
import SolutionCard from './play/SolutionCard.jsx';
import { useSimulate } from './play/useSimulate.js';

/*
 * One Woodpecker exercise. Any move the engine says also solves it counts (any mate in a mate
 * puzzle); a different key move ends the exercise as solved and shows the book's line. A hint
 * or a miss counts as unsolved for the cycle. On a multi-step line, a wrong move in the first
 * few turns is taken back so the player can try again or show the solution.
 */
export default function WoodpeckerPlay({ puzzle, onResult, onNext }) {
  const game = useChessGame(puzzle.fen);
  const me = puzzle.fen.split(' ')[1];
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState('solving');
  const [busy, setBusy] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [retry, setRetry] = useState(false);
  const [note, setNote] = useState(null);
  const [alt, setAlt] = useState(null);
  const [xp, setXp] = useState(null);
  const timers = useRef([]);
  const alive = useRef(true);
  const sim = useSimulate(puzzle);
  const [solutionOpen, setSolutionOpen] = useState(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; timers.current.forEach(clearTimeout); };
  }, []);
  useEffect(() => { setSolutionOpen(!sim.open); }, [sim.open]);
  const later = (fn, ms) => timers.current.push(setTimeout(() => { if (alive.current) fn(); }, ms));

  function clearTimers() {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }

  function settle(solved, tone, text, final = solved ? 'solved' : 'failed') {
    setRetry(false);
    setXp(onResult({ solved }).xp);
    setStatus(final);
    setNote({ tone, text });
    if (solved) sounds.good(); else sounds.bad();
  }

  function finishLine() {
    if (status === 'failed') {
      setStatus('reviewed');
      setNote({ tone: 'ok', text: 'That\'s the whole idea. You\'ll meet this position again next cycle.' });
    } else if (hinted) {
      settle(false, 'ok', 'Solved with the hint — it counts as a miss this cycle.', 'reviewed');
    } else {
      settle(true, 'good', 'Solved!');
    }
  }

  function settleAlternative(text) {
    if (hinted) finishLine();
    else settle(true, 'good', text);
  }

  function advance(onMainLine) {
    const reply = puzzle.moves[ply + 1];
    if (!onMainLine || !reply) { finishLine(); return; }
    setRetry(false);
    setBusy(true);
    if (status === 'solving') setNote({ tone: 'good', text: 'Right! Keep going…' });
    later(() => {
      playMoveSound(game.move(reply));
      setBusy(false);
      setPly((p) => p + 2);
    }, 500);
  }

  function undoSoon() {
    setBusy(true);
    later(() => { game.undo(); setBusy(false); }, 700);
  }

  function miss(text) {
    settle(false, 'bad', text);
    undoSoon();
  }

  function takeBack(text) {
    setRetry(true);
    setNote({ tone: 'ok', text });
    sounds.bad();
    undoSoon();
  }

  function tryAgain() {
    clearTimers();
    if (game.turn !== me) game.undo();
    setBusy(false);
    setNote({ tone: 'ok', text: 'Have another look. The winning idea is still there.' });
  }

  async function onMove(m) {
    if (busy || status === 'solved' || status === 'reviewed') return;
    const before = game.fen;
    const mv = game.move(m);
    if (!mv) return;
    playMoveSound(mv);
    const uci = toUci(mv);
    const expected = puzzle.moves[ply];

    if (uci === expected || (puzzle.goal === 'mate' && game.chess.isCheckmate())) {
      advance(uci === expected);
      return;
    }
    if (status === 'failed') {
      setBusy(true);
      setNote({ tone: 'ok', text: 'Follow the blue arrow to see the solution.' });
      later(() => { game.undo(); setBusy(false); }, 600);
      return;
    }
    setBusy(true);
    setRetry(false);
    setNote({ tone: 'ok', text: 'Checking your move…' });
    let graded = null;
    try { graded = await engine.grade(before, uci, 1500, expected); } catch { /* treat as a miss */ }
    if (!alive.current) return;
    if (solvesPuzzle(graded, { mate: puzzle.goal === 'mate' })) {
      setBusy(false);
      const [bookSan] = uciLineToSan(Chess, before, [expected]);
      setAlt({ played: mv.san, book: bookSan });
      settleAlternative(alternativeNote(mv.san, bookSan));
      return;
    }
    if (inGraceWindow(puzzle, ply)) {
      takeBack(graceNote(mv.san, ply));
      return;
    }
    miss(ply === 0
      ? `[[${mv.san}]] isn't the idea. The blue arrow shows the move — play it through.`
      : `[[${mv.san}]] isn't the idea. The blue arrow shows the continuation.`);
  }

  function giveUp() {
    clearTimers();
    if (status === 'solving' && game.turn !== me) game.undo();
    settle(false, 'bad', 'Here is the solution — play the blue arrows.');
  }

  const expected = puzzle.moves[ply];
  const showAnswer = status === 'failed' && !busy && expected;
  const arrows = showAnswer ? [{ from: expected.slice(0, 2), to: expected.slice(2, 4), color: 'blue' }] : undefined;
  const canMove = !busy && (status === 'solving' || status === 'failed') && game.turn === me;
  const done = status !== 'solving';
  const view = sim.open ? sim.view : null;
  const altCaption = alt ? alternativeCaption(alt.played, alt.book) : null;

  return (
    <div className="game-layout puzzle-play fade-in">
      <div className="board-column">
        <Board
          fen={view?.fen || game.fen}
          orientation={me === 'w' ? 'white' : 'black'}
          movableColor={canMove && !sim.open ? me : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={view ? view.lastMove : game.lastMove}
          checkSquare={view ? view.checkSquare : game.checkSquare}
          arrows={view ? view.arrows : arrows}
          moveMs={view?.moveMs}
        />
      </div>
      <aside className="side-panel puzzle-panel">
        <div className="puzzle-turn">
          <span className={`turn-dot ${me === 'w' ? 'white' : 'black'}`} />
          <div>
            <b>{goalText(puzzle)}</b>
            <div className="muted small">{goalAside(puzzle)}</div>
          </div>
          <span className="badge puzzle-level" title="Rough difficulty">{puzzle.rating}</span>
        </div>
        <StepProgress puzzle={puzzle} ply={ply} complete={status === 'solved' || status === 'reviewed'} />

        {hinted && !done && (
          <div className="puzzle-question"><Icon name="hint" size={22} /><div><p>{firstMoveHint(puzzle)}</p><PuzzleThemes puzzle={puzzle} hint /></div></div>
        )}
        {note && <Notice tone={note.tone} key={note.text}>{note.text}</Notice>}

        {done && (
          <SolutionCard
            puzzle={puzzle}
            altCaption={altCaption}
            folded={!solutionOpen}
            onToggle={() => setSolutionOpen((v) => !v)}
          />
        )}
        {xp !== null && (
          <div className="puzzle-result pop-in"><span className="xp"><Icon name="bolt" size={14} /> +{xp} XP</span></div>
        )}

        <div className="step-actions wp-actions">
          <PlayActions
            done={done}
            busy={busy}
            hinted={hinted}
            retry={retry}
            onHint={() => setHinted(true)}
            onGiveUp={giveUp}
            onTryAgain={tryAgain}
            onNext={onNext}
            extra={done ? <SimulateStrip sim={sim} /> : null}
          />
        </div>
      </aside>
    </div>
  );
}
