import Icon from '../../components/icons/Icon.jsx';

/* The profile's numbers, grouped so related stats sit together: games, lessons, puzzles. */
export default function ProfileStats({ user, trainer, lessonsDone, lessonsTotal, stars }) {
  const { wins, losses, draws } = user.stats;
  const total = wins + losses + draws;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const groups = [
    {
      id: 'games',
      title: 'Games',
      icon: 'friends',
      stats: [
        { label: 'Online rating', value: user.rating },
        { label: 'Games played', value: total },
        { label: 'Win rate', value: `${winRate}%` },
        { label: 'W / D / L', value: `${wins}/${draws}/${losses}` },
      ],
    },
    {
      id: 'lessons',
      title: 'Lessons',
      icon: 'book',
      stats: [
        { label: 'Lessons done', value: `${lessonsDone}/${lessonsTotal}` },
        { label: 'Training stars', value: <span className="icon-text">{stars} <Icon name="star" size={16} className="star-gold" /></span> },
      ],
    },
    {
      id: 'puzzles',
      title: 'Puzzles',
      icon: 'target',
      stats: [
        { label: 'Puzzle rating', value: trainer?.rating ?? '–' },
        { label: 'Solved', value: trainer?.solved ?? 0 },
        { label: 'Best streak', value: trainer?.bestStreak ?? 0 },
      ],
    },
  ];
  return (
    <div className="profile-stats">
      {groups.map((g) => (
        <section key={g.id} className={`card stat-group stat-group-${g.id}`}>
          <h3 className="stat-group-title icon-text"><Icon name={g.icon} size={16} /> {g.title}</h3>
          <div className="stat-group-grid">
            {g.stats.map((s) => (
              <div key={s.label} className="stat">
                <b>{s.value}</b>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
