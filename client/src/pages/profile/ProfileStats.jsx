import Icon from '../../components/icons/Icon.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';

function Plate({ icon, value, label, href }) {
  const Tag = href ? 'a' : 'div';
  return (
    <Tag className={`trophy-plate${href ? ' is-link' : ''}`} href={href}>
      <span className="trophy-plate-icon"><Icon name={icon} size={16} /></span>
      <span className="trophy-plate-copy">
        <b>{value}</b>
        <span>{label}</span>
      </span>
    </Tag>
  );
}

function Case({ tone, title, icon, hero, plates }) {
  return (
    <section className={`card trophy-case trophy-${tone}`}>
      <h3 className="trophy-title icon-text"><Icon name={icon} size={18} /> {title}</h3>
      <div className="trophy-layout">
        <div className="trophy-hero">
          <span className="trophy-medal"><Icon name={hero.icon} size={28} /></span>
          <b>{hero.value}</b>
          <span>{hero.label}</span>
        </div>
        <div className="trophy-plates">
          {plates.map((plate) => <Plate key={plate.label} {...plate} />)}
        </div>
      </div>
    </section>
  );
}

/* Match record: online rating, games, and goal points. */
export default function ProfileStats({ user }) {
  const points = useDaily()?.points;
  const { wins, losses, draws } = user.stats;
  const total = wins + losses + draws;
  const winRate = total ? Math.round((wins / total) * 100) : 0;

  return (
    <div className="profile-stats">
      <Case
        tone="stats"
        title="Stats"
        icon="trophy"
        hero={{ icon: 'trophy', value: user.rating, label: 'Online rating' }}
        plates={[
          { icon: 'swords', value: total, label: 'Games played' },
          { icon: 'crown', value: `${winRate}%`, label: 'Win rate' },
          { icon: 'draw', value: `${wins}/${draws}/${losses}`, label: 'W / D / L' },
          { icon: 'star', value: points ?? '–', label: 'Goal points', href: '#/goals' },
        ]}
      />
    </div>
  );
}
