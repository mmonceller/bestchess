import { useEffect, useRef, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { engine } from '../../../engine/engineClient.js';
import { Chess } from 'chess.js';
import { toUci, uciLineToSan } from '../../../chess/status.js';
import { solvesPuzzle } from '../../../training/puzzles/judgeMove.js';
import { findRefutation, refutationText } from '../../../training/puzzles/refutation/index.js';
import MoveLine from '../../../components/notation/MoveLine.jsx';
import NotationGuideButton from '../../../components/notation/NotationGuideButton.jsx';
import { firstMoveHint, goalText } from '../../../training/woodpecker/describe.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';
import PuzzleThemes from './themes/PuzzleThemes.jsx';

/*
 * One Woodpecker exercise. Any move the engine says also solves it counts (any mate in a mate
 * puzzle); a different key move ends the exercise as solved and shows the book's line. A hint
 * or a miss counts as unsolved for the cycle, and the solution can then be played through.
 */
export default function WoodpeckerPlay({ puzzle, onResult, onNext }) {
  const game = useChessGame(puzzle.fen);
  const me = puzzle.fen.split(' ')[1];
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState('solving');
  const [busy, setBusy] = useState(false);
  const [hinted, setHinted] = useState(false);
  const [note, setNote] = useState(null);
  const [xp, setXp] = useState(null);
  const timers = useRef([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; timers.current.forEach(clearTimeout); };
  }, []);
  const later = (fn, ms) => timers.current.push(setTimeout(() => { if (alive.current) fn(); }, ms));

  function settle(solved, tone, text, final = solved ? 'solved' : 'failed') {
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
    setBusy(true);
    if (status === 'solving') setNote({ tone: 'good', text: 'Right! Keep going…' });
    later(() => {
      playMoveSound(game.move(reply));
      setBusy(false);
      setPly((p) => p + 2);
    }, 500);
  }

  function miss(text) {
    settle(false, 'bad', text);
    setBusy(true);
    later(() => { game.undo(); setBusy(false); }, 700);
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
    setNote({ tone: 'ok', text: 'Checking your move…' });
    let graded = null;
    try { graded = await engine.grade(before, uci, 1500, expected); } catch { /* treat as a miss */ }
    if (!alive.current) return;
    if (solvesPuzzle(graded, { mate: puzzle.goal === 'mate' })) {
      setBusy(false);
      if (ply === 0) {
        const [key] = uciLineToSan(Chess, before, [expected]);
        settleAlternative(`That works too! The book's key move was [[${key}]] — have a look at the solution.`);
      } else {
        finishLine();
      }
      return;
    }
    const refutation = await findRefutation(game.fen, mv);
    if (!alive.current) return;
    setBusy(false);
    const why = refutationText(refutation, me === 'w' ? 'Black' : 'White');
    miss(ply === 0
      ? `[[${mv.san}]] isn't the key move.${why} The blue arrow shows it — play it through.`
      : `[[${mv.san}]] lets the advantage slip.${why} The blue arrow shows the continuation.`);
  }

  function giveUp() {
    settle(false, 'bad', 'Here is the solution — play the blue arrows.');
  }

  const expected = puzzle.moves[ply];
  const showAnswer = status === 'failed' && !busy && expected;
  const arrows = showAnswer ? [{ from: expected.slice(0, 2), to: expected.slice(2, 4), color: 'blue' }] : undefined;
  const canMove = !busy && (status === 'solving' || status === 'failed') && game.turn === me;
  const done = status !== 'solving';

  return (
    <div className="game-layout puzzle-play fade-in">
      <div className="board-column">
        <Board
          fen={game.fen}
          orientation={me === 'w' ? 'white' : 'black'}
          movableColor={canMove ? me : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          arrows={arrows}
        />
      </div>
      <aside className="side-panel puzzle-panel">
        <div className="puzzle-turn">
          <span className={`turn-dot ${me === 'w' ? 'white' : 'black'}`} />
          <div>
            <b>{goalText(puzzle)}</b>
            <div className="muted small">Exercise {puzzle.n}</div>
          </div>
          <span className="badge puzzle-level" title="Rough difficulty">{puzzle.rating}</span>
        </div>

        {hinted && !done && (
          <div className="puzzle-question"><Icon name="hint" size={22} /><div><p>{firstMoveHint(puzzle)}</p><PuzzleThemes puzzle={puzzle} hint /></div></div>
        )}
        {note && <Notice tone={note.tone} key={note.text}>{note.text}</Notice>}

        {done && (
          <div className="wp-solution pop-in">
            <span className="muted small">Solution</span>
            <b><MoveLine fen={puzzle.fen} moves={puzzle.moves} /></b>
            {puzzle.game && <span className="muted small">{puzzle.game}</span>}
            <PuzzleThemes puzzle={puzzle} />
            <NotationGuideButton className="wp-guide" />
          </div>
        )}
        {xp !== null && (
          <div className="puzzle-result pop-in"><span className="xp"><Icon name="bolt" size={14} /> +{xp} XP</span></div>
        )}

        <div className="step-actions wp-actions">
          {done ? (
            <button className="btn primary block icon-text" onClick={onNext} autoFocus>
              Next exercise <Icon name="arrowRight" size={18} />
            </button>
          ) : (
            <>
              <button className="btn icon-text" onClick={() => setHinted(true)} disabled={hinted || busy}
                title="Using the hint counts this exercise as a miss">
                <Icon name="hint" size={18} /> Hint
              </button>
              <button className="btn icon-text" onClick={giveUp} disabled={busy}>
                <Icon name="eye" size={18} /> Show solution
              </button>
            </>
          )}
        </div>
      </aside>
    </div>
  );
}
