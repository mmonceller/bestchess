import Icon from '../icons/Icon.jsx';
import CoachAvatar from '../icons/CoachAvatar.jsx';

/*
 * AI assistant card: best move, one or two short reasons, and the expected follow-up.
 * `lesson` (optional) is a reminder from a lesson the player completed.
 */
export default function HintCard({ hint, loading, onClose, title = 'AI Coach', lesson, reviewLink = true }) {
  if (!hint && !loading) return null;
  return (
    <div className="hint-card fade-in">
      <div className="hint-head">
        <span className="hint-avatar"><Icon name="bot" size={18} /></span>
        <b>{title}</b>
        <span className="spacer" />
        {onClose && <button className="btn ghost small" onClick={onClose} aria-label="Close hint"><Icon name="close" size={16} /></button>}
      </div>
      {loading ? (
        <div className="row muted"><span className="spinner" /> Thinking…</div>
      ) : (
        <>
          {hint.san && <div className="hint-move">Try <b>{hint.san}</b></div>}
          <ul className="hint-reasons">
            {hint.reasons?.map((r, i) => <li key={i}>{r}</li>)}
          </ul>
          {hint.line?.length > 1 && <div className="hint-line muted">Likely line: {hint.line.join(' ')}</div>}
          {hint.assessment && <div className="hint-assess">{hint.assessment}</div>}
          {lesson && (
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
          )}
        </>
      )}
    </div>
  );
}
