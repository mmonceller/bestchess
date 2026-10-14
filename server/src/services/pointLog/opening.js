import { db, save } from '../../db/store.js';
import { balancesFor } from './balances.js';
import { POINT_KINDS } from './kinds.js';
import { appendPointRow } from './write.js';

const NOTE = 'Starting balance when point history began.';

/*
 * Once, the first time this build runs: one row per point type per account, stamped now.
 * Later changes are logged as they happen. A second startup does not write these again.
 */
export function openPointHistory(at = Date.now()) {
  if (!db.flags || typeof db.flags !== 'object' || Array.isArray(db.flags)) db.flags = {};
  if (db.flags.pointLogOpenedAt) return false;
  if ((db.pointLog || []).some((row) => row.opening)) {
    db.flags.pointLogOpenedAt = at;
    save();
    return false;
  }
  for (const user of db.users) {
    const balances = balancesFor(user.id);
    for (const kind of POINT_KINDS) {
      const balance = balances[kind.id];
      appendPointRow({
        userId: user.id,
        kind: kind.id,
        delta: balance ?? 0,
        balance,
        note: balance == null ? `${NOTE} None yet.` : NOTE,
        at,
        opening: true,
      });
    }
  }
  db.flags.pointLogOpenedAt = at;
  save();
  return true;
}
