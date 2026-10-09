import { useEffect, useRef } from 'react';
import { online } from '../../../api/onlineSocket.js';
import { savedSeats } from '../../../online/savedSeats.js';

const MAX_RETRIES = 3;

/*
 * Remembers the seat this browser holds in `code` so the game can be resumed after the tab
 * is closed, and forgets it once the game is over. If we came back as a spectator because
 * our old tab still held the seat, joins again as soon as that seat shows as disconnected.
 */
export function useSeatMemory(code, state) {
  const retries = useRef(0);

  useEffect(() => {
    if (!state) return;
    const { you, status } = state;
    if (you === 'w' || you === 'b') {
      retries.current = 0;
      if (status === 'over') savedSeats.remove(code);
      else savedSeats.save(code, { key: online.playerKey(), color: you, opponent: (you === 'w' ? state.black : state.white)?.name || null });
      return;
    }
    const mine = savedSeats.get(code);
    if (!mine || status === 'over') return;
    const seat = mine.color === 'w' ? state.white : state.black;
    if (seat && !seat.connected && retries.current < MAX_RETRIES) {
      retries.current++;
      online.join(code);
    }
  }, [code, state]);
}
