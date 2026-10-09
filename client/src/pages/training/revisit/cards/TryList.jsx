import Icon from '../../../../components/icons/Icon.jsx';
import Move from '../../../../components/notation/Move.jsx';

/* The player's moves in the order they were tried, each marked right or wrong. */
export default function TryList({ tries, label = 'Your moves' }) {
  if (!tries?.length) return null;
  return (
    <span className="try-list">
      <span className="muted small">{label}:</span>
      {tries.map((t, i) => (
        <span key={i} className={`try-chip ${t.ok ? 'ok' : 'miss'}`}>
          <Icon name={t.ok ? 'check' : 'close'} size={12} /> <Move san={t.san} />
        </span>
      ))}
    </span>
  );
}
