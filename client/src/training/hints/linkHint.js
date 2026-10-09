import { getLesson } from '../lessons/index.js';
import { getCoach } from '../coaches.js';
import { describeSan } from '../../chess/notation.js';
import { TAG_LESSONS, PIECE_LESSONS, PRIORITY_TAGS } from './lessonLinks.js';

/*
 * Picks the completed lesson that best explains a hint. Ideas behind the move win,
 * then the moving piece's basics, then (for players who did the notation lesson) a
 * plain-words reading of the move. Returns null when nothing the player learned fits.
 */
export function linkHintToLesson(hint, completed) {
  const tags = hint.tags || [];
  const ordered = [...PRIORITY_TAGS.filter((t) => tags.includes(t)), ...tags.filter((t) => !PRIORITY_TAGS.includes(t))];
  let link = null;
  for (const tag of ordered) {
    link = (TAG_LESSONS[tag] || []).find((l) => completed.has(l.lesson) && (!l.when || l.when(tags)));
    if (link) break;
  }
  if (!link && hint.piece && completed.has(PIECE_LESSONS[hint.piece]?.lesson)) link = PIECE_LESSONS[hint.piece];
  if (!link && completed.has('f-notation') && describeSan(hint.san)) {
    link = { lesson: 'f-notation', say: `${hint.san} means ${describeSan(hint.san)}.` };
  }
  const lesson = link && getLesson(link.lesson);
  if (!lesson) return null;
  return { lessonId: lesson.id, title: lesson.title, coach: getCoach(lesson.coach), text: link.say };
}
