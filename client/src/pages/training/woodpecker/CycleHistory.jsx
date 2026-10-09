import { accuracy, formatDuration } from '../../../training/woodpecker/cycles.js';

/* Finished cycles: time and accuracy, newest last. */
export default function CycleHistory({ history, compact = false }) {
  if (!history.length) return null;
  const rows = compact ? history.slice(-3) : history;
  return (
    <ul className={`wp-history${compact ? ' compact' : ''}`}>
      {rows.map((h, i) => {
        const prev = history[history.length - rows.length + i - 1];
        const faster = prev && prev.ms ? Math.round((1 - h.ms / prev.ms) * 100) : null;
        return (
          <li key={`${h.cycle}-${h.day}`}>
            <span>Cycle {h.cycle}</span>
            <b>{formatDuration(h.ms)}</b>
            <span>{accuracy(h.solved, h.total)}%</span>
            {!compact && <span className="muted">{faster === null ? '—' : faster >= 0 ? `${faster}% faster` : `${-faster}% slower`}</span>}
          </li>
        );
      })}
    </ul>
  );
}
