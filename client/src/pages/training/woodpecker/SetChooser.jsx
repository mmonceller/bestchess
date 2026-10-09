import Icon from '../../../components/icons/Icon.jsx';
import { WOODPECKER_SETS, recommendedSet } from '../../../training/woodpecker/sets.js';
import { accuracy, formatDuration, runFor } from '../../../training/woodpecker/cycles.js';
import CycleHistory from './CycleHistory.jsx';
import MethodNote from './MethodNote.jsx';

export default function SetChooser({ trainer }) {
  const recommended = recommendedSet(trainer.rating).id;
  return (
    <>
      <header className="trainer-head">
        <a className="orb small" href="#/training" aria-label="Back to Learn Chess"><Icon name="back" size={18} /></a>
        <div>
          <h2 className="wp-title">Woodpecker Method</h2>
          <p className="muted small wp-sub">Tactics from the book by Axel Smith and Hans Tikkanen, solved in cycles.</p>
        </div>
      </header>

      <MethodNote />

      <div className="wp-sets">
        {WOODPECKER_SETS.map((set) => {
          const run = runFor(trainer, set.id);
          const started = run.index > 0 || run.history.length > 0;
          return (
            <article key={set.id} className="wp-set card" style={{ '--c': set.color }}>
              <div className="wp-set-head">
                <span className="pattern-icon"><Icon name={set.icon} size={24} /></span>
                <div>
                  <h3>{set.name} {set.id === recommended && <span className="badge wp-rec">Recommended</span>}</h3>
                  <span className="muted small">{set.count} exercises</span>
                </div>
              </div>
              <p className="muted small">{set.blurb}</p>
              {started ? (
                <p className="wp-status small">
                  <b>Cycle {run.cycle}</b> · {run.index}/{set.count} done
                  {run.index > 0 && <> · {accuracy(run.solved, run.index)}% · {formatDuration(run.ms)}</>}
                </p>
              ) : (
                <p className="wp-status small muted">Not started yet</p>
              )}
              <CycleHistory history={run.history} compact />
              <a className="btn primary block icon-text" href={`#/puzzles/woodpecker/${set.id}`}>
                <Icon name="play" size={16} /> {started ? 'Continue' : 'Start cycle 1'}
              </a>
            </article>
          );
        })}
      </div>
    </>
  );
}
