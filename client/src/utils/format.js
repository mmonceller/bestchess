/* "71:23:45" — hours can run past 24 so two timers are easy to compare. */
export function formatHms(ms) {
  const t = Math.max(0, Math.floor(Number(ms) / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

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

/* Time of day, plus the date when it isn't today: "3:21 PM" or "Oct 11, 3:21 PM". */
export function formatDateTime(ts, { seconds = false } = {}) {
  if (!ts) return '';
  const d = new Date(ts);
  const time = d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit', ...(seconds ? { second: '2-digit' } : {}) });
  if (d.toDateString() === new Date().toDateString()) return time;
  return `${d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}, ${time}`;
}

export function formatScore(score, turn) {
  const white = turn === 'w' ? score : -score;
  if (Math.abs(white) > 29000) return `${white > 0 ? '' : '-'}M${Math.ceil((30000 - Math.abs(white)) / 2)}`;
  const v = white / 100;
  return `${v > 0 ? '+' : ''}${v.toFixed(1)}`;
}
