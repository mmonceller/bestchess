import { tierInfo } from '../../training/skill/tiers.js';
import Icon from '../icons/Icon.jsx';
import './skill.css';

/* Small pill with the player's tier name and skill rating. */
export default function SkillBadge({ skill, showRating = true }) {
  const tier = tierInfo(skill);
  if (!tier) return null;
  return (
    <span className={`skill-badge tier-${tier.id}`} style={{ '--tier': tier.color }}>
      <Icon name={tier.id === 'diamond' ? 'gem' : 'trophy'} size={13} />
      {tier.name}
      {showRating && <span className="skill-badge-rating">{skill.rating}</span>}
    </span>
  );
}
