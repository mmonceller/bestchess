/* How long a new game's invite stays open before it expires, in minutes. */
export const INVITE_MINUTES = { min: 10, max: 24 * 60, default: 60 };

/* Expired invites linger this long so the creator still sees why the game is gone. */
export const EXPIRED_KEEP_MS = 30 * 60_000;

export function inviteMinutes(value) {
  const n = Math.round(Number(value));
  if (!Number.isFinite(n)) return INVITE_MINUTES.default;
  return Math.min(INVITE_MINUTES.max, Math.max(INVITE_MINUTES.min, n));
}
