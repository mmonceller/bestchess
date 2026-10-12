import { useEffect } from 'react';
import { PATTERNS } from '../../training/skill/patterns.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';
import { useProgress } from '../../training/progressStore.js';
import { tuneUpUnlocked } from '../../training/lessons/tuneup/worlds.js';
import Icon from '../../components/icons/Icon.jsx';
import TuneUpCard from './TuneUpCard.jsx';
import './goals.css';

const ROLE = { strength: 'Strength', weakness: 'Weakness' };
const DIRECTION = { up: 'Went up', down: 'Went down', same: 'Same' };

function signed(n) {
  if (n > 0) return `+${n}`;
  return String(n);
}

export default function GoalsPage() {
  const { user, ready } = useAuth();
  const daily = useDaily();
  const { progress, loading: progressLoading } = useProgress();

  useEffect(() => { if (user) daily?.refresh(); }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  if (!user) {
    return (
      <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}>
        <h2>Today's goals</h2>
        <p className="muted">Log in and a fresh set of goals is added each day you come back.</p>
        <a className="btn primary" href="#/login?next=/goals">Log in or sign up</a>
      </div>
    );
  }
  if (!daily?.data) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  const { goals, report, points } = daily.data;
  return (
    <div className="goals fade-in">
      <header className="goals-head">
        <div>
          <h1>Today</h1>
          <p className="muted">Finish a goal to earn its points. Each day rolls a new list from how you have been playing.</p>
        </div>
        <a className="goals-total" href="#/profile">
          <b>{points}</b>
          <span>Goal points</span>
        </a>
      </header>

      <section className="goals-list">
        {goals.map((goal) => {
          const width = `${Math.round((goal.progress / goal.target) * 100)}%`;
          return (
            <article key={goal.id} className={`card goal${goal.done ? ' done' : ''}`}>
              <div className="goal-top">
                <h2>{goal.title}</h2>
                <span className="goal-pts">{goal.done ? `+${goal.points}` : `${goal.points} pts`}</span>
              </div>
              <p className="muted small">{goal.detail}</p>
              <div className="goal-bar" aria-hidden="true"><span style={{ width }} /></div>
              <div className="goal-foot">
                <span>{goal.progress} / {goal.target}</span>
                {goal.done
                  ? <span className="goal-met icon-text"><Icon name="check" size={16} /> Done</span>
                  : <a className="btn small" href={goal.href}>Go</a>}
              </div>
            </article>
          );
        })}
      </section>

      <section className="card goals-report">
        <h2>Today so far</h2>
        <div className="report-points">
          <div>
            <b className={report.skill.delta > 0 ? 'up' : report.skill.delta < 0 ? 'down' : ''}>{report.skill.known ? signed(report.skill.delta) : '–'}</b>
            <span>Skill points</span>
          </div>
          <div>
            <b className={report.puzzle.delta > 0 ? 'up' : report.puzzle.delta < 0 ? 'down' : ''}>{signed(report.puzzle.delta)}</b>
            <span>Puzzle points</span>
          </div>
        </div>
        <h3>Skill mastery</h3>
        {!report.mastery.length && <p className="muted">No strength or weakness has moved since you opened the app today.</p>}
        <ul className="mastery-list">
          {report.mastery.map((row) => (
            <li key={row.tag}>
              <span className={`move move-${row.direction}`}>{DIRECTION[row.direction]}</span>
              <span>
                <b>{PATTERNS[row.tag]?.name || row.tag}</b>
                <span className="muted small">{ROLE[row.role]}</span>
              </span>
            </li>
          ))}
        </ul>
        {!progressLoading && tuneUpUnlocked(progress) && <TuneUpCard mastery={report.mastery} />}
      </section>
    </div>
  );
}
