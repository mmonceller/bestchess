export const RESIGN_ACCEPT_MS = 24 * 60 * 60_000;

export const resignLeft = (offeredAt, now = Date.now()) => (
  offeredAt ? Math.max(0, offeredAt + RESIGN_ACCEPT_MS - now) : 0
);
