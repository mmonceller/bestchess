import { tierInfo } from '../../training/skill/tiers.js';
import './skill.css';

/* The player's initial, ringed in their tier colour once they have a skill rating. */
export default function UserEmblem({ user, href, className = '', size }) {
  const tier = tierInfo(user.skill);
  const left = Math.max(0, (user.skill?.needed ?? 5) - (user.skill?.games ?? 0));
  const title = tier
    ? `${user.username} · ${tier.name} (${user.skill.rating})`
    : `${user.username} · play ${left} more game${left === 1 ? '' : 's'} to get a skill badge`;
  const Tag = href ? 'a' : 'span';
  return (
    <Tag
      href={href}
      className={`user-emblem ${tier ? `ranked tier-${tier.id}` : 'unranked'} ${className}`}
      style={{ '--tier': tier?.color, ...(size ? { '--size': `${size}px` } : {}) }}
      title={title}
      aria-label={title}
    >
      <span className="user-emblem-letter">{user.username[0].toUpperCase()}</span>
    </Tag>
  );
}
