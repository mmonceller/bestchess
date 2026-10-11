import Icon from '../../../components/icons/Icon.jsx';
import { focusCatalog, focusStats, recordedMembers } from '../../../training/patterns/groups.js';

/* Per-pattern success rates, plus the rating each locked pattern unlocks at. */
export default function MasteryPanel({ trainer }) {
  return (
    <section className="mastery card">
      <h3 className="icon-text"><Icon name="target" size={18} /> Your patterns</h3>
      <p className="muted small">Puzzles focus on the patterns you find hardest. Locked ones open up as your rating grows.</p>
      <ul className="mastery-list">
        {focusCatalog().map((p) => {
          const s = focusStats(trainer.patterns, p.id);
          const members = p.kind === 'group' ? recordedMembers(trainer.patterns, p.id) : [];
          const locked = p.unlock > trainer.rating;
          const pct = s.seen ? Math.round((s.solved / s.seen) * 100) : 0;
          return (
            <li key={p.id} className={`${locked ? 'locked' : ''}${members.length ? ' has-subs' : ''}`} style={{ '--c': p.color }}>
              <span className="mastery-icon"><Icon name={locked ? 'lock' : p.icon} size={18} /></span>
              <div className="mastery-body">
                <div className="mastery-line">
                  <b>{p.name}</b>
                  <span className="muted small">
                    {locked ? `Unlocks at ${p.unlock}` : s.seen ? `${s.solved}/${s.seen} solved` : 'New'}
                  </span>
                </div>
                {!locked && <div className="mastery-bar"><span style={{ width: `${pct}%` }} /></div>}
                {members.length > 0 && (
                  <ul className="mastery-subs">
                    {members.map((m) => (
                      <li key={m.id}>
                        <span>{m.name}</span>
                        <span>{m.solved}/{m.seen}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
