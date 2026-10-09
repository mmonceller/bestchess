import { useEffect } from 'react';
import Stars from './components/Stars.jsx';
import CoachBubble from './components/CoachBubble.jsx';
import { GlossaryProvider } from './components/Glossary.jsx';
import Icon from '../../components/icons/Icon.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { sounds } from '../../utils/sound.js';

const VERDICT = {
  3: 'Perfect! No mistakes and no hints. You really understand this one.',
  2: 'Nice work! Play it one more time and it will stick for good.',
  1: 'You finished it — well done! Try it again later to earn all 3 stars.',
};

export default function LessonComplete({ lesson, coach, result, nextLesson, onRetry }) {
  const { user } = useAuth();
  useEffect(() => { sounds.end(); }, []);
  return (
    <GlossaryProvider>
      <div className="lesson-complete card fade-in" style={{ '--coach': coach.color }}>
        <div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        <h1>Lesson complete!</h1>
        <h3 className="muted">{lesson.title}</h3>
        <Stars value={result.stars} size="big" />
        <div className="xp-gain pop-in">
          <Icon name="bolt" size={18} />
          {result.xp > 0 ? <b>+{result.xp} XP</b> : <span>{result.repeat ? 'Practice round — beat your star score to earn more XP' : 'Lesson done'}</span>}
        </div>
        <div className="complete-stats">
          <div><b>{result.mistakes}</b><span className="muted">mistakes</span></div>
          <div><b>{result.hints}</b><span className="muted">hints</span></div>
          <div><b>{lesson.steps.length}</b><span className="muted">steps</span></div>
        </div>
        <CoachBubble coach={coach}>{VERDICT[result.stars]}</CoachBubble>
        {!user && (
          <p className="small muted guest-note">
            <Icon name="warning" size={14} /> You're learning as a guest — this progress disappears when you leave.{' '}
            <a className="link" href="#/login?next=/training">Log in to keep it</a>
          </p>
        )}
        <div className="row complete-actions">
          {nextLesson && (
            <a className="btn primary icon-text" href={`#/training/${nextLesson.id}`}>
              Next: {nextLesson.title} <Icon name="arrowRight" size={18} />
            </a>
          )}
          <button className="btn icon-text" onClick={onRetry}><Icon name="retry" size={18} /> Play again</button>
          <a className="btn ghost icon-text" href="#/training"><Icon name="map" size={18} /> Lesson map</a>
        </div>
      </div>
    </GlossaryProvider>
  );
}
