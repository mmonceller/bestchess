import { useAuth } from '../../context/AuthContext.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';
import { usePendingGames } from '../../messages/usePendingGames.js';
import { inboxUnread } from '../../messages/inbox.js';
import { gameIsRead, useGameReadVersion } from '../../messages/readGames.js';
import Icon from '../../components/icons/Icon.jsx';
import Logo from '../../components/icons/Logo.jsx';
import { MODES } from '../../components/layout/modes.js';
import './home.css';

const FLOATING = ['knight', 'rook', 'pawn', 'bishop', 'queen', 'king'];

export default function HomePage() {
  const { user } = useAuth();
  const daily = useDaily();
  useGameReadVersion();
  const pending = usePendingGames('home').map((game) => ({ ...game, read: gameIsRead(game.id) }));
  const messages = inboxUnread(daily?.data?.messages, pending);
  return (
    <div className="landing">
      <div className="landing-deco" aria-hidden="true">
        {FLOATING.map((p, i) => <span key={p} className={`deco deco-${i}`}><Icon name={p} size="100%" /></span>)}
      </div>

      <div className="landing-center">
        <div className="landing-brand">
          <Logo size={68} />
          <h1>BestChess</h1>
        </div>

        <nav className="landing-actions">
          {MODES.map((m, i) => (
            <a key={m.id} href={m.href} className="play-btn" style={{ '--tint': m.tint, '--i': i }}>
              <span className="play-icon"><Icon name={m.icon} size={28} /></span>
              <span className="play-label">{m.label}</span>
              <Icon name="arrowRight" size={20} className="play-arrow" />
            </a>
          ))}
        </nav>
      </div>

      <footer className="landing-foot">
        {user
          ? (
            <span className="signed-in">
              Signed in as <a href="#/profile">{user.username}</a>
              {messages > 0 && <a className="home-msg" href="#/messages" aria-label={`${messages} unread message${messages === 1 ? '' : 's'}`}>{messages}</a>}
            </span>
          )
          : <a href="#/login">Log in</a>}
      </footer>
    </div>
  );
}
