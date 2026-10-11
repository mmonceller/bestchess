import Icon from '../icons/Icon.jsx';
import ResumeList from '../resume/ResumeList.jsx';
import { useActiveGames } from '../../online/useActiveGames.js';
import { savedSeats, SEATS_CHANGED } from '../../online/savedSeats.js';
import { onlineApi } from '../../api/endpoints.js';
import { formatHms } from '../../utils/format.js';
import { useNow } from '../../hooks/useNow.js';
import { hasSameOpponent, needsPlayer, opponentLabel, startedLabel, statusLabel, timeControl } from './gameLabel.js';
import { resignLeft } from '../../pages/online/resign/resign.js';
import './resume.css';

function savedKeys() {
  return savedSeats.list().map(({ code, key }) => ({ code, key }));
}

async function act(fn, code) {
  await fn(code, savedKeys());
  window.dispatchEvent(new Event(SEATS_CHANGED));
}

/* Lists unfinished online games (and rematch requests) with a button to jump back in. Renders nothing when there are none. */
export default function ActiveGamesCard({ title = 'Games in progress' }) {
  const games = useActiveGames().filter(needsPlayer);
  const now = useNow(1000);
  if (!games.length) return null;
  const items = games.map((g) => {
    const started = hasSameOpponent(games, g) ? startedLabel(g, games) : '';
    const auto = g.resignOfferedAt ? formatHms(resignLeft(g.resignOfferedAt, now)) : '';
    const resignNote = g.resign === 'sent'
      ? `Resign sent · auto-accepts in ${auto}`
      : g.resign === 'incoming'
        ? `They offered to resign · ${auto}`
        : '';
    return {
      id: g.code,
      name: opponentLabel(g),
      started,
      detail: [resignNote || statusLabel(g), timeControl(g)].filter(Boolean).join(' · '),
      blurb: <>You have an unfinished game against <b>{g.opponent || 'your friend'}</b>. {resignNote || `${statusLabel(g)} · ${timeControl(g)}`}</>,
      href: `#/online/${g.code}`,
      kind: g.rematch === 'incoming' ? 'rematch' : 'resume',
      yourTurn: g.yourTurn,
      dot: <span className={`player-dot ${g.color === 'w' ? 'white' : 'black'}`} />,
      onResign: g.status === 'playing' && !g.resign ? () => act(onlineApi.resign, g.code) : null,
      resignConfirm: `${g.opponent || 'Your friend'} has 24 hours to accept. If they don't, this counts as your resignation.`,
      onAcceptResign: g.resign === 'incoming' ? () => act(onlineApi.acceptResign, g.code) : null,
      onDeclineResign: g.resign === 'incoming' ? () => act(onlineApi.declineResign, g.code) : null,
      onWithdrawResign: g.resign === 'sent' ? () => act(onlineApi.withdrawResign, g.code) : null,
    };
  });
  return (
    <section className="card active-games">
      <h2 className="icon-text"><Icon name="friends" size={20} /> {title}</h2>
      {items.length === 1 && (
        <p className="muted small">
          Closed the tab by accident? Jump back in. If you stay away for more than a minute, your opponent can claim the win.
        </p>
      )}
      <ResumeList items={items} />
    </section>
  );
}
