import Icon from '../../../components/icons/Icon.jsx';
import MoveText from '../../../components/notation/MoveText.jsx';
import { CATEGORY, LEVEL } from '../../../training/terms/index.js';
import { getLesson } from '../../../training/lessons/index.js';

/* One term: name, tags, plain-English meaning, other names, an example line and the lesson that teaches it. */
export default function TermCard({ term, showCategory, highlight }) {
  const category = CATEGORY[term.category];
  const level = LEVEL[term.level];
  const lesson = term.lesson && getLesson(term.lesson);
  const name = term.name.toLowerCase();
  const aka = term.aka.filter((a) => /[a-z]/i.test(a) && !name.includes(a.toLowerCase()) && !a.toLowerCase().startsWith(name));
  return (
    <article id={`term-${term.id}`} className={`term-card${highlight ? ' highlight' : ''}`} style={{ '--c': category.color }}>
      <header className="term-head">
        <h3>{term.name}</h3>
        <span className={`term-level ${level.id}`} title={`${level.label} term`}>{level.label}</span>
      </header>
      {showCategory && (
        <span className="term-category"><Icon name={category.icon} size={13} /> {category.label}</span>
      )}
      <p className="term-def"><MoveText text={term.def} /></p>
      {term.moves && (
        <p className="term-moves"><MoveText text={term.moves} loose /></p>
      )}
      {(aka.length > 0 || lesson) && (
        <footer className="term-foot">
          {aka.length > 0 && <span className="muted small">Also: {aka.join(', ')}</span>}
          {lesson && (
            <a className="term-lesson" href={`#/training/${lesson.id}`} title={`Open the lesson "${lesson.title}"`}>
              <Icon name="learn" size={14} /> {lesson.title}
            </a>
          )}
        </footer>
      )}
    </article>
  );
}
