import Icon from '../../icons/Icon.jsx';
import './replay.css';

/* Compact header control while looking at an earlier position of a live game. */
export default function BrowsingNotice({ ply, onBack }) {
  const label = ply < 0 ? 'the starting position' : `move ${Math.floor(ply / 2) + 1}${ply % 2 ? ' (Black)' : ''}`;
  return (
    <button
      type="button"
      className="btn small browsing-back"
      onClick={onBack}
      title={`Looking at ${label}. The game goes on meanwhile.`}
    >
      <Icon name="eye" size={14} /> Back to the game
    </button>
  );
}
