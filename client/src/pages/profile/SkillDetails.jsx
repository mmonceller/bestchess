import { nextTier, recommendedLevel } from '../../training/skill/tiers.js';
import { getLevel } from '../../engine/levels.js';
import { TRACKS } from '../../training/lessons/index.js';
import Icon from '../../components/icons/Icon.jsx';

/* The "more about my skill level" panel: what to play next, how far the next tier is, and how it's worked out. */
export default function SkillDetails({ skill, tier, limit }) {
  const bot = getLevel(recommendedLevel(skill));
  const next = nextTier(skill);
  const heavy = skill.hintHeavy ?? 0;
  const tracks = tier.tracks.map((id) => TRACKS.find((t) => t.id === id)).filter(Boolean);
  return (
    <dl className="skill-details">
      <div>
        <dt><Icon name="bot" size={15} /> Recommended bot</dt>
        <dd><a className="link" href="#/computer">{bot.name}</a> <span className="muted">({bot.elo})</span></dd>
      </div>
      <div>
        <dt><Icon name="book" size={15} /> Lessons for you</dt>
        <dd className="skill-tracks">{tracks.map((t) => <span key={t.id} className="skill-track"><Icon name={t.icon} size={13} /> {t.name}</span>)}</dd>
      </div>
      <div>
        <dt><Icon name="trophy" size={15} /> Next tier</dt>
        <dd>
          {next
            ? <><b style={{ color: next.color }}>{next.name}</b> at {next.min} — {next.toGo} point{next.toGo === 1 ? '' : 's'} to go (you're at {skill.rating}).</>
            : <>You're at the top tier. Keep it up!</>}
        </dd>
      </div>
      <div className="skill-details-wide">
        <dt><Icon name="info" size={15} /> How it works</dt>
        <dd>
          Your latest 20 games count, against bots and online players. Wins against strong opponents raise it most, and a loss never pushes it up.
          Games with more than {limit}% hints are left out{heavy > 0 ? ` (${heavy} so far)` : ''}.
          Tap your badge for a game-by-game breakdown and the patterns you're good at.
        </dd>
      </div>
    </dl>
  );
}
