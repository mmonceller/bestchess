import Icon from '../../../components/icons/Icon.jsx';
import { accuracy, formatDuration } from '../../../training/woodpecker/cycles.js';
import CycleHistory from './CycleHistory.jsx';

/* Shown when the last exercise of a cycle is done. `history` already includes `finished`. */
export default function CycleSummary({ set, finished, history, onContinue }) {
  const prev = history[history.length - 2];
  const faster = prev && prev.ms ? Math.round((1 - finished.ms / prev.ms) * 100) : null;
  return (
    <section className="wp-summary card pop-in" style={{ '--c': set.color }}>
      <span className="pattern-icon"><Icon name="trophy" size={28} /></span>
      <h2>Cycle {finished.cycle} complete!</h2>
      <p>
        You solved <b>{finished.solved}</b> of <b>{finished.total}</b> ({accuracy(finished.solved, finished.total)}%)
        in <b>{formatDuration(finished.ms)}</b>.
        {faster !== null && (faster >= 0 ? ` That's ${faster}% faster than last time.` : ` That's ${-faster}% slower than last time — accuracy first, speed will come.`)}
      </p>
      <p className="muted">
        Next goal: the same {finished.total} exercises in about <b>{formatDuration(finished.ms / 2)}</b>.
      </p>
      <CycleHistory history={history} />
      <div className="wp-summary-actions">
        <a className="btn icon-text" href="#/puzzles/woodpecker"><Icon name="back" size={16} /> All sets</a>
        <button className="btn primary icon-text" onClick={onContinue}>
          Start cycle {finished.cycle + 1} <Icon name="arrowRight" size={16} />
        </button>
      </div>
    </section>
  );
}
