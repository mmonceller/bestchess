import Icon from '../../../components/icons/Icon.jsx';

/* Quiet note for a finished lesson whose saved answers no longer match the current steps. */
export default function UpdatedNote({ steps, bonus, compact = false }) {
  const text = steps
    ? 'This lesson has new steps since you last finished it. Play it again — your stars stay.'
    : 'The bonus round has new steps. Play it again so the new ones count.';
  if (compact) {
    return (
      <span className="updated-badge" title={text}>
        <Icon name="sparkle" size={12} /> Updated
      </span>
    );
  }
  return (
    <p className="updated-note">
      <Icon name="sparkle" size={15} />
      <span>{text}</span>
    </p>
  );
}
