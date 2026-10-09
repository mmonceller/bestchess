import Icon from '../icons/Icon.jsx';
import { useActiveGames } from '../../online/useActiveGames.js';
import { opponentLabel, statusLabel, timeControl } from './gameLabel.js';
import './resume.css';

/* Lists unfinished online games with a button to jump back in. Renders nothing when there are none. */
export default function ActiveGamesCard({ title = 'Games in progress' }) {
  const games = useActiveGames();
  if (!games.length) return null;
  return (
    <section className="card active-games">
      <h2 className="icon-text"><Icon name="friends" size={20} /> {title}</h2>
      <p className="muted small">
        Closed the tab by accident? Jump back in. If you stay away for more than a minute, your opponent can claim the win.
      </p>
      <div className="active-list">
        {games.map((g) => (
          <a key={g.code} href={`#/online/${g.code}`} className={`active-row${g.yourTurn ? ' your-turn' : ''}`}>
            <span className={`player-dot ${g.color === 'w' ? 'white' : 'black'}`} />
            <div className="active-main">
              <b>{opponentLabel(g)}</b>
              <span className="muted small">{statusLabel(g)} · {timeControl(g)}</span>
            </div>
            <span className="btn small primary icon-text"><Icon name="play" size={14} /> Resume</span>
          </a>
        ))}
      </div>
    </section>
  );
}
