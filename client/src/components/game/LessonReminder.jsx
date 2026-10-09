import Icon from '../icons/Icon.jsx';
import CoachAvatar from '../icons/CoachAvatar.jsx';
import MoveText from '../notation/MoveText.jsx';

/*
 * A coach's tip tied to a lesson (see training/hints): a reminder from a lesson the player
 * completed, or — when `lesson.suggested` — a lesson at their level that teaches the idea.
 */
export default function LessonReminder({ lesson, reviewLink = true }) {
  if (!lesson) return null;
  return (
    <div className="hint-lesson" style={{ '--coach': lesson.coach.color }}>
      <CoachAvatar coach={lesson.coach} size={34} />
      <div className="hint-lesson-body">
        <div className="hint-lesson-from small muted">
          {lesson.coach.name} · {lesson.suggested ? 'a lesson for your level:' : 'from your lesson'} <b>{lesson.title}</b>
        </div>
        <div><MoveText text={lesson.text} /></div>
        {reviewLink && (
          <a className="hint-lesson-link small" href={`#/training/${lesson.lessonId}`}>
            <Icon name="book" size={14} /> {lesson.suggested ? 'Learn this in the lesson' : 'Review this lesson'}
          </a>
        )}
      </div>
    </div>
  );
}
