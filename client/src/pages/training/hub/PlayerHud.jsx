import Icon from '../../../components/icons/Icon.jsx';

/* Level badge, XP bar and streak / stars / puzzle-rating chips. */
export default function PlayerHud({ name, level, stars, maxStars, trainer, onChangePath }) {
  return (
    <section className="player-hud card">
      <div className="level-badge" aria-label={`Level ${level.level}`}>
        <span>{level.level}</span>
      </div>
      <div className="hud-main">
        <div className="hud-name">
          <b>{name}</b>
          <span className="muted small">Level {level.level} · {level.title}</span>
        </div>
        <div className="xp-bar" role="progressbar" aria-valuenow={level.pct} aria-valuemin={0} aria-valuemax={100}>
          <span style={{ width: `${level.pct}%` }} />
        </div>
        <div className="muted small">{level.into} / {level.span} XP to level {level.level + 1}</div>
      </div>
      <div className="hud-chips">
        <span className="chip chip-fire" title="Days in a row you've trained">
          <Icon name="fire" size={16} /> <b>{trainer.dayStreak || 0}</b> <span>day streak</span>
        </span>
        <span className="chip chip-star" title="Lesson stars earned">
          <Icon name="star" size={16} /> <b>{stars}</b> <span>/ {maxStars}</span>
        </span>
        <span className="chip chip-puzzle" title="Puzzle rating — it goes up as you solve harder puzzles">
          <Icon name="puzzle" size={16} /> <b>{trainer.rating}</b> <span>puzzle rating</span>
        </span>
      </div>
      {onChangePath && (
        <button className="link small hud-path" onClick={onChangePath}>Change starting point</button>
      )}
    </section>
  );
}
