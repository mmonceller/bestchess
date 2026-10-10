import { useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';

/* Code entry for joining a friend's game. `onJoin` receives the typed code. */
export default function JoinGameCard({ onJoin }) {
  const [code, setCode] = useState('');
  return (
    <form className="card lobby-join" onSubmit={(e) => { e.preventDefault(); onJoin(code); }}>
      <h2>Join with a code</h2>
      <div className="lobby-join-row">
        <input
          className="input code-input"
          aria-label="Game code"
          placeholder="ABC123"
          value={code}
          maxLength={6}
          autoCapitalize="characters"
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <button className="btn primary icon-text"><Icon name="friends" size={18} /> Join</button>
      </div>
      <p className="small muted">Got a link instead? Just open it.</p>
    </form>
  );
}
