import { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';
import { usePendingGames } from '../../messages/usePendingGames.js';
import { listMessages } from '../../messages/inbox.js';
import { gameIsRead, markGameRead, useGameReadVersion } from '../../messages/readGames.js';
import { formatDateTime } from '../../utils/format.js';
import Icon from '../../components/icons/Icon.jsx';
import PinnedGoals from './PinnedGoals.jsx';
import MessageRow from './MessageRow.jsx';
import './messages.css';

const REFRESH_MS = 5000;

export default function MessagesPage() {
  const { user, ready } = useAuth();
  const daily = useDaily();
  const pending = usePendingGames();
  useGameReadVersion();
  const refresh = daily?.refresh;

  useEffect(() => {
    if (!user || !refresh) return undefined;
    refresh();
    const timer = setInterval(refresh, REFRESH_MS);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [user, refresh]);

  if (!ready) return null;
  if (!user) {
    return (
      <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}>
        <h2>Messages</h2>
        <p className="muted">Log in to see goals and other notes from BestChess.</p>
        <a className="btn primary" href="#/login?next=/messages">Log in or sign up</a>
      </div>
    );
  }
  if (!daily?.data) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  const messages = daily.data.messages || [];
  const games = pending.map((game) => ({ ...game, read: gameIsRead(game.id) }));
  const feed = [
    ...games.map((game) => ({ kind: 'game', at: game.at || 0, game })),
    ...listMessages(messages).map((message) => ({ kind: 'note', at: message.at || 0, message })),
  ].sort((a, b) => b.at - a.at);
  const when = (at) => formatDateTime(at, { date: 'always' });

  return (
    <div className="messages fade-in">
      <h1>Messages</h1>
      <PinnedGoals goals={daily.data.goals} />
      <div className="message-list">
        {!feed.length && !daily.data.goals?.length && <p className="muted">No messages yet. A note arrives when the day's goals are added, and again when you finish one.</p>}
        {feed.map((item) => item.kind === 'game' ? (
          <MessageRow key={item.game.id} title={item.game.title} read={item.game.read} onRead={() => markGameRead(item.game.id)}>
            {item.game.at ? <time className="message-when" dateTime={new Date(item.game.at).toISOString()}>{when(item.game.at)}</time> : null}
            <p className="muted">{item.game.detail}</p>
            <a className="btn small" href={item.game.href}>Resume</a>
          </MessageRow>
        ) : (
          <MessageRow key={item.message.id} title={item.message.title} read={item.message.read} onRead={() => daily.markRead(item.message.id)}>
            <time className="message-when" dateTime={new Date(item.message.at).toISOString()}>{when(item.message.at)}</time>
            <p>{item.message.body}</p>
            {(item.message.title === 'Goal complete' || item.message.title === 'Announcement: Goal Point System') && (
              <a className="message-action" href="#/goals">
                {item.message.title === 'Goal complete' ? "See today's goals" : "Open today's goals"}
                <Icon name="arrowRight" size={16} />
              </a>
            )}
          </MessageRow>
        ))}
      </div>
    </div>
  );
}
