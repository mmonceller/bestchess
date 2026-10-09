import { useMemo, useState } from 'react';
import Icon from '../../../../components/icons/Icon.jsx';
import { getLesson } from '../../../../training/lessons/index.js';
import { useProgress } from '../../../../training/progressStore.js';
import { MOTIFS } from '../../../../training/woodpecker/motifs.js';
import { WOODPECKER_SETS } from '../../../../training/woodpecker/sets.js';
import motifCounts from '../../../../training/woodpecker/data/motifCounts.js';
import './themes.css';

const MIN_SHARE = 0.02;

/* Each theme's main lesson, grouped so a lesson that covers several themes is listed once. */
function lessonsFor(set) {
  const counts = motifCounts[set.id] || {};
  const rows = new Map();
  for (const [motif, count] of Object.entries(counts).sort((a, b) => b[1] - a[1])) {
    const info = MOTIFS[motif];
    const share = count / (set.count || 1);
    if (!info || share < MIN_SHARE) continue;
    const id = info.lessons[0];
    const row = rows.get(id) || { lesson: getLesson(id), themes: [], top: share };
    row.themes.push({ id: motif, name: info.name, share });
    rows.set(id, row);
  }
  return [...rows.values()].filter((r) => r.lesson).sort((a, b) => b.top - a.top);
}

/* Which lessons teach the tactics that come up in a Woodpecker set, and which are done. */
export default function WoodpeckerPrep({ recommended }) {
  const [setId, setSetId] = useState(recommended);
  const { progress } = useProgress();
  const set = WOODPECKER_SETS.find((s) => s.id === setId) || WOODPECKER_SETS[0];
  const rows = useMemo(() => lessonsFor(set), [set]);
  const done = rows.filter((r) => progress[r.lesson.id]).length;

  return (
    <section className="wp-prep card">
      <div className="wp-prep-head">
        <div>
          <h3><Icon name="book" size={18} /> Get ready with lessons</h3>
          <p className="muted small">The tactics that come up most in this set, and where to learn them. {done}/{rows.length} done.</p>
        </div>
        <div className="segmented wp-prep-sets">
          {WOODPECKER_SETS.map((s) => (
            <button key={s.id} type="button" className={s.id === set.id ? 'active' : ''} onClick={() => setSetId(s.id)}>{s.name}</button>
          ))}
        </div>
      </div>
      <ul className="wp-prep-list">
        {rows.map(({ lesson, themes }) => {
          const finished = Boolean(progress[lesson.id]);
          return (
            <li key={lesson.id}>
              <a href={`#/training/${lesson.id}`} className={`wp-prep-row${finished ? ' done' : ''}`}>
                <span className="wp-prep-check"><Icon name={finished ? 'checkCircle' : 'play'} size={16} /></span>
                <span className="wp-prep-main">
                  <b>{lesson.title}</b>
                  <span className="wp-theme-chips">
                    {themes.map((t) => (
                      <span key={t.id} className="wp-theme-chip small">{t.name} <span className="muted">{Math.round(t.share * 100)}%</span></span>
                    ))}
                  </span>
                </span>
                <span className="muted small wp-prep-go">{finished ? 'Review' : 'Start'} <Icon name="arrowRight" size={14} /></span>
              </a>
            </li>
          );
        })}
      </ul>
      <p className="muted small wp-prep-foot">Percentages show how many puzzles in the set use each idea. One puzzle often uses several.</p>
    </section>
  );
}
