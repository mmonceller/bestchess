import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import Stars from '../components/Stars.jsx';
import { getCoach } from '../../../training/coaches.js';
import { lessonXp } from '../../../training/xp.js';

const FEATURES = [
  { type: 'collect', icon: 'star', label: 'Star hunts' },
  { type: 'squares', icon: 'grid', label: 'Board game' },
  { type: 'quiz', icon: 'question', label: 'Quick questions' },
  { type: 'move', icon: 'target', label: 'Find the move' },
  { type: 'best', icon: 'mind', label: 'Your own ideas' },
  { type: 'drill', icon: 'bot', label: 'Play vs computer' },
];

/* Lesson preview: who teaches it, what's inside and the best score so far. */
export default function LessonSheet({ lesson, progress, onClose }) {
  const coach = getCoach(lesson.coach);
  const p = progress[lesson.id];
  const features = FEATURES.filter((f) => lesson.steps.some((s) => s.type === f.type)).slice(0, 4);
  return (
    <Modal onClose={onClose}>
      <div className="lesson-sheet" style={{ '--coach': coach.color }}>
        <button className="icon-btn sheet-close" onClick={onClose} aria-label="Close"><Icon name="close" size={18} /></button>
        <div className="sheet-coach">
          <CoachAvatar coach={coach} size={64} />
          <div>
            <b>{coach.name}</b>
            <div className="muted small">{coach.title}</div>
          </div>
        </div>
        <p className="sheet-intro">“{coach.intro}”</p>
        <h2>{lesson.title}</h2>
        <p className="muted">{lesson.summary}</p>
        <div className="sheet-meta">
          <span className="chip"><Icon name="clock" size={15} /> {lesson.minutes} min</span>
          <span className="chip"><Icon name="bolt" size={15} /> up to {lessonXp(3)} XP</span>
          {features.map((f) => <span key={f.type} className="chip"><Icon name={f.icon} size={15} /> {f.label}</span>)}
        </div>
        {p && (
          <div className="sheet-best">
            <span className="muted small">Your best</span>
            <Stars value={p.stars} />
          </div>
        )}
        <a className="btn primary block icon-text" href={`#/training/${lesson.id}`}>
          <Icon name={p ? 'retry' : 'play'} size={18} /> {p ? 'Play again' : 'Start lesson'}
        </a>
      </div>
    </Modal>
  );
}
