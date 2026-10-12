import Icon from '../../../../components/icons/Icon.jsx';
import Move from '../../../../components/notation/Move.jsx';
import MoveText from '../../../../components/notation/MoveText.jsx';

function prefixFor(frame) {
  const mv = frame?.move;
  if (!mv || !frame.number) return '';
  return mv.color === 'w' ? `${frame.number}.` : `${frame.number}...`;
}

/* Compact continuation player: a text link until opened, then a short caption + tiny controls. */
export default function SimulateStrip({ sim }) {
  if (!sim.ready) return null;
  if (!sim.open) {
    return (
      <button type="button" className="btn link wp-sim-toggle" onClick={sim.openIt}>
        See next simulated moves
      </button>
    );
  }
  const frame = sim.frame;
  const mv = frame?.move;
  return (
    <div className="wp-sim">
      <div className="wp-sim-head">
        <span className="muted small">{sim.includesBook ? 'The planned idea, then one continuation' : 'One possible continuation'}</span>
        <button type="button" className="btn link" onClick={sim.close}>Close</button>
      </div>
      {mv && (
        <b className="wp-sim-san">
          <Move san={mv.san} prefix={prefixFor(frame)} ctx={{ color: mv.color, from: mv.from, captured: mv.captured }} />
        </b>
      )}
      {frame && <p className="wp-sim-note"><MoveText>{frame.note}</MoveText></p>}
      {frame?.why && <p className="wp-sim-why"><MoveText>{frame.why}</MoveText></p>}
      <div className="wp-sim-nav">
        <button className="btn" onClick={() => sim.pick(sim.ply - 1)} disabled={sim.ply <= 0} aria-label="Previous simulated move">
          <Icon name="prev" size={16} />
        </button>
        <button className="btn" onClick={sim.togglePlay} aria-label={sim.playing ? 'Pause' : 'Play'}>
          <Icon name={sim.playing ? 'pause' : sim.ply >= sim.last ? 'retry' : 'play'} size={16} />
        </button>
        <button className="btn" onClick={() => sim.pick(sim.ply + 1)} disabled={sim.ply >= sim.last} aria-label="Next simulated move">
          <Icon name="next" size={16} />
        </button>
      </div>
    </div>
  );
}
