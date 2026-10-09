import { useEffect, useRef, useState } from 'react';
import { online } from '../../api/onlineSocket.js';
import { playMoveSound, sounds } from '../../utils/sound.js';

/* Subscribes to a game room and keeps a locally ticking copy of the clocks. */
export function useOnlineGame(code, name) {
  const [state, setState] = useState(null);
  const [error, setError] = useState(null);
  const [connection, setConnection] = useState(online.status());
  const [now, setNow] = useState(Date.now());
  const receivedAt = useRef(Date.now());
  const prevLen = useRef(null);
  const prevStatus = useRef(null);

  useEffect(() => {
    const unsub = online.subscribe((msg) => {
      if (msg.t === 'state' && msg.state.code === code) {
        receivedAt.current = Date.now();
        const len = msg.state.history.length;
        const opponentMoved = msg.state.you === 'spectator' || msg.state.turn === msg.state.you;
        if (prevLen.current !== null && len > prevLen.current && opponentMoved) {
          const san = msg.state.history[len - 1];
          playMoveSound({ san, captured: san.includes('x') });
        }
        if (msg.state.status === 'over' && prevStatus.current === 'playing') sounds.end();
        prevStatus.current = msg.state.status;
        prevLen.current = len;
        setState(msg.state);
        setError(null);
      } else if (msg.t === 'error') {
        setError(msg);
      } else if (msg.t === 'connection') {
        setConnection(msg.status);
      }
    });
    online.setName(name);
    online.join(code);
    return () => { unsub(); online.leave(); };
  }, [code]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!state?.clockRunning) return undefined;
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, [state?.clockRunning]);

  let clocks = null;
  if (state?.clocks) {
    clocks = { ...state.clocks };
    if (state.clockRunning) clocks[state.turn] = Math.max(0, clocks[state.turn] - (now - receivedAt.current));
  }

  return { state, error, connection, clocks, clearError: () => setError(null) };
}
