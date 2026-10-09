import { Suspense, lazy, useState } from 'react';
import { TIERS, TIER_ORDER, tierInfo } from '../../training/skill/tiers.js';
import SkillBadge from '../../components/skill/SkillBadge.jsx';
import Icon from '../../components/icons/Icon.jsx';
import SkillDetails from './SkillDetails.jsx';
import { HINT_LIMIT_PERCENT } from '../../review/hintUsage.js';
import '../../components/skill/skill.css';
import './skillBreakdown/skillBreakdown.css';

const SkillBreakdownModal = lazy(() => import('./skillBreakdown/SkillBreakdownModal.jsx'));

/* Skill tier from recent games, the full tier ladder, and what it means for bots and lessons. */
export default function SkillCard({ skill }) {
  const tier = tierInfo(skill);
  const [open, setOpen] = useState(false);
  const [breakdown, setBreakdown] = useState(false);
  const games = skill?.games ?? 0;
  const needed = skill?.needed ?? 5;
  const limit = skill?.hintLimit ?? HINT_LIMIT_PERCENT;
  const heavy = skill?.hintHeavy ?? 0;
  const heavyNote = heavy > 0 && (
    <> {heavy} game{heavy === 1 ? '' : 's'} with more hints than that {heavy === 1 ? "doesn't" : "don't"} count.</>
  );
  return (
    <section className="card skill-card" style={{ '--tier': tier?.color }}>
      <div className="skill-card-body">
        <h2>
          Skill level{' '}
          {tier && (
            <button type="button" className="skill-badge-btn" onClick={() => setBreakdown(true)} title="See your performance breakdown" aria-haspopup="dialog">
              <SkillBadge skill={skill} />
            </button>
          )}
        </h2>
        {breakdown && (
          <Suspense fallback={null}>
            <SkillBreakdownModal skill={skill} onClose={() => setBreakdown(false)} />
          </Suspense>
        )}
        {tier ? (
          <>
            <p className="muted small skill-summary">
              Based on your last {games} games with {limit}% or less hints used.
              <button
                type="button"
                className="skill-more"
                aria-expanded={open}
                aria-controls="skill-details"
                onClick={() => setOpen((v) => !v)}
              >
                <Icon name="info" size={14} /> {open ? 'Less' : 'Details'}
              </button>
            </p>
            {open && <div id="skill-details" className="fade-in"><SkillDetails skill={skill} tier={tier} limit={limit} /></div>}
          </>
        ) : (
          <>
            <p className="muted small">
              Finish {needed} games while using {limit}% or less hints to get your skill badge. You've played {games} so far.{heavyNote}
            </p>
            <div className="skill-progress"><span style={{ width: `${Math.min(100, (games / needed) * 100)}%` }} /></div>
          </>
        )}
        <div className="skill-ladder">
          {TIER_ORDER.map((id) => (
            <span key={id} className={`skill-step${tier?.id === id ? ' current' : ''}`} style={{ '--tier': TIERS[id].color }}>
              <b>{TIERS[id].name}</b>
              <span className="muted">{TIERS[id].range}</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
