import { useEvaluation } from './useEvaluation.js';
import './evalBar.css';

const MIN_SHARE = 0.04;

/*
 * Thin "who's winning" meter beside the board. The bottom part belongs to the side at the
 * bottom of the board (the player) and grows as they get better; the top part belongs to
 * the opponent. Each part takes its square colour from the current board theme.
 */
export default function EvalBar({ fen, orientation = 'white', playerColor = null }) {
  const { white, label, mate } = useEvaluation(fen);
  const bottomIsWhite = orientation === 'white';
  const [bottomName, topName] = sideNames(bottomIsWhite ? 'w' : 'b', playerColor);
  const raw = bottomIsWhite ? white : 1 - white;
  const decided = raw === 0 || raw === 1;
  const bottom = decided ? raw : Math.min(1 - MIN_SHARE, Math.max(MIN_SHARE, raw));
  const shown = bottomIsWhite ? label : flip(label);
  const even = mate == null && !decided && Math.abs(raw - 0.5) < 0.03;
  const leader = raw > 0.5 ? bottomName : topName;
  const who = even ? 'About equal' : `${leader} ${leader === 'You' ? 'are' : 'is'} ahead`;

  return (
    <div
      className={`eval-bar ${bottomIsWhite ? 'bottom-light' : 'bottom-dark'}`}
      role="meter"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(bottom * 100)}
      aria-label={`${who} (${shown})`}
      title={`${who} (${shown})`}
    >
      <div className="eval-fill" style={{ height: `${bottom * 100}%` }} />
      <span className="eval-mid" />
    </div>
  );
}

function sideNames(bottomColor, playerColor) {
  if (!playerColor) return bottomColor === 'w' ? ['White', 'Black'] : ['Black', 'White'];
  return playerColor === bottomColor ? ['You', 'Your opponent'] : ['Your opponent', 'You'];
}

/* Labels are from White's side; show them from the player's side when they play Black. */
function flip(label) {
  if (label.startsWith('+')) return `−${label.slice(1)}`;
  if (label.startsWith('−')) return `+${label.slice(1)}`;
  return label;
}
