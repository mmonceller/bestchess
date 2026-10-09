import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import { getCoach } from '../../../training/coaches.js';
import { PATHS } from '../../../training/trainerStore.js';

/* First-visit sheet: pick a starting point. Sets the recommended track and the starting puzzle rating. */
export default function WelcomeSheet({ isGuest, current, onPick, onClose }) {
  return (
    <Modal onClose={onClose}>
      <div className="welcome-sheet">
        <div className="welcome-head">
          <CoachAvatar coach={getCoach('pip')} size={60} />
          <div>
            <h2>Welcome to Learn Chess!</h2>
            <p className="muted">Where would you like to start? You can change this any time.</p>
          </div>
        </div>
        <div className="path-options">
          {Object.entries(PATHS).map(([id, p]) => (
            <button key={id} className={`path-option${current === id ? ' active' : ''}`} onClick={() => onPick(id)}>
              <span className="path-icon"><Icon name={p.icon} size={26} /></span>
              <span className="path-text">
                <b>{p.label}</b>
                <span className="muted small">{p.blurb}</span>
              </span>
              <Icon name="arrowRight" size={18} className="muted" />
            </button>
          ))}
        </div>
        {isGuest && (
          <p className="welcome-guest small">
            <Icon name="warning" size={16} />
            <span>
              You're playing as a guest, so your progress will not be saved when you leave.{' '}
              <a className="link" href="#/login?next=/training">Log in</a> to keep your stars, XP and puzzle rating.
            </span>
          </p>
        )}
        <button className="btn ghost block" onClick={onClose}>Just let me look around</button>
      </div>
    </Modal>
  );
}
