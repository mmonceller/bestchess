import { useEffect, useState } from 'react';
import { online } from '../../api/onlineSocket.js';
import { navigate } from '../../router/router.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { getGuestName, setGuestName } from './guestName.js';
import ActiveGamesCard from '../../components/online/ActiveGamesCard.jsx';
import CreateGameCard from './lobby/CreateGameCard.jsx';
import JoinGameCard from './lobby/JoinGameCard.jsx';
import PlayerCard from './lobby/PlayerCard.jsx';
import './lobby/lobby.css';

export default function OnlineLobby() {
  const { user } = useAuth();
  const [name, setName] = useState(getGuestName);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => online.subscribe((msg) => {
    if (msg.t === 'created') navigate(`/online/${msg.code}`);
    if (msg.t === 'error') { setError(msg.message); setCreating(false); }
    if (msg.t === 'connection' && msg.status === 'closed') setCreating(false);
  }), []);

  function create(options) {
    setError('');
    setCreating(true);
    if (!user) setGuestName(name);
    online.setName(user ? user.username : name);
    online.create(options);
  }

  function join(typed) {
    const code = typed.trim().toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (code.length !== 6) { setError('Game codes are 6 characters.'); return; }
    if (!user) setGuestName(name);
    navigate(`/online/${code}`);
  }

  return (
    <div className="lobby fade-in">
      <h1>Play with an Online Friend</h1>
      <p className="muted lobby-intro">Create a game and send your friend the code, or join with theirs.</p>

      <ActiveGamesCard title="Your unfinished games" />

      <div className="lobby-grid">
        <CreateGameCard creating={creating} onCreate={create} />
        <div className="lobby-side">
          <JoinGameCard onJoin={join} />
          <PlayerCard user={user} name={name} onNameChange={setName} />
          {error && <div className="error-text small">{error}</div>}
        </div>
      </div>
    </div>
  );
}
