import { formatDate } from '../../../utils/format.js';
import GoalPointsEditor from '../goalPoints/GoalPointsEditor.jsx';

function Stat({ label, value }) {
  return (
    <div className="admin-stat">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function skillLabel(user) {
  if (user.skill == null) return '–';
  const tier = user.skillTier ? user.skillTier[0].toUpperCase() + user.skillTier.slice(1) : '';
  return tier ? `${user.skill} · ${tier}` : String(user.skill);
}

export default function UserCard({ user, onGoalPoints }) {
  const games = user.wins + user.draws + user.losses;
  return (
    <article className="card admin-user">
      <header className="admin-user-head">
        <div>
          <h2>{user.username}</h2>
          <p className="muted small">
            Joined {formatDate(user.createdAt)}
            {' · '}
            {user.onlineRating} online
            {' · '}
            {games} {games === 1 ? 'game' : 'games'} ({user.wins}/{user.draws}/{user.losses} W/D/L)
          </p>
        </div>
        <span className="admin-level">Level {user.level}</span>
      </header>
      <dl className="admin-stats">
        <Stat label="Progress points" value={user.progressPoints} />
        <Stat label="Skill points" value={skillLabel(user)} />
        <Stat label="Training points" value={user.trainingPoints} />
        <Stat label="Puzzle rating" value={user.puzzleRating ?? '–'} />
        <Stat label="Puzzles solved" value={user.puzzlesSolved} />
        <Stat label="Lessons done" value={user.lessonsDone} />
        <Stat label="Stars" value={user.stars} />
      </dl>
      <GoalPointsEditor username={user.username} points={user.goalPoints} onSave={(points) => onGoalPoints(user.id, points)} />
    </article>
  );
}
