import Icon from '../icons/Icon.jsx';
import MoveText from '../notation/MoveText.jsx';

const DEFAULT_ICON = { good: 'checkCircle', ok: 'info', bad: 'xCircle' };

/* Tinted message box with a leading icon (good / ok / bad tones). */
export default function Notice({ tone = 'ok', icon, children, className = '' }) {
  return (
    <div className={`feedback with-icon ${tone} ${className}`}>
      <Icon name={icon || DEFAULT_ICON[tone]} size={18} />
      <span><MoveText>{children}</MoveText></span>
    </div>
  );
}
