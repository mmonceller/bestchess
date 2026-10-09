import Icon from '../../../components/icons/Icon.jsx';
import './mastery.css';

/* What's still needed to unlock Master Class, with live progress for each requirement. */
export default function MasteryChecklist({ mastery }) {
  return (
    <div className="mastery-gate card">
      <div className="mastery-head">
        <span className="mastery-lock"><Icon name="lock" size={22} /></span>
        <div>
          <b>Master Class is locked</b>
          <p className="muted small">These lessons are for very strong players. Show us what you can do:</p>
        </div>
      </div>
      <ul className="mastery-list">
        {mastery.checks.map((c) => (
          <li key={c.id} className={c.done ? 'done' : ''}>
            <span className="mastery-icon"><Icon name={c.done ? 'checkCircle' : c.icon} size={18} /></span>
            <div className="mastery-text">
              <span>{c.label}</span>
              <span className="mastery-bar"><i style={{ width: `${Math.min(100, Math.round((c.current / c.target) * 100))}%` }} /></span>
            </div>
            <span className="mastery-count">{Math.min(c.current, c.target)}/{c.target}</span>
          </li>
        ))}
      </ul>
      {mastery.isGuest && (
        <p className="small muted icon-text">
          <Icon name="info" size={14} /> Game results only count when you play while logged in. <a className="link" href="#/login?next=/training">Log in</a>
        </p>
      )}
      <div className="row mastery-actions">
        <a className="btn icon-text" href="#/puzzles"><Icon name="puzzle" size={18} /> Pattern Trainer</a>
        <a className="btn icon-text" href="#/computer"><Icon name="bot" size={18} /> Play the bot</a>
      </div>
    </div>
  );
}
