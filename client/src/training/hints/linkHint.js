import { getLesson, TRACKS } from '../lessons/index.js';
import { getCoach } from '../coaches.js';
import { describeSan } from '../../chess/notation.js';
import { TAG_LESSONS, PIECE_LESSONS, PRIORITY_TAGS } from './lessonLinks.js';

const GATED = new Set(TRACKS.filter((t) => t.gated).map((t) => t.id));
const trackOf = (id) => getLesson(id)?.track;

/*
 * Picks the lesson that best explains a hint.
 *  1. A completed lesson about the idea behind the move — preferring lessons from the
 *     tracks that fit the player's skill level (`tracks`, most relevant first).
 *  2. The moving piece's basics, or a plain-words reading of the move for players who did
 *     the notation lesson.
 *  3. Otherwise, an unfinished lesson about the idea from a track that suits the player's
 *     level (`suggested: true`), so the hint points somewhere they can learn it.
 * Returns null when nothing fits.
 */
export function linkHintToLesson(hint, completed, tracks = null) {
  const tags = hint.tags || [];
  const ordered = [...PRIORITY_TAGS.filter((t) => tags.includes(t)), ...tags.filter((t) => !PRIORITY_TAGS.includes(t))];
  const fits = (l) => tracks?.includes(trackOf(l.lesson));
  let link = null;
  let suggestion = null;
  for (const tag of ordered) {
    const options = (TAG_LESSONS[tag] || []).filter((l) => !l.when || l.when(tags));
    const done = options.filter((l) => completed.has(l.lesson));
    link = done.find(fits) || done[0] || null;
    if (link) break;
    suggestion ||= options.find((l) => fits(l) && !GATED.has(trackOf(l.lesson))) || null;
  }
  if (!link && hint.piece && completed.has(PIECE_LESSONS[hint.piece]?.lesson)) link = PIECE_LESSONS[hint.piece];
  if (!link && completed.has('f-notation') && describeSan(hint.san)) {
    link = { lesson: 'f-notation', say: `${hint.san} means ${describeSan(hint.san)}.` };
  }
  const suggested = !link && Boolean(suggestion);
  const chosen = link || suggestion;
  const lesson = chosen && getLesson(chosen.lesson);
  if (!lesson) return null;
  return { lessonId: lesson.id, title: lesson.title, coach: getCoach(lesson.coach), text: chosen.say, suggested };
}
