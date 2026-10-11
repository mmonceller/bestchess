import { useEffect } from 'react';
import Notice from '../../../components/game/Notice.jsx';
import { online } from '../../../api/onlineSocket.js';
import { formatHms } from '../../../utils/format.js';
import { sounds } from '../../../utils/sound.js';
import { resignLeft } from './resign.js';
import { useNow } from '../../../hooks/useNow.js';

/* Incoming resignation from the games list, or the wait after you sent one. */
export default function ResignNotice({ state, you, them }) {
  const now = useNow(1000);
  const incoming = state.status === 'playing' && state.resignOffer === them;
  const sent = state.status === 'playing' && state.resignOffer === you;
  const left = formatHms(resignLeft(state.resignOfferedAt, now));

  useEffect(() => { if (incoming) sounds.good(); }, [incoming]);

  if (incoming) {
    return (
      <div className="feedback good row rematch-request">
        <span>Your opponent offered to resign. Accept to take the win — it goes through in {left} if you don't.</span>
        <span className="spacer" />
        <button type="button" className="btn small good" onClick={online.acceptResign}>Accept</button>
        <button type="button" className="btn small" onClick={online.declineResign}>Decline</button>
      </div>
    );
  }
  if (sent) {
    return (
      <Notice tone="ok" icon="flag">
        {`You offered to resign. If they don't accept in ${left}, it counts as a loss.`}
      </Notice>
    );
  }
  return null;
}
