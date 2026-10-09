import { COACH_FACES } from './coachFaces.jsx';
import './icons.css';

export default function CoachAvatar({ coach, size = 42, className = '' }) {
  const face = COACH_FACES[coach.mascot] || COACH_FACES.pip;
  return (
    <span className={`coach-avatar ${className}`} style={{ '--coach': coach.color, width: size, height: size }}>
      <svg className="coach-face" viewBox="0 0 64 64" aria-hidden="true">{face(coach.color)}</svg>
    </span>
  );
}
