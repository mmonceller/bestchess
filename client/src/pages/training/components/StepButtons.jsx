import Icon from '../../../components/icons/Icon.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { GlossText } from './Glossary.jsx';

export function ContinueButton({ onClick, label = 'Continue' }) {
  return (
    <button className="btn primary block icon-text" onClick={onClick} autoFocus>
      {label} <Icon name="arrowRight" size={18} />
    </button>
  );
}

export function HintButton({ onClick, disabled, label = 'Hint' }) {
  return (
    <button className="btn block icon-text" onClick={onClick} disabled={disabled}>
      <Icon name="hint" size={18} /> {label}
    </button>
  );
}

export function HintNotice({ children, extra }) {
  return (
    <Notice tone="ok" icon="hint" className="fade-in">
      <GlossText>{children}</GlossText>{extra}
    </Notice>
  );
}
