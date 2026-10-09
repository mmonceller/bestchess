import { useEffect, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { useChessGame } from '../../../hooks/useChessGame.js';
import { engine } from '../../../engine/engineClient.js';
import { toUci, uciLineToSan } from '../../../chess/status.js';
import { PATTERNS } from '../../../training/patterns/patterns.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';
import { solvesPuzzle } from '../../../training/puzzles/judgeMove.js';
import { findRefutation, refutationText } from '../../../training/puzzles/refutation/index.js';

const MATE_PATTERNS = new Set(['mate1', 'mate2', 'backRank']);
const PRAISE = ['Solved!', 'Nicely spotted!', 'That\'s the one!', 'Sharp eyes!'];
const pick = (a) => a[Math.floor(Math.random() * a.length)];

/*
 * One puzzle. The student plays the even moves of `puzzle.moves`; replies are automatic.
 * Any checkmate solves a mate puzzle, and other strong alternatives are engine-checked.
 * After a miss the solution arrow appears and the student can play it through.
 */
export default function PuzzlePlay({ puzzle, onResult, onNext }) {
  const game = useChessGame(puzzle.fen);
  const me = puzzle.fen.split(' ')[1];
  const pattern = PATTERNS[puzzle.pattern];
  const [ply, setPly] = useState(0);
  const [status, setStatus] = useState('solving');
  const [busy, setBusy] = useState(false);
  const [hint, setHint] = useState(0);
  const [note, setNote] = useState(null);
  const [result, setResult] = useState(null);
  const timers = useRef([]);
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => { alive.current = false; timers.current.forEach(clearTimeout); };
  }, []);
  const later = (fn, ms) => timers.current.push(setTimeout(() => { if (alive.current) fn(); }, ms));

  function settle(solved, tone, text) {
    setResult(onResult({ solved, usedHint: hint > 0 }));
    setStatus(solved ? 'solved' : 'failed');
    setNote({ tone, text });
    if (solved) sounds.good(); else sounds.bad();
  }

  function advance(onMainLine) {
    const reply = puzzle.moves[ply + 1];
    if (!onMainLine || !reply) {
      if (status === 'failed') {
        setStatus('reviewed');
        setNote({ tone: 'ok', text: 'Now you\'ve seen the idea — it will be easier to spot next time.' });
      } else {
        settle(true, 'good', pick(PRAISE));
      }
      return;
    }
    setBusy(true);
    if (status === 'solving') setNote({ tone: 'good', text: 'Good move! Keep going…' });
    later(() => {
      playMoveSound(game.move(reply));
      setBusy(false);
      setPly((p) => p + 2);
    }, 550);
  }

  async function onMove(m) {
    if (busy || status === 'solved' || status === 'reviewed') return;
    const before = game.fen;
    const mv = game.move(m);
    if (!mv) return;
    playMoveSound(mv);
    const uci = toUci(mv);
    const expected = puzzle.moves[ply];

    if (uci === expected || (MATE_PATTERNS.has(puzzle.pattern) && game.chess.isCheckmate())) {
      advance(uci === expected);
      return;
    }
    if (status === 'failed') {
      setBusy(true);
      setNote({ tone: 'ok', text: 'Follow the blue arrow to see how the trick works.' });
      later(() => { game.undo(); setBusy(false); }, 600);
      return;
    }

    setBusy(true);
    setNote({ tone: 'ok', text: 'Checking your idea…' });
    let graded = null;
    try { graded = await engine.grade(before, uci, 1200); } catch { /* treat as a miss */ }
    if (!alive.current) return;
    if (solvesPuzzle(graded, { mate: MATE_PATTERNS.has(puzzle.pattern) })) {
      setBusy(false);
      settle(true, 'good', `That works too! (The puzzle's main idea was [[${uciLineToSan(Chess, before, [expected])[0]}]].)`);
      return;
    }
    const refutation = await findRefutation(game.fen, mv);
    if (!alive.current) return;
    setBusy(false);
    const opponent = me === 'w' ? 'Black' : 'White';
    settle(false, 'bad', `[[${mv.san}]] isn't it.${refutationText(refutation, opponent)} The blue arrow shows the answer — play it to see why.`);
    setBusy(true);
    later(() => { game.undo(); setBusy(false); }, 700);
  }

  const expected = puzzle.moves[ply];
  const showAnswer = status === 'failed' && !busy;
  const arrows = showAnswer ? [{ from: expected.slice(0, 2), to: expected.slice(2, 4), color: 'blue' }] : undefined;
  const highlights = hint >= 2 && status === 'solving' ? { [expected.slice(0, 2)]: 'hint' } : undefined;
  const canMove = !busy && (status === 'solving' || status === 'failed') && game.turn === me;
  const done = status === 'solved' || status === 'failed' || status === 'reviewed';

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
          highlights={highlights}
        />
      </div>
      <aside className="side-panel puzzle-panel">
        <div className="puzzle-turn">
          <span className={`turn-dot ${me === 'w' ? 'white' : 'black'}`} />
          <div>
            <b>{me === 'w' ? 'White' : 'Black'} to move</b>
            <div className="muted small">
              {puzzle.moves.length > 1 ? 'Find the best move — there may be a follow-up.' : 'Find the best move.'}
            </div>
          </div>
          <span className="badge puzzle-level" title="Puzzle difficulty">{puzzle.rating}</span>
        </div>

        {!done && hint === 0 && (
          <div className="puzzle-question">
            <Icon name="question" size={22} />
            <p>What's the trick here? Look for checks, captures and threats.</p>
          </div>
        )}
        {(hint >= 1 || done) && <PatternBadge pattern={pattern} reveal={done} />}

        {note && <Notice tone={note.tone} key={note.text}>{note.text}</Notice>}

        {result && (
          <div className="puzzle-result pop-in">
            <span className={`delta ${result.delta >= 0 ? 'up' : 'down'}`}>
              <Icon name={result.delta >= 0 ? 'arrowRight' : 'arrowLeft'} size={14} />
              {result.delta >= 0 ? '+' : ''}{result.delta} rating
            </span>
            <span className="xp"><Icon name="bolt" size={14} /> +{result.xp} XP</span>
            {result.newlyUnlocked.map((id) => (
              <span key={id} className="unlock"><Icon name="sparkle" size={14} /> New pattern: {PATTERNS[id].name}</span>
            ))}
          </div>
        )}

        <div className="step-actions">
          {done ? (
            <button className="btn primary block icon-text" onClick={onNext} autoFocus>
              Next puzzle <Icon name="arrowRight" size={18} />
            </button>
          ) : (
            <button className="btn block icon-text" onClick={() => setHint((h) => Math.min(2, h + 1))} disabled={hint >= 2 || busy}>
              <Icon name="hint" size={18} /> {hint === 0 ? 'Hint: what pattern is it?' : 'Show me which piece'}
            </button>
          )}
        </div>
      </aside>
    </div>
  );
}

function PatternBadge({ pattern, reveal }) {
  return (
    <div className="pattern-badge pop-in" style={{ '--c': pattern.color }}>
      <span className="pattern-icon"><Icon name={pattern.icon} size={24} /></span>
      <div>
        <span className="muted small">Pattern</span>
        <b>{pattern.name}</b>
        <p>{reveal ? pattern.lesson : pattern.clue}</p>
      </div>
    </div>
  );
}
