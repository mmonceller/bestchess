import Icon from '../../icons/Icon.jsx';
import './replay.css';

/* Shown while the player is looking at an earlier position of a live game. */
export default function BrowsingNotice({ ply, onBack }) {
  const label = ply < 0 ? 'the starting position' : `move ${Math.floor(ply / 2) + 1}${ply % 2 ? ' (Black)' : ''}`;
  return (
    <div className="browsing-notice">
      <Icon name="eye" size={15} />
      <span>Looking at {label}. The game goes on meanwhile.</span>
      <button className="btn small primary" onClick={onBack}>Back to the game</button>
    </div>
  );
}
