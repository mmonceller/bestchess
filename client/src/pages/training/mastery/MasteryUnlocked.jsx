import Icon from '../../../components/icons/Icon.jsx';
import './mastery.css';

/* Celebration banner at the top of the Master Class world. */
export default function MasteryUnlocked() {
  return (
    <div className="mastery-unlocked card pop-in">
      <Icon name="crown" size={26} />
      <div>
        <b>You've earned Master Class</b>
        <p className="muted small">Your lessons, puzzles and game results show you're ready for master-level ideas.</p>
      </div>
    </div>
  );
}
