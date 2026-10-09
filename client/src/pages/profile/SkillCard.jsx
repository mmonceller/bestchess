import { TIERS, TIER_ORDER, tierInfo, recommendedLevel } from '../../training/skill/tiers.js';
import { getLevel } from '../../engine/levels.js';
import { TRACKS } from '../../training/lessons/index.js';
import SkillBadge from '../../components/skill/SkillBadge.jsx';
import '../../components/skill/skill.css';

/* Skill tier from recent games, the full tier ladder, and what it means for bots and lessons. */
export default function SkillCard({ skill }) {
  const tier = tierInfo(skill);
  const games = skill?.games ?? 0;
  const needed = skill?.needed ?? 5;
  return (
    <section className="card skill-card" style={{ '--tier': tier?.color }}>
      <div className="skill-card-body">
        <h2>Skill level {tier && <SkillBadge skill={skill} />}</h2>
        {tier ? (
          <p className="muted small">
            Worked out from your last {games} games against bots and online players.
            Recommended bot: <b>{getLevel(recommendedLevel(skill)).name}</b>. Lessons for you:{' '}
            {tier.tracks.map((id) => TRACKS.find((t) => t.id === id)?.name).filter(Boolean).join(', ')}.
          </p>
        ) : (
          <>
            <p className="muted small">Finish {needed} games to get your skill badge. You've played {games} so far.</p>
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
