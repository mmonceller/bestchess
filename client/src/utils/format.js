export function formatClock(ms) {
  if (ms == null) return '';
  const total = Math.max(0, ms);
  const s = Math.floor(total / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (total < 10_000) return `${m}:${String(sec).padStart(2, '0')}.${Math.floor((total % 1000) / 100)}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

export function formatDate(ts) {
  return new Date(ts).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatScore(score, turn) {
  const white = turn === 'w' ? score : -score;
  if (Math.abs(white) > 29000) return `${white > 0 ? '' : '-'}M${Math.ceil((30000 - Math.abs(white)) / 2)}`;
  const v = white / 100;
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}`;
}
