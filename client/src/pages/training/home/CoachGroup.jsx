import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import { COACHES } from '../../../training/coaches.js';

const ORDER = ['pip', 'mira', 'viktor', 'kai', 'elena', 'rook', 'lin'];

/* The coaches standing together, for the lessons card. */
export default function CoachGroup() {
  return (
    <div className="coach-group" aria-hidden="true">
      {ORDER.map((id) => (
        <CoachAvatar key={id} coach={COACHES[id]} size={64} />
      ))}
    </div>
  );
}
