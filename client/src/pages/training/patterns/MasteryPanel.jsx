import { useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import { focusCatalog, focusStats, solvedMembers } from '../../../training/patterns/groups.js';

/* Per-pattern success rates, plus the rating each locked pattern unlocks at. */
export default function MasteryPanel({ trainer }) {
  const [openId, setOpenId] = useState(null);

  return (
    <section className="mastery card">
      <h3 className="icon-text"><Icon name="target" size={18} /> Your patterns</h3>
      <p className="muted small">Puzzles focus on the patterns you find hardest. Locked ones open up as your rating grows.</p>
      <ul className="mastery-list">
        {focusCatalog().map((p) => {
          const s = focusStats(trainer.patterns, p.id);
          const locked = p.unlock > trainer.rating;
          const pct = s.seen ? Math.round((s.solved / s.seen) * 100) : 0;
          const solved = p.kind === 'group' && !locked ? solvedMembers(trainer.patterns, p.id) : [];
          const open = openId === p.id;
          return (
            <li
              key={p.id}
              className={[locked && 'locked', solved.length && 'has-subs', open && 'open'].filter(Boolean).join(' ')}
              style={{ '--c': p.color }}
            >
              {solved.length ? (
                <button
                  type="button"
                  className="mastery-toggle"
                  aria-expanded={open}
                  onClick={() => setOpenId(open ? null : p.id)}
                >
                  <span className="mastery-icon"><Icon name={p.icon} size={18} /></span>
                  <div className="mastery-body">
                    <div className="mastery-line">
                      <b>{p.name}</b>
                      <span className="muted small">{s.seen ? `${s.solved}/${s.seen} solved` : 'New'}</span>
                    </div>
                    <div className="mastery-bar"><span style={{ width: `${pct}%` }} /></div>
                  </div>
                  <Icon name="chevron" size={16} className={`mastery-chevron${open ? ' open' : ''}`} />
                </button>
              ) : (
                <>
                  <span className="mastery-icon"><Icon name={locked ? 'lock' : p.icon} size={18} /></span>
                  <div className="mastery-body">
                    <div className="mastery-line">
                      <b>{p.name}</b>
                      <span className="muted small">
                        {locked ? `Unlocks at ${p.unlock}` : s.seen ? `${s.solved}/${s.seen} solved` : 'New'}
                      </span>
                    </div>
                    {!locked && <div className="mastery-bar"><span style={{ width: `${pct}%` }} /></div>}
                  </div>
                </>
              )}
              {open && solved.length > 0 && (
                <ul className="mastery-subs">
                  {solved.map((m) => (
                    <li key={m.id}>
                      <span>{m.name}</span>
                      <span className="muted">{m.solved}/{m.seen}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
