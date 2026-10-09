import Icon from '../icons/Icon.jsx';
import { HINT_LIMIT_PERCENT, hintLabel, hintSummary } from '../../review/hintUsage.js';

/*
 * How many hints a game used. `compact` is the short pill for game lists; the full version
 * also says whether the game counts toward the skill badge.
 */
export default function HintUsage({ game, compact = false }) {
  const { tracked, used, own, percent, countsForSkill } = hintSummary(game);
  if (!tracked) return null;
  if (compact) {
    if (!used) return null;
    return (
      <span
        className={`hint-usage-pill${countsForSkill ? '' : ' over'}`}
        title={`Hints on ${used} of your ${own} moves (${percent}%)${countsForSkill ? '' : ' — does not count toward your skill level'}`}
      >
        <Icon name="hint" size={13} /> {used}
      </span>
    );
  }
  return (
    <div className={`hint-usage${countsForSkill ? '' : ' over'}`}>
      <Icon name="hint" size={16} />
      <span>
        {used ? <><b>{hintLabel(used)}</b> on {own} moves ({percent}%)</> : <b>No hints used</b>}
        {!countsForSkill && <span className="hint-usage-note"> · Over {HINT_LIMIT_PERCENT}%, so this game doesn't count toward your skill level.</span>}
      </span>
    </div>
  );
}
