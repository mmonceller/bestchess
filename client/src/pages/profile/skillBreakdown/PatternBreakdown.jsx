import { useMemo } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import { LESSONS } from '../../../training/lessons/index.js';
import { PATTERNS, lessonForPattern, splitPatterns } from '../../../training/skill/patterns.js';

const times = (n) => `${n} time${n === 1 ? '' : 's'}`;

function PatternRow({ p, strength }) {
  const info = PATTERNS[p.tag];
  const lessonId = lessonForPattern(p.tag);
  const lesson = lessonId && LESSONS.find((l) => l.id === lessonId);
  const total = p.applied + p.missed;
  const share = total ? Math.round((p.applied / total) * 100) : 0;
  return (
    <li className={`sb-pattern ${strength ? 'strong' : 'weak'}`}>
      <span className="sb-pattern-icon"><Icon name={info.icon} size={18} /></span>
      <div className="sb-pattern-main">
        <b>{info.name}</b>
        <span className="muted small">
          {strength
            ? `Played well ${times(p.applied)} in ${p.games} game${p.games === 1 ? '' : 's'}${p.missed ? `, missed ${times(p.missed)}` : ''}.`
            : `Missed ${times(p.missed)}${p.applied ? `, found ${times(p.applied)}` : ''}.`}
        </span>
        <span className="sb-meter" aria-label={`Found ${share}% of the time`}><span style={{ width: `${share}%` }} /></span>
        <span className="sb-pattern-links small">
          {lesson && (
            <a className="link" href={`#/training/${lesson.id}`}><Icon name="book" size={13} /> {strength ? 'Lesson' : 'Practise'}: {lesson.title}</a>
          )}
          {!strength && p.lastGame && (
            <a className="link" href={`#/review/${p.lastGame.id}?ply=${p.lastGame.ply}`}><Icon name="eye" size={13} /> See your latest miss</a>
          )}
        </span>
      </div>
    </li>
  );
}

/* Ideas the player uses well across their reviewed games, and the ones they keep missing. */
export default function PatternBreakdown({ patterns }) {
  const { strengths, workOn } = useMemo(() => splitPatterns(patterns.list), [patterns]);
  if (!patterns.reviewedGames) {
    return (
      <div className="sb-empty">
        <Icon name="target" size={28} />
        <p>Patterns come from your game reviews. Open a game from your history and press <b>Start game review</b> — after a few reviews you'll see what you're good at here.</p>
      </div>
    );
  }
  return (
    <div className="sb-patterns">
      <p className="muted small">From {patterns.reviewedGames} reviewed game{patterns.reviewedGames === 1 ? '' : 's'}. Review more games to make this more accurate.</p>
      <div className="sb-pattern-cols">
        <section>
          <h3 className="sb-col-title strong"><Icon name="star" size={16} /> You're good at</h3>
          {strengths.length
            ? <ul className="sb-pattern-list">{strengths.map((p) => <PatternRow key={p.tag} p={p} strength />)}</ul>
            : <p className="muted small">Nothing stands out yet — keep reviewing games.</p>}
        </section>
        <section>
          <h3 className="sb-col-title weak"><Icon name="target" size={16} /> Work on</h3>
          {workOn.length
            ? <ul className="sb-pattern-list">{workOn.map((p) => <PatternRow key={p.tag} p={p} />)}</ul>
            : <p className="muted small">No repeated misses found. Nice!</p>}
        </section>
      </div>
    </div>
  );
}
