import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.jsx';
import MoveList from '../../components/game/MoveList.jsx';
import Icon from '../../components/icons/Icon.jsx';
import { kingSquare } from '../../components/board/pieces.js';
import { formatDate } from '../../utils/format.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLessonMemory } from '../../training/hints/useLessonMemory.js';
import { replayPgn } from '../../review/analyzeGame.js';
import { useGameReview } from './useGameReview.js';
import ReviewSummary from './components/ReviewSummary.jsx';
import MoveComment from './components/MoveComment.jsx';
import '../../components/game/game.css';
import './review.css';

const RESULT_LABEL = { win: 'WIN', loss: 'LOSS', draw: 'DRAW' };
const SLIPS = new Set(['inaccuracy', 'mistake', 'blunder']);
const moveNo = (ply) => `${Math.floor(ply / 2) + 1}.${ply % 2 ? '..' : ''} `;

function SaveNote({ state }) {
  if (state === 'saved') return <p className="small muted icon-text"><Icon name="checkCircle" size={15} /> Saved to your game history.</p>;
  if (state === 'saving') return <p className="small muted">Saving review…</p>;
  if (state === 'error') return <p className="small error-text">Could not save this review. It is still shown here until you leave.</p>;
  if (state === 'guest') return <p className="small muted">You are playing as a guest, so this review disappears when you leave. <a className="link" href="#/login">Log in</a> to keep your reviews.</p>;
  if (state === 'unsaved') return <p className="small muted">This game was not saved to your account, so the review is only shown here.</p>;
  return null;
}

export default function GameReviewPage({ gameId, autoStart }) {
  const { user } = useAuth();
  const { game, error, review, progress, saveState, start } = useGameReview(gameId, autoStart);
  const lessonFor = useLessonMemory();
  const [ply, setPly] = useState(-1);
  const [flipped, setFlipped] = useState(false);
  const [showBetter, setShowBetter] = useState(false);

  const replay = useMemo(() => (game ? replayPgn(game.pgn) : null), [game]);
  const byPly = useMemo(() => new Map((review?.moves || []).map((m) => [m.ply, m])), [review]);
  const marks = useMemo(() => Object.fromEntries((review?.moves || []).map((m) => [m.ply, m.kind])), [review]);
  const last = replay ? replay.moves.length - 1 : -1;

  useEffect(() => { if (replay && !autoStart) setPly(replay.moves.length - 1); }, [replay, autoStart]);
  useEffect(() => { setShowBetter(false); }, [ply]);

  useEffect(() => {
    if (!replay) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setPly((p) => Math.max(-1, p - 1));
      if (e.key === 'ArrowRight') setPly((p) => Math.min(last, p + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [replay, last]);

  if (error && !game) return <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}><p>{error}</p><a className="btn" href={user ? '#/profile' : '#/'}>Back</a></div>;
  if (!game || !replay) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  const item = byPly.get(ply);
  const move = replay.moves[ply];
  const better = showBetter && item?.best;
  const fen = better ? replay.fens[ply] : replay.fens[ply + 1];
  const c = new Chess(fen);
  const check = c.inCheck() ? kingSquare(fen, c.turn()) : null;
  const base = game.color === 'b' ? 'black' : 'white';
  const orientation = flipped ? (base === 'white' ? 'black' : 'white') : base;

  let arrows;
  if (better) {
    arrows = [
      { from: item.uci.slice(0, 2), to: item.uci.slice(2, 4), color: 'orange' },
      { from: item.best.slice(0, 2), to: item.best.slice(2, 4), color: 'green' },
    ];
  } else if (item?.reply) {
    arrows = [{ from: item.reply.slice(0, 2), to: item.reply.slice(2, 4), color: 'red' }];
  }

  const nextSlip = () => {
    const slips = review.moves.filter((m) => SLIPS.has(m.kind));
    const next = slips.find((m) => m.ply > ply) || slips[0];
    if (next) setPly(next.ply);
  };
  const playerMoves = replay.moves.filter((m) => m.color === game.color).length;

  return (
    <div className="game-layout review-page fade-in">
      <div className="board-column">
        <Board
          fen={fen}
          orientation={orientation}
          lastMove={!better && move ? { from: move.from, to: move.to } : null}
          checkSquare={check}
          arrows={arrows}
        />
        <div className="replay-controls">
          <button className="btn" onClick={() => setPly(-1)} disabled={ply < 0} aria-label="First move"><Icon name="first" size={18} /></button>
          <button className="btn" onClick={() => setPly((p) => Math.max(-1, p - 1))} disabled={ply < 0} aria-label="Previous move"><Icon name="prev" size={18} /></button>
          <button className="btn" onClick={() => setPly((p) => Math.min(last, p + 1))} disabled={ply >= last} aria-label="Next move"><Icon name="next" size={18} /></button>
          <button className="btn" onClick={() => setPly(last)} disabled={ply >= last} aria-label="Last move"><Icon name="last" size={18} /></button>
          <button className="btn" onClick={() => setFlipped((f) => !f)} aria-label="Flip board"><Icon name="flip" size={18} /></button>
        </div>
      </div>

      <aside className="side-panel">
        <div className="card">
          <a href={gameId ? '#/profile' : `#/${game.mode === 'online' ? 'online' : 'computer'}`} className="muted small icon-text">
            <Icon name="arrowLeft" size={14} /> {gameId ? 'Back to my games' : 'Back to playing'}
          </a>
          <h2 style={{ marginTop: 6 }}>Game review</h2>
          <div className="row">
            <span className={`result-pill ${game.result}`}>{RESULT_LABEL[game.result] || ''}</span>
            <span className="muted small">vs {game.opponent}{game.date ? ` · ${formatDate(game.date)}` : ''}{game.reason ? ` · ${game.reason}` : ''}</span>
          </div>
          <SaveNote state={saveState} />
        </div>

        {!review && !progress && (
          <div className="card review-cta">
            <h3 className="icon-text"><Icon name="bot" size={20} /> Go over this game with your coach</h3>
            <p className="muted">
              The coach checks each of your {playerMoves} moves, explains what it did, and shows a better move whenever there was one.
              This takes about {Math.max(5, Math.round(playerMoves * 1.1))} seconds.
            </p>
            {error && <p className="small error-text">{error}</p>}
            <button className="btn primary block icon-text" onClick={start} disabled={!playerMoves}>
              <Icon name="play" size={18} /> {playerMoves ? 'Start game review' : 'No moves to review'}
            </button>
          </div>
        )}

        {progress && (
          <div className="card review-progress">
            <div className="row"><span className="spinner" /> <b>Reviewing your moves…</b></div>
            <div className="progress-track"><span style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} /></div>
            <span className="muted small">{progress.total ? `Move ${Math.min(progress.done + 1, progress.total)} of ${progress.total}` : 'Getting started'}</span>
          </div>
        )}

        {review && ply < 0 && <ReviewSummary review={review} currentPly={ply} onSelect={setPly} onNextMistake={nextSlip} />}

        {review && item && (
          <MoveComment
            item={item}
            moveNumber={moveNo(item.ply)}
            showBetter={showBetter}
            onToggleBetter={() => setShowBetter((v) => !v)}
            lesson={lessonFor({ tags: item.tags, piece: item.piece, san: item.bestLine?.[0] || item.san })}
          />
        )}

        {review && move && !item && (
          <div className="card move-comment tone-neutral">
            <p className="muted" style={{ margin: 0 }}>
              {move.color === game.color ? 'Your move' : 'Your opponent played'} <b>{moveNo(ply)}{move.san}</b>.
              {move.color !== game.color && ply < last && ' Step forward to see how you answered.'}
            </p>
          </div>
        )}

        {review && ply >= 0 && (
          <div className="row review-nav">
            <button className="btn small icon-text" onClick={() => setPly(-1)}><Icon name="trophy" size={16} /> Summary</button>
            {review.summary.counts && (review.summary.counts.inaccuracy + review.summary.counts.mistake + review.summary.counts.blunder) > 0 && (
              <button className="btn small icon-text" onClick={nextSlip}><Icon name="target" size={16} /> Next slip</button>
            )}
          </div>
        )}

        <div className="card">
          <h3>Moves</h3>
          <MoveList moves={replay.moves.map((m) => m.san)} current={ply} onSelect={setPly} marks={marks} />
        </div>
      </aside>
    </div>
  );
}
