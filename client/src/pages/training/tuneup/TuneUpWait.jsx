import Icon from '../../../components/icons/Icon.jsx';

/* Shown if the tune-up link is opened before the player has earned it. */
export default function TuneUpWait() {
  return (
    <div className="card center" style={{ maxWidth: 460, margin: '30px auto', display: 'flex', flexDirection: 'column', gap: 10 }}>
      <Icon name="target" size={28} />
      <h2 style={{ margin: 0 }}>Tune-up is waiting</h2>
      <p className="muted" style={{ margin: 0 }}>
        Finish every lesson first. If the Pattern Trainer and Woodpecker Mode are still mostly misses, a lesson appears here from the patterns you miss in puzzles and in games against friends and bots.
      </p>
      <a className="btn primary" href="#/training">Back to Learn Chess</a>
    </div>
  );
}
