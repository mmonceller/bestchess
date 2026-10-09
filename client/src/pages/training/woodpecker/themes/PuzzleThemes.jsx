import Icon from '../../../../components/icons/Icon.jsx';
import { getLesson } from '../../../../training/lessons/index.js';
import { MOTIFS, puzzleLesson, puzzleMotifs } from '../../../../training/woodpecker/motifs.js';
import './themes.css';

/*
 * The tactical themes of one exercise. While solving (`hint`) it shows the clue for the main
 * theme; afterwards it names the themes and links the lesson that teaches them.
 */
export default function PuzzleThemes({ puzzle, hint = false }) {
  const motifs = puzzleMotifs(puzzle);
  const lesson = getLesson(puzzleLesson(puzzle));
  if (hint) {
    if (!motifs.length) return null;
    const main = MOTIFS[motifs[0]];
    return (
      <p className="wp-theme-hint">
        <Icon name={main.icon} size={15} /> <b>Theme: {motifs.map((m) => MOTIFS[m].name).join(' + ')}.</b> {main.tip}
      </p>
    );
  }
  return (
    <div className="wp-themes">
      {motifs.length > 0 && (
        <span className="wp-theme-chips">
          {motifs.map((m) => (
            <span key={m} className="wp-theme-chip small"><Icon name={MOTIFS[m].icon} size={13} /> {MOTIFS[m].name}</span>
          ))}
        </span>
      )}
      {lesson && (
        <a className="link small wp-theme-lesson" href={`#/training/${lesson.id}`}>
          <Icon name="book" size={13} /> Learn this idea: {lesson.title}
        </a>
      )}
    </div>
  );
}
