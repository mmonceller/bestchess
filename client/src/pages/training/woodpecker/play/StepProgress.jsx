import { isMultiStep, playerMoveCount } from '../../../../training/woodpecker/grace.js';

/* One pip per move the player has to find. Fills as they step through a multi-move line. */
export default function StepProgress({ puzzle, ply, complete }) {
  const total = playerMoveCount(puzzle.moves);
  if (!isMultiStep(puzzle)) return null;
  const at = Math.min(Math.floor(ply / 2), total - 1);
  const filled = complete ? total : Math.floor(ply / 2);
  return (
    <div className="wp-steps" aria-label={`Move ${complete ? total : at + 1} of ${total}`}>
      <div className="wp-steps-bar">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className={i < filled ? 'done' : i === at && !complete ? 'current' : ''}
          />
        ))}
      </div>
      <span className="muted small">Move {complete ? total : at + 1} of {total}</span>
    </div>
  );
}
