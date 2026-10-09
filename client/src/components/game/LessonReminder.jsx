import Icon from '../icons/Icon.jsx';
import CoachAvatar from '../icons/CoachAvatar.jsx';

/* A coach's reminder from a lesson the player completed (see training/hints). */
export default function LessonReminder({ lesson, reviewLink = true }) {
  if (!lesson) return null;
  return (
    <div className="hint-lesson" style={{ '--coach': lesson.coach.color }}>
      <CoachAvatar coach={lesson.coach} size={34} />
      <div className="hint-lesson-body">
        <div className="hint-lesson-from small muted">
          {lesson.coach.name} · from your lesson <b>{lesson.title}</b>
        </div>
        <div>{lesson.text}</div>
        {reviewLink && (
          <a className="hint-lesson-link small" href={`#/training/${lesson.lessonId}`}>
            <Icon name="book" size={14} /> Review this lesson
          </a>
        )}
      </div>
    </div>
  );
}
