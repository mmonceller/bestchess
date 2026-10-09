import { tierInfo } from '../../training/skill/tiers.js';
import { getLevel } from '../../engine/levels.js';
import SkillBadge from '../../components/skill/SkillBadge.jsx';

/* Explains the recommended bot level, or how many games are left before one can be suggested. */
export default function SkillNote({ skill, recommended, chosen }) {
  const tier = tierInfo(skill);
  if (!tier) {
    const left = Math.max(0, (skill?.needed ?? 5) - (skill?.games ?? 0));
    return (
      <div className="skill-note muted small">
        Play {left} more game{left === 1 ? '' : 's'} to get your skill badge and a recommended difficulty.
      </div>
    );
  }
  const harder = chosen > recommended;
  const easier = chosen < recommended;
  return (
    <div className="skill-note" style={{ '--tier': tier.color }}>
      <SkillBadge skill={skill} />
      <span className="small">
        Based on your recent games we picked <b>{getLevel(recommended).name}</b> for you.
        {harder && ' You chose a tougher bot. Good luck!'}
        {easier && ' You chose an easier bot, so it\'s a good time to practise new ideas.'}
        {!harder && !easier && ' Feel free to pick another level to challenge yourself.'}
      </span>
    </div>
  );
}
