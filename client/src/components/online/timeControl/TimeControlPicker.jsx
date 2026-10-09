import Icon from '../../icons/Icon.jsx';
import { SPEEDS, TIME_CONTROLS, explainTimeControl, gameLength } from './timeControls.js';
import './timeControl.css';

/* Clock choice for a friend game, with a legend and a plain explanation of the selected option. */
export default function TimeControlPicker({ value, onChange }) {
  const selected = TIME_CONTROLS[value];
  const speed = SPEEDS[selected.speed];
  const length = gameLength(selected);
  return (
    <div className="tc-picker">
      <div className="tc-head">
        <span className="label">Time control</span>
        <span className="tc-legend small muted">
          <b>5</b> + <b>2</b> = <b>5</b> minutes each, <b>+2</b> seconds per move
        </span>
      </div>

      <div className="tc-grid" role="radiogroup" aria-label="Time control">
        {TIME_CONTROLS.map((t, i) => {
          const s = SPEEDS[t.speed];
          return (
            <button
              key={t.label}
              type="button"
              role="radio"
              aria-checked={value === i}
              className={`tc-option ${t.speed}${value === i ? ' active' : ''}`}
              onClick={() => onChange(i)}
            >
              <span className="tc-speed"><Icon name={s.icon} size={13} /> {s.name}</span>
              <span className="tc-label">{t.minutes ? t.label : '∞'}</span>
              <span className="tc-sub">{t.minutes ? `${t.minutes} min each` : 'No clock'}</span>
            </button>
          );
        })}
      </div>

      <div className={`tc-explain ${selected.speed}`} aria-live="polite">
        <div className="tc-explain-title">
          <Icon name={speed.icon} size={16} />
          <b>{speed.name}{selected.minutes ? ` · ${selected.label}` : ''}</b>
          {length && <span className="tc-length">about {length} min game</span>}
        </div>
        <p className="small muted">{speed.feel}</p>
        <ul className="small">
          {explainTimeControl(selected).map((line) => <li key={line}>{line}</li>)}
        </ul>
      </div>
    </div>
  );
}
