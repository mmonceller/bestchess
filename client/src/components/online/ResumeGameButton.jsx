import Icon from '../icons/Icon.jsx';
import { useActiveGames } from '../../online/useActiveGames.js';
import { needsPlayer, opponentLabel, statusLabel } from './gameLabel.js';
import './resume.css';

/*
 * Header pill that takes the player back to an online game from any page: a rematch request
 * waiting for their answer comes first, then unfinished games.
 */
export default function ResumeGameButton({ currentCode, refreshKey }) {
  const games = useActiveGames(refreshKey).filter((g) => g.code !== currentCode && needsPlayer(g));
  if (!games.length) return null;
  const rematch = games.find((g) => g.rematch === 'incoming');
  if (rematch) {
    return (
      <a href={`#/online/${rematch.code}`} className="resume-pill rematch" title={statusLabel(rematch)}>
        <span className="resume-dot" />
        <Icon name="retry" size={14} />
        <span className="resume-text">Rematch? {rematch.opponent ? `· ${rematch.opponent}` : ''}</span>
      </a>
    );
  }
  const g = games[0];
  const more = games.length - 1;
  return (
    <a
      href={more ? '#/online' : `#/online/${g.code}`}
      className={`resume-pill${g.yourTurn ? ' your-turn' : ''}`}
      title={`${opponentLabel(g)} · ${statusLabel(g)}`}
    >
      <span className="resume-dot" />
      <Icon name="play" size={14} />
      <span className="resume-text">{more ? `Resume games (${games.length})` : 'Resume game'}</span>
    </a>
  );
}
