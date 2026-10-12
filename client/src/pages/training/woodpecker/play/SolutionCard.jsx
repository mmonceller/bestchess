import Icon from '../../../../components/icons/Icon.jsx';
import MoveLine from '../../../../components/notation/MoveLine.jsx';
import MoveText from '../../../../components/notation/MoveText.jsx';
import NotationGuideButton from '../../../../components/notation/NotationGuideButton.jsx';
import AimNote from './AimNote.jsx';
import PuzzleThemes from '../themes/PuzzleThemes.jsx';

/* Full solution, or a slim bar when the continuation player takes the column. */
export default function SolutionCard({ puzzle, altCaption, folded, onToggle }) {
  return (
    <div className={`wp-solution pop-in${folded ? ' is-folded' : ''}`}>
      <button
        type="button"
        className="wp-solution-toggle"
        onClick={onToggle}
        aria-expanded={!folded}
        aria-label={folded ? 'Show solution' : 'Hide solution'}
      >
        <Icon name="chevron" size={13} className="wp-fold-chevron" />
        <span className="wp-solution-label">Solution</span>
        {folded && (
          <span className="wp-fold-preview">
            <MoveLine fen={puzzle.fen} moves={puzzle.moves} />
          </span>
        )}
      </button>
      {!folded && (
        <div className="wp-solution-body">
          {altCaption && (
            <p className="wp-alt"><MoveText>{altCaption}</MoveText></p>
          )}
          <b><MoveLine fen={puzzle.fen} moves={puzzle.moves} /></b>
          <AimNote puzzle={puzzle} />
          {puzzle.game && <span className="muted small">{puzzle.game}</span>}
          <PuzzleThemes puzzle={puzzle} />
          <NotationGuideButton className="wp-guide" />
        </div>
      )}
    </div>
  );
}
