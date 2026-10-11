import Icon from '../../../components/icons/Icon.jsx';
import { INACTIVE_DAYS } from './inactivity.js';

/* Tells the player their unfinished bot game expired and counted as a resignation. */
export default function ExpiredNote({ note, onDismiss }) {
  return (
    <div className="expired-banner">
      <Icon name="clock" size={18} />
      <span>
        Your unfinished game against <b>{note.level}</b> expired after {INACTIVE_DAYS} days without a move,
        so it counts as a resignation.{note.recorded && ' You can find it in your profile.'}
      </span>
      <button type="button" className="btn small" onClick={onDismiss}>Got it</button>
    </div>
  );
}
