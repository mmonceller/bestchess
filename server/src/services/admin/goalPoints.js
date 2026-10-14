import { db, save, findUserById } from '../../db/store.js';

const MAX_POINTS = 1_000_000;

/* Whole-number balance. Empty or fractional input is rejected. */
export function readGoalPoints(value) {
  if (typeof value === 'string' && value.trim() === '') return null;
  const points = Number(value);
  if (!Number.isInteger(points) || points < 0 || points > MAX_POINTS) return null;
  return points;
}

/*
 * Temporary writer for the admin page. Sets the earned balance and leaves the
 * day's plan, inbox, and any spend ledger alone.
 */
export function setGoalPoints(userId, points) {
  if (!findUserById(userId)) return null;
  if (!db.daily) db.daily = {};
  const record = (db.daily[userId] ||= { points: 0, messages: [], days: {} });
  if (!Array.isArray(record.messages)) record.messages = [];
  if (!record.days || typeof record.days !== 'object') record.days = {};
  record.points = points;
  save();
  return points;
}
