import Icon from '../../../components/icons/Icon.jsx';
import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import Stars from '../components/Stars.jsx';
import CoachBubble from '../components/CoachBubble.jsx';
import { GlossaryProvider } from '../components/Glossary.jsx';
import UpdatedNote from '../hub/UpdatedNote.jsx';
import { lessonUpdate } from '../../../training/progress/lessonFresh.js';

const formatDate = (ms) => new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/* Shown when a player opens a lesson they've already finished. */
export default function RevisitIntro({ lesson, coach, record, onReview, onBonus, onFresh }) {
  const bonusCount = lesson.bonus.length;
  const update = lessonUpdate(record, lesson);
  const coachNote = update.steps
    ? 'This lesson grew since you last finished it. Play it again so the new steps count — your stars stay.'
    : update.bonus
      ? 'The bonus round has new steps. Play it again when you\'re ready — the main lesson is still here to review.'
      : record.bonusStars
        ? 'You\'ve finished the bonus round too. Look back over your answers, or try the bonus again for a better score.'
        : `Everything you learned is still here — review your answers step by step. Then there's a bonus round waiting at the end, with ${bonusCount} new step${bonusCount === 1 ? '' : 's'} and harder questions.`;
  return (
    <GlossaryProvider>
      <div className="revisit-intro card fade-in" style={{ '--coach': coach.color }}>
        <a href="#/training/lessons" className="orb small revisit-close" aria-label="Back to lessons"><Icon name="close" size={18} /></a>
        <CoachAvatar coach={coach} size={72} />
        <h1>Welcome back!</h1>
        <h3 className="muted">{lesson.title}</h3>
        {update.stale && <UpdatedNote steps={update.steps} bonus={update.bonus} />}
        <div className="revisit-stats">
          <div><Stars value={record.stars} /><span className="muted small">Lesson stars</span></div>
          <div><b>{record.attempts}</b><span className="muted small">{record.attempts === 1 ? 'time played' : 'times played'}</span></div>
          <div><b>{formatDate(record.firstCompletedAt)}</b><span className="muted small">First finished</span></div>
        </div>
        <CoachBubble coach={coach}>{coachNote}</CoachBubble>
        {bonusCount > 0 && !update.steps && (
          <div className="bonus-banner">
            <Icon name="gem" size={20} />
            <div>
              <b>Bonus round</b>
              <span className="muted small">
                {record.bonusStars ? <>Best: <Stars value={record.bonusStars} /></> : 'Extra knowledge and tougher challenges'}
              </span>
            </div>
          </div>
        )}
        <div className="revisit-actions">
          {update.steps ? (
            <button className="btn primary block icon-text" onClick={onFresh} autoFocus>
              <Icon name="retry" size={18} /> Play the new version
            </button>
          ) : (
            <button className="btn primary block icon-text" onClick={onReview} autoFocus>
              <Icon name="book" size={18} /> Review my answers
            </button>
          )}
          {bonusCount > 0 && !update.steps && (
            <button className="btn block icon-text" onClick={onBonus}>
              <Icon name="gem" size={18} /> {update.bonus ? 'Play the new bonus steps' : record.bonusStars ? 'Play the bonus round again' : 'Skip to the bonus round'}
            </button>
          )}
          {!update.steps && (
            <button className="btn ghost block icon-text" onClick={onFresh}>
              <Icon name="retry" size={18} /> Replay the lesson from scratch
            </button>
          )}
        </div>
      </div>
    </GlossaryProvider>
  );
}
