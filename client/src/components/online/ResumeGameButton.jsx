import Icon from '../icons/Icon.jsx';
import { useActiveGames } from '../../online/useActiveGames.js';
import { opponentLabel, statusLabel } from './gameLabel.js';
import './resume.css';

/* Header pill that takes the player back to an unfinished online game from any page. */
export default function ResumeGameButton({ currentCode, refreshKey }) {
  const games = useActiveGames(refreshKey).filter((g) => g.code !== currentCode);
  if (!games.length) return null;
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
