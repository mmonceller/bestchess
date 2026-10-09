import Icon from '../../../components/icons/Icon.jsx';
import MasteryChecklist from '../mastery/MasteryChecklist.jsx';

/* Opening a Master Class lesson by link before it's unlocked. */
export default function LockedLesson({ mastery }) {
  return (
    <div className="locked-lesson fade-in">
      <a href="#/training" className="btn ghost icon-text"><Icon name="arrowLeft" size={18} /> Back to training</a>
      <MasteryChecklist mastery={mastery} />
    </div>
  );
}
