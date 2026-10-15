import Icon from '../../../components/icons/Icon.jsx';
import SkillGapNote from '../../../components/skill/SkillGapNote.jsx';
import { hasEasierBots } from '../../../training/skill/tiers.js';
import { formatDate } from '../../../utils/format.js';

const RESULT = { win: 'Win', draw: 'Draw', loss: 'Loss' };
const RULE = { win: 'opponent + 400', draw: 'same as opponent', loss: 'opponent − 400' };
const BAR_CAP = 800;

/*
 * Every game that counts toward the skill rating, with the value it adds to the average and
 * how far it pulls the rating up or down. Games left out for heavy hint use are listed below.
 */
export default function PointsBreakdown({ points, skill }) {
  const { games, average, excluded } = points;
  if (!games.length) {
    return <p className="muted">Finish a few games against bots or online players and they'll show up here.</p>;
  }
  const best = games.reduce((a, g) => (g.value > a.value || (g.value === a.value && a.held && !g.held) ? g : a));
  return (
    <div className="sb-points">
      <div className="sb-formula">
        <div className="sb-formula-main">
          <b>{skill.rating ?? average}</b>
          <span className="muted small">is the average value of your last {games.length} counted games.</span>
        </div>
        <div className="sb-rules small">
          {['win', 'draw', 'loss'].map((r) => (
            <span key={r} className={`sb-rule ${r}`}><b>{RESULT[r]}</b> = {RULE[r]}</span>
          ))}
        </div>
        {skill.rating == null && <p className="muted small">You need {skill.needed} counted games for a badge — {skill.needed - games.length} to go.</p>}
        {hasEasierBots(skill) && (
          <SkillGapNote>
            Against a bot 3 or more levels below your skill, a win will not add skill points. A loss may lower them.
          </SkillGapNote>
        )}
      </div>

      <ol className="sb-game-list">
        {games.map((g) => {
          const delta = g.value - (skill.rating ?? average);
          const pull = Math.round(delta / games.length);
          const tone = pull > 0 ? 'up' : pull < 0 ? 'down' : 'flat';
          const width = Math.min(50, (Math.abs(delta) / BAR_CAP) * 50);
          return (
            <li key={g.id}>
              <a href={`#/review/${g.id}`} className="sb-game">
                <span className={`result-pill ${g.result}`}>{RESULT[g.result]}</span>
                <span className="sb-game-main">
                  <b>vs {g.opponent} <span className="muted">({g.opp})</span></b>
                  <span className="muted small">
                    {formatDate(g.date)} · counts as <b className="sb-value">{g.value}</b>
                    {g.held && <span title="This opponent was 3 or more levels below your skill, so the win stays at your level from your other games."> (held)</span>}
                    {g.capped && <span title="A loss never counts higher than your average from wins and draws."> (capped)</span>}
                    {g.id === best.id && <span className="sb-best"> · your best result</span>}
                  </span>
                </span>
                <span className="sb-delta" aria-label={pull === 0 ? 'Does not change your rating' : `${pull > 0 ? 'Raises' : 'Lowers'} your rating by ${Math.abs(pull)} points`}>
                  <span className="sb-delta-track">
                    {pull !== 0 && <span className={`sb-delta-bar ${tone}`} style={{ width: `${width}%` }} />}
                  </span>
                  <span className={`sb-delta-num ${tone}`}>
                    {pull > 0 ? '+' : pull < 0 ? '−' : ''}{Math.abs(pull)}
                  </span>
                </span>
              </a>
            </li>
          );
        })}
      </ol>
      <p className="muted small sb-footnote">
        <Icon name="info" size={13} /> The number on the right is how much each game moves your rating. A win 3 or more levels below your skill stays at your level from your other games. A closer win counts as the opponent's rating + 400.
      </p>

      {excluded.length > 0 && (
        <div className="sb-excluded">
          <h4>Not counted — too many hints</h4>
          <ul>
            {excluded.map((g) => (
              <li key={g.id}>
                <a href={`#/review/${g.id}`} className="muted small">{RESULT[g.result]} vs {g.opponent} · {formatDate(g.date)} · hints on {g.hintPercent}% of moves</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
