import crypto from 'node:crypto';
import { db, save } from '../../db/store.js';
import { POINT_KINDS, POINT_LABELS } from './kinds.js';

const KEEP = 500;

export function changeAmount(before, after) {
  if (before == null && after == null) return null;
  if (before == null) return after;
  if (after == null) return -before;
  if (before === after) return 0;
  return after - before;
}

function trim(userId) {
  const mine = db.pointLog.filter((row) => row.userId === userId && !row.opening);
  if (mine.length <= KEEP) return;
  const drop = new Set(mine.slice(0, mine.length - KEEP).map((row) => row.id));
  db.pointLog = db.pointLog.filter((row) => !drop.has(row.id));
}

/* Adds one history row. Callers that batch rows save once themselves. */
export function appendPointRow(row, options = {}) {
  if (!Array.isArray(db.pointLog)) db.pointLog = [];
  db.pointLog.push({
    id: crypto.randomUUID(),
    at: row.at ?? Date.now(),
    userId: row.userId,
    kind: row.kind,
    delta: row.delta,
    balance: row.balance ?? null,
    note: String(row.note || '').slice(0, 240),
    ...(row.opening ? { opening: true } : {}),
  });
  if (options.trim !== false) trim(row.userId);
}

/* Skips a row when the number did not move. */
export function logChange(userId, kind, before, after, note) {
  const delta = changeAmount(before, after);
  if (delta == null || delta === 0) return;
  appendPointRow({ userId, kind, delta, balance: after ?? null, note });
  save();
}

/* Newest changes, plus every starting-balance row so those do not age off the list. */
export function pointLogForAdmin() {
  const names = new Map(db.users.map((user) => [user.id, user.username]));
  const rows = (db.pointLog || []).filter((row) => names.has(row.userId));
  const opening = rows.filter((row) => row.opening);
  const recent = rows.filter((row) => !row.opening).sort((a, b) => b.at - a.at).slice(0, 300);
  const seen = new Set();
  return [...recent, ...opening]
    .sort((a, b) => b.at - a.at || a.kind.localeCompare(b.kind))
    .filter((row) => {
      if (seen.has(row.id)) return false;
      seen.add(row.id);
      return true;
    })
    .map((row) => ({
      id: row.id,
      userId: row.userId,
      username: names.get(row.userId),
      kind: row.kind,
      label: POINT_LABELS[row.kind] || row.kind,
      delta: row.delta,
      balance: row.balance,
      note: row.note,
      at: row.at,
      opening: Boolean(row.opening),
    }));
}

export const trackedKinds = POINT_KINDS.map((kind) => kind.id);
