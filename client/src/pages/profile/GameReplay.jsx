import { useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.jsx';
import MoveList from '../../components/game/MoveList.jsx';
import HintCard from '../../components/game/HintCard.jsx';
import { gamesApi } from '../../api/endpoints.js';
import { useHint } from '../../hooks/useHint.js';
import { useLessonMemory } from '../../training/hints/useLessonMemory.js';
import { kingSquare } from '../../components/board/pieces.js';
import { formatDate } from '../../utils/format.js';
import Icon from '../../components/icons/Icon.jsx';
import '../../components/game/game.css';
import './profile.css';

export default function GameReplay({ gameId }) {
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [ply, setPly] = useState(-1);
  const [flipped, setFlipped] = useState(false);
  const hint = useHint();
  const lessonFor = useLessonMemory();

  useEffect(() => {
    gamesApi.get(gameId).then((d) => setGame(d.game)).catch((e) => setError(e.message));
  }, [gameId]);

  const replay = useMemo(() => {
    if (!game) return null;
    const c = new Chess();
    try { c.loadPgn(game.pgn); } catch { return { moves: [], fens: [new Chess().fen()] }; }
    const moves = c.history({ verbose: true });
    return { moves, fens: [moves[0]?.before || c.fen(), ...moves.map((m) => m.after)] };
  }, [game]);

  useEffect(() => { if (replay) setPly(replay.moves.length - 1); }, [replay]);
  useEffect(() => { hint.clear(); }, [ply]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!replay) return undefined;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') setPly((p) => Math.max(-1, p - 1));
      if (e.key === 'ArrowRight') setPly((p) => Math.min(replay.moves.length - 1, p + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [replay]);

  if (error) return <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}><p>{error}</p><a className="btn" href="#/profile">Back</a></div>;
  if (!game || !replay) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  const fen = replay.fens[ply + 1];
  const move = replay.moves[ply];
  const c = new Chess(fen);
  const check = c.inCheck() ? kingSquare(fen, c.turn()) : null;
  const base = game.color === 'b' ? 'black' : 'white';
  const orientation = flipped ? (base === 'white' ? 'black' : 'white') : base;
  const last = replay.moves.length - 1;

  return (
    <div className="game-layout fade-in">
      <div className="board-column">
        <Board fen={fen} orientation={orientation} lastMove={move ? { from: move.from, to: move.to } : null} checkSquare={check} arrows={hint.hint ? [hint.hint.arrow] : undefined} />
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
          <a href="#/profile" className="muted small icon-text"><Icon name="arrowLeft" size={14} /> Back to profile</a>
          <h2 style={{ marginTop: 6 }}>vs {game.opponent}</h2>
          <div className="row">
            <span className={`result-pill ${game.result}`}>{game.result.toUpperCase()}</span>
            <span className="muted small">{formatDate(game.date)} · {game.reason} · {game.mode}</span>
          </div>
        </div>
        <button className="btn primary" disabled={c.isGameOver() || hint.loading} onClick={() => hint.request(fen, [], 1500)}>
          <Icon name="bot" size={18} /> What was the best move here?
        </button>
        <HintCard hint={hint.hint} loading={hint.loading} onClose={hint.clear} title="AI review" lesson={lessonFor(hint.hint)} />
        <div className="card">
          <h3>Moves</h3>
          <MoveList moves={replay.moves.map((m) => m.san)} current={ply} onSelect={setPly} />
        </div>
      </aside>
    </div>
  );
}
