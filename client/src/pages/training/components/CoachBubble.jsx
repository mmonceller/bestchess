import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import { GlossText } from './Glossary.jsx';

export default function CoachBubble({ coach, children, large }) {
  return (
    <div className={`coach-bubble${large ? ' large' : ''}`} style={{ '--coach': coach.color }}>
      <div className="coach-id">
        <CoachAvatar coach={coach} size={large ? 52 : 42} />
        <div>
          <b>{coach.name}</b>
          <div className="muted small">{coach.title}</div>
        </div>
      </div>
      <div className="bubble-text"><GlossText>{children}</GlossText></div>
    </div>
  );
}
