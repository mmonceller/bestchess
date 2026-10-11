import Notice from '../../../components/game/Notice.jsx';
import { online } from '../../../api/onlineSocket.js';
import { setGuestName } from '../guestName.js';

/* Empty guest seats a watcher can sit back down in after closing their tab. */
function openSeats(state) {
  return ['w', 'b'].flatMap((c) => {
    const s = c === 'w' ? state.white : state.black;
    if (!s || s.connected || s.registered) return [];
    return [{ color: c, name: s.name }];
  });
}

export default function WatchNotice({ state }) {
  const open = state.status === 'over' ? [] : openSeats(state);
  return (
    <div className="watch-notice">
      <Notice tone="ok" icon="eye">You are watching this game.</Notice>
      {open.map((s) => (
        <div key={s.color} className="feedback ok row" style={{ marginTop: 8 }}>
          <span><b>{s.name}</b> left. Is that you?</span>
          <span className="spacer" />
          <button
            type="button"
            className="btn small primary"
            onClick={() => { setGuestName(s.name); online.setName(s.name); online.join(state.code); }}
          >
            Play as {s.name}
          </button>
        </div>
      ))}
    </div>
  );
}
