import { db, save } from '../../db/store.js';

export const GOAL_POINTS_NOTICE_ID = 'goal-points-intro';

const GOAL_POINTS_NOTICE = {
  id: GOAL_POINTS_NOTICE_ID,
  title: 'Announcement: Goal Point System',
  body: 'Introducing a new feature: Goal Point System. Starting today, you will be given daily goals to achieve that will let you earn goal points. In the future, hints and AI coaching will require you to spend your goal points. For now, keep doing your daily goals and save up.',
};

/* One copy per account. Returns true when this record gained the note. */
export function ensureGoalPointNotice(record, at = Date.now()) {
  if (!record.messages) record.messages = [];
  const existing = record.messages.find((message) => message.id === GOAL_POINTS_NOTICE.id);
  if (existing) {
    if (existing.title === GOAL_POINTS_NOTICE.title) return false;
    existing.title = GOAL_POINTS_NOTICE.title;
    return true;
  }
  record.messages.unshift({ ...GOAL_POINTS_NOTICE, at, read: false });
  record.messages = record.messages.slice(0, 40);
  return true;
}

/* Writes today's note onto every account that does not already have it. */
export function announceGoalPoints(at = Date.now()) {
  if (!db.users?.length) return false;
  if (!db.daily) db.daily = {};
  let changed = false;
  for (const user of db.users) {
    const record = (db.daily[user.id] ||= { points: 0, messages: [], days: {} });
    if (ensureGoalPointNotice(record, at)) changed = true;
  }
  if (changed) save();
  return changed;
}
