/*
 * Move grading on a "chance of winning" scale (0-100), so a 2-pawn slip in a balanced
 * position counts more than the same slip when you are already winning by a rook.
 */
export const winPercent = (cp) => 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * cp)) - 1);

export const KINDS = {
  best: { label: 'Best move', short: 'Best', icon: 'star', tone: 'best' },
  excellent: { label: 'Excellent', short: 'Excellent', icon: 'sparkle', tone: 'good' },
  good: { label: 'Good move', short: 'Good', icon: 'checkCircle', tone: 'good' },
  forced: { label: 'Only move', short: 'Forced', icon: 'lock', tone: 'neutral' },
  inaccuracy: { label: 'Inaccuracy', short: 'Inaccuracy', icon: 'info', tone: 'ok' },
  mistake: { label: 'Mistake', short: 'Mistake', icon: 'warning', tone: 'bad' },
  blunder: { label: 'Blunder', short: 'Blunder', icon: 'xCircle', tone: 'worst' },
};

export const KIND_ORDER = ['best', 'excellent', 'good', 'forced', 'inaccuracy', 'mistake', 'blunder'];

export function classify(r, uci) {
  if (r.forced) return 'forced';
  if (uci === r.best || r.loss <= 5) return 'best';
  const lost = winPercent(r.bestCp) - winPercent(r.playedCp);
  if (lost < 2) return 'excellent';
  if (lost < 5) return 'good';
  if (lost < 10) return 'inaccuracy';
  if (lost < 20) return 'mistake';
  return 'blunder';
}

/* 100 for a perfect move, sliding toward 0 as the chance of winning drops. */
export function moveAccuracy(r) {
  if (r.forced) return 100;
  const lost = Math.max(0, winPercent(r.bestCp) - winPercent(r.playedCp));
  return Math.max(0, Math.min(100, 103.1668 * Math.exp(-0.04354 * lost) - 3.1669));
}
