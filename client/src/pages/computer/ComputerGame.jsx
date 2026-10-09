import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.jsx';
import PlayerBar from '../../components/game/PlayerBar.jsx';
import MoveList from '../../components/game/MoveList.jsx';
import HintCard from '../../components/game/HintCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Notice from '../../components/game/Notice.jsx';
import Icon from '../../components/icons/Icon.jsx';
import { useChessGame } from '../../hooks/useChessGame.js';
import { useHint } from '../../hooks/useHint.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLessonMemory } from '../../training/hints/useLessonMemory.js';
import { engine } from '../../engine/engineClient.js';
import { getLevel } from '../../engine/levels.js';
import { gamesApi } from '../../api/endpoints.js';
import { materialInfo } from '../../chess/material.js';
import { resultText, toUci, uciLineToSan } from '../../chess/status.js';
import { playMoveSound, sounds } from '../../utils/sound.js';
import { saveGame, clearSavedGame } from './savedGame.js';
import '../../components/game/game.css';
import './computer.css';

const COACH_KEY = 'bc.coachMode';

function classify(g, fen) {
  const bestSan = uciLineToSan(Chess, fen, [g.best])[0];
  const why = g.explanation?.reasons?.[0] || '';
  if (g.loss <= 15) return { tone: 'good', icon: 'sparkle', text: g.loss === 0 ? 'Best move!' : 'Excellent move.' };
  if (g.loss <= 60) return { tone: 'good', icon: 'checkCircle', text: `Good move. ${bestSan} was slightly better.` };
  if (g.loss <= 140) return { tone: 'ok', icon: 'info', text: `Not the best. ${bestSan} was stronger. ${why}` };
  if (g.loss <= 300) return { tone: 'bad', icon: 'warning', text: `Mistake. Try ${bestSan} next time. ${why}` };
  return { tone: 'bad', icon: 'xCircle', text: `Big mistake! ${bestSan} was much stronger. ${why}` };
}

export default function ComputerGame({ color, level, initialPgn, onNewGame, onRematch }) {
  const game = useChessGame(undefined, initialPgn);
  const { user } = useAuth();
  const lvl = getLevel(level);
  const hint = useHint();
  const lessonFor = useLessonMemory();
  const [orientation, setOrientation] = useState(color === 'w' ? 'white' : 'black');
  const [thinking, setThinking] = useState(false);
  const [resigned, setResigned] = useState(null);
  const [coachMode, setCoachMode] = useState(() => localStorage.getItem(COACH_KEY) === '1');
  const [feedback, setFeedback] = useState(null);
  const [showEnd, setShowEnd] = useState(false);
  const [saveState, setSaveState] = useState(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const token = useRef(0);
  const savedRef = useRef(false);

  const result = resigned || (game.status.over ? { winner: game.status.winner, reason: game.status.reason } : null);
  const over = Boolean(result);
  const engineTurn = !over && game.turn !== color;
  const userMoves = game.history.filter((h) => h.color === color).length;

  useEffect(() => () => { token.current++; engine.cancel(); }, []);

  useEffect(() => {
    if (!engineTurn) return;
    const my = ++token.current;
    setThinking(true);
    const started = Date.now();
    engine.move(game.fen, level, game.positionsBefore)
      .then((res) => {
        if (my !== token.current || !res) return;
        const wait = Math.max(0, 350 - (Date.now() - started));
        setTimeout(() => {
          if (my !== token.current) return;
          playMoveSound(game.move(res.uci));
          setThinking(false);
        }, wait);
      })
      .catch(() => { if (my === token.current) setThinking(false); });
  }, [engineTurn, game.fen]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (over) return;
    const c = game.chess;
    c.setHeader('Event', 'BestChess vs Computer');
    c.setHeader('White', color === 'w' ? user?.username || 'You' : `${lvl.name} (Lv ${lvl.id})`);
    c.setHeader('Black', color === 'b' ? user?.username || 'You' : `${lvl.name} (Lv ${lvl.id})`);
    if (game.history.length) saveGame({ pgn: c.pgn(), color, level });
  }, [game.fen, over]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!over || savedRef.current) return;
    savedRef.current = true;
    sounds.end();
    setShowEnd(true);
    clearSavedGame();
    if (!user) { setSaveState('guest'); return; }
    const c = game.chess;
    const outcome = result.winner === null ? 'draw' : result.winner === color ? 'win' : 'loss';
    c.setHeader('Result', result.winner === 'w' ? '1-0' : result.winner === 'b' ? '0-1' : '1/2-1/2');
    setSaveState('saving');
    gamesApi.saveComputerGame({
      opponent: `${lvl.name} (Lv ${lvl.id})`,
      color,
      result: outcome,
      reason: result.reason,
      pgn: c.pgn(),
      moves: game.history.length,
      level,
    }).then(() => setSaveState('saved')).catch(() => setSaveState('error'));
  }, [over]); // eslint-disable-line react-hooks/exhaustive-deps

  const onMove = useCallback((m) => {
    if (over || game.turn !== color || thinking) return;
    const before = game.fen;
    const mv = game.move(m);
    if (!mv) return;
    playMoveSound(mv);
    hint.clear();
    setFeedback(null);
    if (coachMode) {
      engine.grade(before, toUci(mv), 700)
        .then((g) => { if (g.legal) setFeedback(classify(g, before)); })
        .catch(() => {});
    }
  }, [over, game, color, thinking, coachMode, hint]);

  function takeBack() {
    if (!userMoves) return;
    token.current++;
    if (thinking) engine.cancel();
    setThinking(false);
    hint.clear();
    setFeedback(null);
    game.undo(Math.min(game.turn === color ? 2 : 1, game.history.length));
  }

  function toggleCoach() {
    const v = !coachMode;
    setCoachMode(v);
    localStorage.setItem(COACH_KEY, v ? '1' : '0');
  }

  const material = useMemo(() => materialInfo(game.fen), [game.fen]);
  const me = color;
  const them = color === 'w' ? 'b' : 'w';
  const adv = (c) => Math.max(0, c === 'w' ? material.balance : -material.balance);
  const sanList = game.history.map((h) => h.san);
  const res = result && resultText(result.winner, result.reason, color);
  const topColor = orientation === 'white' ? 'b' : 'w';
  const bar = (c) => (c === me
    ? <PlayerBar name={user?.username || 'You'} sub={user ? `${user.rating}` : 'Guest'} color={c} captured={material.captured[c]} advantage={adv(c)} active={!over && game.turn === c} />
    : <PlayerBar name={lvl.name} icon={lvl.icon} tint={lvl.tint} sub={`Level ${lvl.id} · ${lvl.elo}`} color={c} captured={material.captured[c]} advantage={adv(c)} active={!over && game.turn === c} thinking={thinking} />);

  return (
    <div className="game-layout fade-in">
      <div className="board-column">
        {bar(topColor)}
        <Board
          fen={game.fen}
          orientation={orientation}
          movableColor={!over && !thinking && game.turn === color ? color : null}
          getMoves={game.getMoves}
          onMove={onMove}
          lastMove={game.lastMove}
          checkSquare={game.checkSquare}
          arrows={hint.hint ? [hint.hint.arrow] : undefined}
        />
        {bar(topColor === 'w' ? 'b' : 'w')}
      </div>

      <aside className="side-panel">
        <div className="card">
          <div className="controls">
            <button className="btn primary" onClick={() => hint.request(game.fen, game.positionsBefore)} disabled={over || thinking || game.turn !== color || hint.loading}>
              <Icon name="hint" size={18} /> Hint
            </button>
            <button className="btn" onClick={takeBack} disabled={!userMoves || Boolean(resigned)}><Icon name="undo" size={18} /> Undo</button>
            <button className="btn" onClick={() => setOrientation((o) => (o === 'white' ? 'black' : 'white'))}><Icon name="flip" size={18} /> Flip</button>
          </div>
          <div className="row" style={{ marginTop: 10 }}>
            <label className="toggle-inline">
              <input type="checkbox" checked={coachMode} onChange={toggleCoach} />
              Coach feedback on my moves
            </label>
          </div>
        </div>

        <HintCard hint={hint.hint} loading={hint.loading} onClose={hint.clear} lesson={lessonFor(hint.hint)} />
        {feedback && <Notice tone={feedback.tone} icon={feedback.icon} className="fade-in">{feedback.text}</Notice>}

        <div className="card">
          <h3>Moves</h3>
          <MoveList moves={sanList} />
        </div>

        <div className="controls">
          {over ? (
            <>
              <button className="btn primary" onClick={onRematch}>Play again</button>
              <button className="btn" onClick={onNewGame}>Change settings</button>
            </>
          ) : (
            <>
              <button className="btn danger" onClick={() => setConfirmResign(true)} disabled={!game.history.length}><Icon name="flag" size={18} /> Resign</button>
              <button className="btn" onClick={onNewGame}>New game</button>
            </>
          )}
        </div>
      </aside>

      {confirmResign && (
        <Modal onClose={() => setConfirmResign(false)}>
          <h2>Resign this game?</h2>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="spacer" />
            <button className="btn" onClick={() => setConfirmResign(false)}>Keep playing</button>
            <button className="btn danger" onClick={() => { setResigned({ winner: them, reason: 'resignation' }); setConfirmResign(false); token.current++; setThinking(false); }}>Resign</button>
          </div>
        </Modal>
      )}

      {showEnd && res && (
        <Modal onClose={() => setShowEnd(false)}>
          <div className="center">
            <div className="result-big">{res.title}</div>
            <p className="muted">{res.detail}</p>
            <p className="small muted">
              {saveState === 'saved' && <span className="icon-text"><Icon name="checkCircle" size={16} /> Saved to your profile.</span>}
              {saveState === 'saving' && 'Saving…'}
              {saveState === 'error' && 'Could not save this game.'}
              {saveState === 'guest' && <>Log in to keep a record of your games. <a href="#/login" style={{ color: 'var(--accent-2)' }}>Log in</a></>}
            </p>
            <div className="row" style={{ justifyContent: 'center', marginTop: 12 }}>
              <button className="btn primary" onClick={onRematch}>Play again</button>
              <button className="btn" onClick={() => setShowEnd(false)}>View board</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
