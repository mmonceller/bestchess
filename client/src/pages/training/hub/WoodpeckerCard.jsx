import Icon from '../../../components/icons/Icon.jsx';
import { WOODPECKER_SETS, recommendedSet } from '../../../training/woodpecker/sets.js';
import { runFor } from '../../../training/woodpecker/cycles.js';

const LANDING = '#/puzzles/woodpecker';

/* Entry point to the Woodpecker cycles. The name opens the landing page; Continue resumes the set. */
export default function WoodpeckerCard({ trainer }) {
  const active = WOODPECKER_SETS.find((s) => runFor(trainer, s.id).index > 0);
  const total = WOODPECKER_SETS.reduce((sum, s) => sum + s.count, 0);
  const run = active && runFor(trainer, active.id);
  const body = (
    <>
      <span className="puzzle-card-icon"><Icon name="retry" size={30} /></span>
      <div className="puzzle-card-body">
        <h3>Woodpecker Mode</h3>
        <p className="muted small">
          {active
            ? `${active.name} set · cycle ${run.cycle} · ${run.index} of ${active.count} done.`
            : `${total} tactics with spaced repetition. Solve a set, then solve it again faster. Suggested start: ${recommendedSet(trainer.rating).name}.`}
        </p>
      </div>
    </>
  );
  const cta = (
    <>
      <b>{active ? 'Continue' : 'Start'}</b>
      <Icon name="arrowRight" size={20} />
    </>
  );

  if (!active) {
    return (
      <a className="puzzle-card card woodpecker-card" href={LANDING}>
        {body}
        <span className="puzzle-card-cta">{cta}</span>
      </a>
    );
  }

  return (
    <div className="puzzle-card card woodpecker-card">
      <a className="puzzle-card-main" href={LANDING}>{body}</a>
      <a className="puzzle-card-cta" href={`#/puzzles/woodpecker/${active.id}`}>{cta}</a>
    </div>
  );
}
