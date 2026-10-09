import Icon from '../../../components/icons/Icon.jsx';
import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import Stars from '../components/Stars.jsx';
import CoachBubble from '../components/CoachBubble.jsx';
import { GlossaryProvider } from '../components/Glossary.jsx';

const formatDate = (ms) => new Date(ms).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

/* Shown when a player opens a lesson they've already finished. */
export default function RevisitIntro({ lesson, coach, record, onReview, onBonus, onFresh }) {
  const bonusCount = lesson.bonus.length;
  return (
    <GlossaryProvider>
      <div className="revisit-intro card fade-in" style={{ '--coach': coach.color }}>
        <a href="#/training" className="orb small revisit-close" aria-label="Back to training"><Icon name="close" size={18} /></a>
        <CoachAvatar coach={coach} size={72} />
        <h1>Welcome back!</h1>
        <h3 className="muted">{lesson.title}</h3>
        <div className="revisit-stats">
          <div><Stars value={record.stars} /><span className="muted small">Lesson stars</span></div>
          <div><b>{record.attempts}</b><span className="muted small">{record.attempts === 1 ? 'time played' : 'times played'}</span></div>
          <div><b>{formatDate(record.firstCompletedAt)}</b><span className="muted small">First finished</span></div>
        </div>
        <CoachBubble coach={coach}>
          {record.bonusStars
            ? 'You\'ve finished the bonus round too. Look back over your answers, or try the bonus again for a better score.'
            : `Everything you learned is still here — review your answers step by step. Then there's a bonus round waiting at the end, with ${bonusCount} new step${bonusCount === 1 ? '' : 's'} and harder questions.`}
        </CoachBubble>
        {bonusCount > 0 && (
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
          <button className="btn primary block icon-text" onClick={onReview} autoFocus>
            <Icon name="book" size={18} /> Review my answers
          </button>
          {bonusCount > 0 && (
            <button className="btn block icon-text" onClick={onBonus}>
              <Icon name="gem" size={18} /> {record.bonusStars ? 'Play the bonus round again' : 'Skip to the bonus round'}
            </button>
          )}
          <button className="btn ghost block icon-text" onClick={onFresh}>
            <Icon name="retry" size={18} /> Replay the lesson from scratch
          </button>
        </div>
      </div>
    </GlossaryProvider>
  );
}
