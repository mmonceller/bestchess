import { useEffect } from 'react';
import Stars from '../components/Stars.jsx';
import CoachBubble from '../components/CoachBubble.jsx';
import { GlossaryProvider } from '../components/Glossary.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import { sounds } from '../../../utils/sound.js';

const VERDICT = {
  3: 'Flawless! You\'ve truly mastered this topic.',
  2: 'Strong work on the harder material. One more go and it\'s perfect.',
  1: 'Those were tough questions — and you got through them. Come back and try again soon.',
};

export default function BonusComplete({ lesson, coach, result, onReview, onRetry }) {
  useEffect(() => { sounds.end(); }, []);
  return (
    <GlossaryProvider>
      <div className="lesson-complete card fade-in" style={{ '--coach': coach.color }}>
        <div className="confetti" aria-hidden="true">{Array.from({ length: 18 }, (_, i) => <i key={i} style={{ '--i': i }} />)}</div>
        <span className="bonus-badge"><Icon name="gem" size={16} /> Bonus round</span>
        <h1>Bonus complete!</h1>
        <h3 className="muted">{lesson.title}</h3>
        <Stars value={result.stars} size="big" />
        <div className="xp-gain pop-in">
          <Icon name="bolt" size={18} />
          {result.xp > 0 ? <b>+{result.xp} XP</b> : <span>Practice round — beat your bonus score to earn more XP</span>}
        </div>
        <div className="complete-stats">
          <div><b>{result.mistakes}</b><span className="muted">mistakes</span></div>
          <div><b>{result.hints}</b><span className="muted">hints</span></div>
          <div><b>{lesson.bonus.length}</b><span className="muted">bonus steps</span></div>
        </div>
        <CoachBubble coach={coach}>{VERDICT[result.stars]}</CoachBubble>
        <div className="row complete-actions">
          <button className="btn primary icon-text" onClick={onReview}><Icon name="book" size={18} /> Review my answers</button>
          <button className="btn icon-text" onClick={onRetry}><Icon name="retry" size={18} /> Bonus again</button>
          <a className="btn ghost icon-text" href="#/training"><Icon name="map" size={18} /> Lesson map</a>
        </div>
      </div>
    </GlossaryProvider>
  );
}
