/*
 * Goal points are the earned balance. A later spend appends to `ledger` and must not
 * rewrite `points`, games, lesson progress, or the trainer. Nothing in the app spends yet.
 *
 * Planned prices, not applied:
 * - 1 goal point buys 1 hint in a bot game.
 * - Tournament and stronger bots still stop at 10 hints in that game.
 * - Deleting one loss from history costs 25 goal points. Wins and draws are not deletable.
 */

export const HINT_POINT_COST = 1;
export const DELETE_LOSS_COST = 25;
export const CAPPED_HINT_LEVEL = 5;
export const CAPPED_HINT_MAX = 10;

export function earnedPoints(record) {
  return Math.max(0, Number(record?.points) || 0);
}

export function spentPoints(record) {
  if (!Array.isArray(record?.ledger)) return 0;
  return record.ledger.reduce((sum, row) => sum + (Number(row?.amount) || 0), 0);
}

/* What the player could spend. With no ledger this is the same number as points. */
export function spendablePoints(record) {
  return Math.max(0, earnedPoints(record) - spentPoints(record));
}

export function hintSpendQuote({ level, hintsUsed } = {}) {
  const capped = Number(level) >= CAPPED_HINT_LEVEL;
  const used = Math.max(0, Number(hintsUsed) || 0);
  if (capped && used >= CAPPED_HINT_MAX) {
    return { cost: HINT_POINT_COST, allowed: false, reason: 'limit' };
  }
  return { cost: HINT_POINT_COST, allowed: true, reason: null };
}

export function deleteLossQuote(game) {
  return { cost: DELETE_LOSS_COST, allowed: game?.result === 'loss' };
}
