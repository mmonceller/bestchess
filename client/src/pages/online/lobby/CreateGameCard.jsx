import { useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import ColorPicker from '../../../components/game/ColorPicker.jsx';
import TimeControlPicker from '../../../components/online/timeControl/TimeControlPicker.jsx';
import { DEFAULT_TIME_CONTROL, TIME_CONTROLS } from '../../../components/online/timeControl/timeControls.js';
import InviteExpirySlider from '../../../components/online/inviteExpiry/InviteExpirySlider.jsx';
import { DEFAULT_INVITE_MINUTES } from '../../../components/online/inviteExpiry/inviteExpiry.js';

/* Settings for a new friend game. `onCreate` receives the room options. */
export default function CreateGameCard({ creating, onCreate }) {
  const [tc, setTc] = useState(DEFAULT_TIME_CONTROL);
  const [color, setColor] = useState('random');
  const [allowHints, setAllowHints] = useState(false);
  const [inviteMinutes, setInviteMinutes] = useState(DEFAULT_INVITE_MINUTES);

  function create() {
    const t = TIME_CONTROLS[tc];
    onCreate({ minutes: t.minutes, increment: t.increment, color, allowHints, inviteMinutes });
  }

  return (
    <section className="card lobby-create">
      <h2>Create a game</h2>
      <TimeControlPicker value={tc} onChange={setTc} />

      <div className="lobby-options">
        <div className="lobby-option">
          <span className="lobby-option-label">I play</span>
          <ColorPicker value={color} onChange={setColor} />
        </div>
        <label className="lobby-option">
          <span className="lobby-option-label">
            AI hints
            <small>For a relaxed or practice game</small>
          </span>
          <input type="checkbox" role="switch" className="switch" checked={allowHints} onChange={(e) => setAllowHints(e.target.checked)} />
        </label>
        <div className="lobby-option stacked">
          <InviteExpirySlider value={inviteMinutes} onChange={setInviteMinutes} />
        </div>
      </div>

      <button className="btn primary block" onClick={create} disabled={creating}>
        {creating ? <span className="spinner" /> : <><Icon name="link" size={18} /> Create game and get a code</>}
      </button>
    </section>
  );
}
