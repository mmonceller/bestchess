import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import MasteryChecklist from './MasteryChecklist.jsx';

/* Progress toward Master Class, opened from the lessons page. */
export default function MasteryModal({ mastery, onClose }) {
  return (
    <Modal onClose={onClose} className="mastery-modal">
      <button type="button" className="icon-btn mastery-close" onClick={onClose} aria-label="Close">
        <Icon name="close" size={18} />
      </button>
      <MasteryChecklist mastery={mastery} />
    </Modal>
  );
}
