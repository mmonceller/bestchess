/*
 * Slider stops for how long an invite stays open, in minutes (10 min to 24 h).
 * Stops are closer together at the short end, where a few minutes matter more.
 */
export const INVITE_STEPS = [10, 15, 20, 30, 45, 60, 90, 120, 180, 240, 360, 480, 720, 960, 1200, 1440];
export const DEFAULT_INVITE_MINUTES = 60;

export function formatDuration(minutes) {
  const m = Math.max(0, Math.round(minutes));
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} h ${rest} min` : `${h} h`;
}

const pad = (n) => String(n).padStart(2, '0');

/* "1:04:09" above an hour, "04:09" below. */
export function formatCountdown(ms) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return h ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}
