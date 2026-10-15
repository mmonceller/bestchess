import Icon from '../icons/Icon.jsx';
import './skill.css';

/* Warns that a much easier opponent cannot raise skill, while a loss still can lower it. */
export default function SkillGapNote({ children }) {
  return (
    <p className="skill-gap-note small">
      <Icon name="warning" size={16} />
      <span>{children}</span>
    </p>
  );
}
