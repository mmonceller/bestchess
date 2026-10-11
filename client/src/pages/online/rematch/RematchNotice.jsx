import { useEffect } from 'react';
import Notice from '../../../components/game/Notice.jsx';
import { online } from '../../../api/onlineSocket.js';
import { sounds } from '../../../utils/sound.js';

/* Label for the Rematch button: ask, accept the opponent's request, or wait for them. */
export function rematchLabel(state, you, them) {
  if (state.rematch?.[you]) return 'Waiting for opponent…';
  return state.rematch?.[them] ? 'Accept rematch' : 'Rematch';
}

/*
 * What's happening with a rematch after the game: the opponent's request (with Accept and
 * Decline), a note when they've left the page, or that they declined.
 */
export default function RematchNotice({ state, you, them, chime = false }) {
  const opponent = them === 'w' ? state.white : state.black;
  const name = opponent?.name || 'Your opponent';
  const incoming = state.status === 'over' && state.rematch?.[them] && !state.rematch?.[you];
  const sent = state.status === 'over' && state.rematch?.[you];

  useEffect(() => { if (chime && incoming) sounds.good(); }, [chime, incoming]);

  if (incoming) {
    return (
      <div className="feedback good row rematch-request">
        <span><b>{name}</b> wants a rematch.</span>
        <span className="spacer" />
        <button type="button" className="btn small good" onClick={online.rematch}>Accept</button>
        <button type="button" className="btn small" onClick={online.declineRematch}>Decline</button>
      </div>
    );
  }
  if (sent && !opponent?.connected) {
    return (
      <Notice tone="ok" icon="retry">
        {`Rematch requested. ${name} left the game page — they'll see your invite at the top of their screen, on any page of the app.`}
      </Notice>
    );
  }
  if (sent) return <Notice tone="ok" icon="retry">{`Waiting for ${name} to accept the rematch…`}</Notice>;
  if (state.status === 'over' && state.rematchDeclined === you) {
    return <Notice tone="bad" icon="close">{`${name} declined the rematch.`}</Notice>;
  }
  return null;
}
