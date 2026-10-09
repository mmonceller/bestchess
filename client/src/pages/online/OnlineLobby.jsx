import { useEffect, useState } from 'react';
import { online } from '../../api/onlineSocket.js';
import { navigate } from '../../router/router.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getGuestName, setGuestName } from './guestName.js';
import Icon from '../../components/icons/Icon.jsx';
import ColorPicker from '../../components/game/ColorPicker.jsx';

const TIME_CONTROLS = [
  { label: '3 + 2', minutes: 3, increment: 2 },
  { label: '5 + 0', minutes: 5, increment: 0 },
  { label: '10 + 0', minutes: 10, increment: 0 },
  { label: '15 + 10', minutes: 15, increment: 10 },
  { label: '30 + 0', minutes: 30, increment: 0 },
  { label: 'No clock', minutes: 0, increment: 0 },
];

export default function OnlineLobby() {
  const { user } = useAuth();
  const [name, setName] = useState(getGuestName);
  const [tc, setTc] = useState(2);
  const [color, setColor] = useState('random');
  const [allowHints, setAllowHints] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => online.subscribe((msg) => {
    if (msg.t === 'created') navigate(`/online/${msg.code}`);
    if (msg.t === 'error') { setError(msg.message); setCreating(false); }
    if (msg.t === 'connection' && msg.status === 'closed') setCreating(false);
  }), []);

  function create() {
    setError('');
    setCreating(true);
    if (!user) setGuestName(name);
    online.setName(user ? user.username : name);
    const t = TIME_CONTROLS[tc];
    online.create({ minutes: t.minutes, increment: t.increment, color, allowHints });
  }

  function join(e) {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { setError('Game codes are 6 characters.'); return; }
    if (!user) setGuestName(name);
    navigate(`/online/${code}`);
  }

  return (
    <div className="lobby fade-in">
      <h1>Play with an Online Friend</h1>
      <p className="muted">Create a game and send the code to your friend, or enter the code your friend sent you.</p>

      {!user && (
        <div className="card lobby-name">
          <label className="label" htmlFor="gn">Your display name</label>
          <input id="gn" className="input" value={name} maxLength={20} onChange={(e) => setName(e.target.value)} />
          <p className="small muted" style={{ marginTop: 6 }}>
            Playing as a guest. <a href="#/login?next=/online" style={{ color: 'var(--accent-2)' }}>Log in</a> to save games and earn a rating.
          </p>
        </div>
      )}

      <div className="lobby-grid">
        <div className="card">
          <h2>Create a game</h2>
          <span className="label">Time control</span>
          <div className="segmented">
            {TIME_CONTROLS.map((t, i) => (
              <button key={t.label} className={tc === i ? 'active' : ''} onClick={() => setTc(i)}>{t.label}</button>
            ))}
          </div>
          <span className="label">I play</span>
          <ColorPicker value={color} onChange={setColor} />
          <label className="toggle-inline" style={{ marginTop: 12 }}>
            <input type="checkbox" checked={allowHints} onChange={(e) => setAllowHints(e.target.checked)} />
            Allow AI hints (for a relaxed or practice game)
          </label>
          <button className="btn primary block" style={{ marginTop: 16 }} onClick={create} disabled={creating}>
            {creating ? <span className="spinner" /> : <><Icon name="link" size={18} /> Create game and get a code</>}
          </button>
        </div>

        <form className="card" onSubmit={join}>
          <h2>Join with a code</h2>
          <label className="label" htmlFor="jc">Game code</label>
          <input
            id="jc"
            className="input code-input"
            placeholder="ABC123"
            value={joinCode}
            maxLength={6}
            autoCapitalize="characters"
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          />
          <button className="btn primary block" style={{ marginTop: 16 }}><Icon name="friends" size={18} /> Join game</button>
        </form>
      </div>
      {error && <div className="error-text center">{error}</div>}
    </div>
  );
}
