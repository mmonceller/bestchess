import Icon from '../../icons/Icon.jsx';
import { SPEEDS, TIME_CONTROLS, explainTimeControl, gameLength } from './timeControls.js';
import './timeControl.css';

/* Clock choice for a friend game: one compact row of options and a one-line summary that expands into the details. */
export default function TimeControlPicker({ value, onChange }) {
  const selected = TIME_CONTROLS[value];
  const speed = SPEEDS[selected.speed];
  const length = gameLength(selected);
  return (
    <div className="tc-picker">
      <span className="tc-title">Time control</span>
      <div className="tc-grid" role="radiogroup" aria-label="Time control">
        {TIME_CONTROLS.map((t, i) => (
          <button
            key={t.label}
            type="button"
            role="radio"
            aria-checked={value === i}
            className={`tc-option ${t.speed}${value === i ? ' active' : ''}`}
            onClick={() => onChange(i)}
            title={t.minutes ? `${t.minutes} min each, +${t.increment} s per move` : 'No clock'}
          >
            <span className="tc-speed">{SPEEDS[t.speed].name}</span>
            <span className="tc-label">{t.minutes ? t.label : '∞'}</span>
          </button>
        ))}
      </div>

      <details className={`tc-explain ${selected.speed}`}>
        <summary>
          <Icon name={speed.icon} size={15} />
          <span className="tc-feel"><b>{speed.name}</b> · {speed.feel}</span>
          {length && <span className="tc-length">~{length} min</span>}
          <Icon name="chevron" size={14} className="tc-chevron" />
        </summary>
        <ul className="small">
          {explainTimeControl(selected).map((line) => <li key={line}>{line}</li>)}
          {selected.minutes > 0 && <li><b>5 + 2</b> means 5 minutes each, plus 2 seconds after every move.</li>}
        </ul>
      </details>
    </div>
  );
}
