import { useCallback, useEffect, useMemo, useState } from 'react';
import { Chess } from 'chess.js';
import Board from '../../components/board/Board.jsx';
import PlayerBar from '../../components/game/PlayerBar.jsx';
import MoveList from '../../components/game/MoveList.jsx';
import HintCard from '../../components/game/HintCard.jsx';
import Modal from '../../components/ui/Modal.jsx';
import Notice from '../../components/game/Notice.jsx';
import Icon from '../../components/icons/Icon.jsx';
import WaitingRoom from './WaitingRoom.jsx';
import ChatBox from './ChatBox.jsx';
import { online } from '../../api/onlineSocket.js';
import { useOnlineGame } from './useOnlineGame.js';
import { useHint } from '../../hooks/useHint.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useLessonMemory } from '../../training/hints/useLessonMemory.js';
import { kingSquare } from '../../components/board/pieces.js';
import { materialInfo } from '../../chess/material.js';
import { resultText } from '../../chess/status.js';
import { playMoveSound } from '../../utils/sound.js';
import { getGuestName } from './guestName.js';
import { stashGame } from '../../review/pendingReview.js';
import { navigate } from '../../router/router.js';
import '../../components/game/game.css';

export default function OnlineGame({ code }) {
  const { user, refresh } = useAuth();
  const { state, error, connection, clocks } = useOnlineGame(code, user?.username || getGuestName());
  const hint = useHint();
  const lessonFor = useLessonMemory();
  const [optimistic, setOptimistic] = useState(null);
  const [confirmResign, setConfirmResign] = useState(false);
  const [dismissedResult, setDismissedResult] = useState(false);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => { setOptimistic(null); }, [state]);
  useEffect(() => { hint.clear(); }, [state?.fen]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (state?.status === 'playing') setDismissedResult(false); }, [state?.status]);
  useEffect(() => { if (user && state?.status === 'over') refresh(); }, [state?.status]); // eslint-disable-line react-hooks/exhaustive-deps

  const fen = optimistic?.fen || state?.fen || new Chess().fen();
  const chess = useMemo(() => new Chess(fen), [fen]);
  const getMoves = useCallback((sq) => chess.moves({ square: sq, verbose: true }), [chess]);

  if (error?.code === 'not-found') {
    return (
      <div className="card center fade-in" style={{ maxWidth: 420, margin: '30px auto' }}>
        <h2>Game not found</h2>
        <p className="muted">{error.message}</p>
        <a className="btn primary" href="#/online">Back to lobby</a>
      </div>
    );
  }
  if (!state) {
    return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /> Connecting to game {code}…</div>;
  }

  const you = state.you;
  const seated = you === 'w' || you === 'b';
  const playing = state.status === 'playing';
  const myTurn = seated && playing && state.turn === you && !optimistic;
  const baseOrientation = you === 'b' ? 'black' : 'white';
  const orientation = flipped ? (baseOrientation === 'white' ? 'black' : 'white') : baseOrientation;
  const them = you === 'w' ? 'b' : 'w';
  const material = materialInfo(fen);
  const lastMove = optimistic?.lastMove || state.lastMove;
  const checkSquare = chess.inCheck() ? kingSquare(fen, chess.turn()) : null;

  function onMove(m) {
    if (!myTurn) return;
    const c = new Chess(state.fen);
    let mv;
    try { mv = c.move(m); } catch { return; }
    playMoveSound(mv);
    setOptimistic({ fen: c.fen(), lastMove: { from: mv.from, to: mv.to } });
    online.move(mv.from + mv.to + (mv.promotion || ''));
  }

  const seatBar = (c) => {
    const info = c === 'w' ? state.white : state.black;
    const adv = Math.max(0, c === 'w' ? material.balance : -material.balance);
    const label = info ? `${info.name}${c === you ? ' (you)' : ''}` : 'Waiting for player…';
    return (
      <PlayerBar
        name={label}
        sub={info?.rating ? String(info.rating) : info ? 'Guest' : ''}
        color={c}
        captured={material.captured[c]}
        advantage={adv}
        clock={clocks ? clocks[c] : null}
        active={playing && state.turn === c}
        connected={info ? info.connected : undefined}
      />
    );
  };

  const topColor = orientation === 'white' ? 'b' : 'w';
  const res = state.status === 'over' && state.result && resultText(state.result.winner, state.result.reason, you);
  const opponentOfferedDraw = playing && seated && state.drawOffer === them;
  const iOfferedDraw = playing && seated && state.drawOffer === you;

  function openReview() {
    const { winner, reason } = state.result;
    const opp = them === 'w' ? state.white : state.black;
    stashGame({
      pgn: state.pgn,
      color: you,
      opponent: opp?.name || 'Opponent',
      result: winner === null ? 'draw' : winner === you ? 'win' : 'loss',
      reason,
      mode: 'online',
      date: Date.now(),
    });
    navigate(state.gameId ? `/review/${state.gameId}?start=1` : '/review?start=1');
  }
  const canReview = seated && state.status === 'over' && state.history.length > 1;
  const reviewButton = canReview && (
    <button className="btn good icon-text" onClick={openReview}><Icon name="target" size={18} /> Game review</button>
  );

  return (
    <div className="game-layout fade-in">
      <div className="board-column">
        {seatBar(topColor)}
        <Board
          fen={fen}
          orientation={orientation}
          movableColor={myTurn ? you : null}
          getMoves={getMoves}
          onMove={onMove}
          lastMove={lastMove}
          checkSquare={checkSquare}
          arrows={hint.hint ? [hint.hint.arrow] : undefined}
        />
        {seatBar(topColor === 'w' ? 'b' : 'w')}
      </div>

      <aside className="side-panel">
        {connection !== 'open' && <Notice tone="ok" icon="retry">Reconnecting…</Notice>}
        {state.status === 'waiting' && <WaitingRoom code={code} options={state.options} />}
        {!seated && <Notice tone="ok" icon="eye">You are watching this game.</Notice>}

        {opponentOfferedDraw && (
          <div className="feedback ok row">
            <span>Your opponent offers a draw.</span>
            <span className="spacer" />
            <button className="btn small good" onClick={online.offerDraw}>Accept</button>
            <button className="btn small" onClick={online.declineDraw}>Decline</button>
          </div>
        )}
        {state.canClaim && (
          <div className="feedback bad row">
            <span>Your opponent left the game.</span>
            <span className="spacer" />
            <button className="btn small" onClick={online.claim}>Claim win</button>
          </div>
        )}

        {res && (
          <div className="card center">
            <div className="result-big">{res.title}</div>
            <p className="muted">{res.detail}</p>
            {seated && (
              <div className="row" style={{ justifyContent: 'center', flexWrap: 'wrap' }}>
                {reviewButton}
                <button className="btn primary" onClick={online.rematch} disabled={state.rematch?.[you]}>
                  {state.rematch?.[you] ? 'Waiting for opponent…' : state.rematch?.[them] ? 'Accept rematch' : 'Rematch'}
                </button>
              </div>
            )}
          </div>
        )}

        {seated && playing && (
          <div className="card">
            <div className="controls">
              {state.options.allowHints && (
                <button className="btn primary" disabled={!myTurn || hint.loading} onClick={() => hint.request(state.fen, [], 1000)}><Icon name="hint" size={18} /> Hint</button>
              )}
              <button className="btn" onClick={online.offerDraw} disabled={iOfferedDraw || state.history.length < 2}>
                <Icon name="draw" size={18} /> {iOfferedDraw ? 'Draw offered' : 'Offer a draw'}
              </button>
              <button className="btn danger" onClick={() => setConfirmResign(true)}><Icon name="flag" size={18} /> Resign</button>
              <button className="btn" onClick={() => setFlipped((f) => !f)} aria-label="Flip board"><Icon name="flip" size={18} /></button>
            </div>
          </div>
        )}

        <HintCard hint={hint.hint} loading={hint.loading} onClose={hint.clear} lesson={lessonFor(hint.hint)} reviewLink={false} />

        <div className="card">
          <div className="row"><h3 style={{ margin: 0 }}>Moves</h3><span className="spacer" /><span className="badge">Code {code}</span></div>
          <div style={{ marginTop: 8 }}><MoveList moves={state.history} /></div>
        </div>

        {state.white && state.black && <ChatBox messages={state.chat} canSend={seated} you={you} />}
      </aside>

      {confirmResign && (
        <Modal onClose={() => setConfirmResign(false)}>
          <h2>Resign this game?</h2>
          <div className="row" style={{ marginTop: 12 }}>
            <span className="spacer" />
            <button className="btn" onClick={() => setConfirmResign(false)}>Keep playing</button>
            <button className="btn danger" onClick={() => { online.resign(); setConfirmResign(false); }}>Resign</button>
          </div>
        </Modal>
      )}

      {res && !dismissedResult && seated && (
        <Modal onClose={() => setDismissedResult(true)}>
          <div className="center">
            <div className="result-big">{res.title}</div>
            <p className="muted">{res.detail}</p>
            {!user && <p className="small muted">Log in next time to save games and earn a rating.</p>}
            <div className="row" style={{ justifyContent: 'center', marginTop: 10, flexWrap: 'wrap' }}>
              {reviewButton}
              <button className="btn primary" onClick={() => { online.rematch(); setDismissedResult(true); }}>Rematch</button>
              <button className="btn" onClick={() => setDismissedResult(true)}>Close</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
