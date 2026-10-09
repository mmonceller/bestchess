import Icon from '../../../components/icons/Icon.jsx';
import { WOODPECKER_SETS, recommendedSet } from '../../../training/woodpecker/sets.js';
import { runFor } from '../../../training/woodpecker/cycles.js';

/* Entry point to the Woodpecker cycles; shows the set in progress, if any. */
export default function WoodpeckerCard({ trainer }) {
  const active = WOODPECKER_SETS.find((s) => runFor(trainer, s.id).index > 0);
  const total = WOODPECKER_SETS.reduce((sum, s) => sum + s.count, 0);
  const run = active && runFor(trainer, active.id);
  return (
    <a className="puzzle-card card woodpecker-card" href={active ? `#/puzzles/woodpecker/${active.id}` : '#/puzzles/woodpecker'}>
      <span className="puzzle-card-icon"><Icon name="retry" size={30} /></span>
      <div className="puzzle-card-body">
        <h3>Woodpecker Method</h3>
        <p className="muted small">
          {active
            ? `${active.name} set · cycle ${run.cycle} · ${run.index} of ${active.count} done.`
            : `${total} classic tactics from the book by Smith and Tikkanen. Solve a set, then solve it again faster. Suggested start: ${recommendedSet(trainer.rating).name}.`}
        </p>
      </div>
      <span className="puzzle-card-cta">
        <b>{active ? 'Continue' : 'Start'}</b>
        <Icon name="arrowRight" size={20} />
      </span>
    </a>
  );
}
