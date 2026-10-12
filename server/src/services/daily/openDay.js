import crypto from 'node:crypto';
import { db, save } from '../../db/store.js';
import { measureDay, snapshot } from './measure.js';
import { canAssignPlan, planBlurb, planFor } from './plan.js';
import { lessonsDone, patternSeen } from './stats.js';
import { spendablePoints } from './wallet.js';
import { ensureGoalPointNotice } from './notices.js';

const DAY = /^\d{4}-\d{2}-\d{2}$/;
const HOUR = 60 * 60 * 1000;
const MAX_MESSAGES = 40;
const MAX_DAYS = 21;

const TITLES = {
  bot: 'Play 2 games against your recommended bot',
  friend: 'Play 1 game against an online friend',
  patterns: 'Play 10 puzzles in the Pattern Trainer',
  woodpecker: 'Do 10 exercises in Woodpecker Mode',
};

const OLD_BLURB = 'Four goals are waiting:';

function goalCopy(goal) {
  if (goal.title) return { title: goal.title, detail: goal.detail || '' };
  if (goal.id === 'bot' && !goal.botLevel) {
    return {
      title: 'Play 2 games against a bot',
      detail: 'Finish two bot games today. A recommended level appears once your skill rating is ready.',
    };
  }
  const detail = {
    bot: 'Finish two games today against the bot picked from your skill rating.',
    friend: 'Finish one game today with someone in an online room.',
    patterns: 'Puzzles you play in the Pattern Trainer after opening the app today.',
    woodpecker: 'Exercises you answer in Woodpecker Mode after opening the app today.',
  };
  return { title: TITLES[goal.id], detail: detail[goal.id] };
}

export function validWindow(day, since) {
  const start = Number(since);
  const now = Date.now();
  return DAY.test(day) && Number.isFinite(start) && start <= now + 5 * 60 * 1000 && start >= now - 26 * HOUR;
}

function recordFor(userId) {
  if (!db.daily) db.daily = {};
  return (db.daily[userId] ||= { points: 0, messages: [], days: {} });
}

function pushMessage(rec, title, body) {
  rec.messages.unshift({ id: crypto.randomUUID(), at: Date.now(), title, body, read: false });
  rec.messages = rec.messages.slice(0, MAX_MESSAGES);
}

function pruneDays(rec) {
  const keys = Object.keys(rec.days).sort();
  for (const key of keys.slice(0, Math.max(0, keys.length - MAX_DAYS))) delete rec.days[key];
}

/* Opens today's goals the first time this account is seen on that local day, then awards any that are already met. */
export function openDay(userId, day, since) {
  const rec = recordFor(userId);
  let changed = ensureGoalPointNotice(rec);
  if (!rec.days[day]) {
    const plan = planFor(userId, day);
    rec.days[day] = { since: Number(since), baseline: snapshot(userId), awarded: {}, plan };
    pruneDays(rec);
    pushMessage(rec, "Today's goals", planBlurb(plan));
    changed = true;
  } else if (canAssignPlan(rec.days[day])) {
    const plan = planFor(userId, day);
    rec.days[day].plan = plan;
    rec.days[day].baseline = {
      ...rec.days[day].baseline,
      lessons: lessonsDone(userId),
      patterns: patternSeen(userId),
    };
    const note = rec.messages.find((message) => message.title === "Today's goals" && String(message.body || '').startsWith(OLD_BLURB));
    if (note) note.body = planBlurb(plan);
    changed = true;
  }
  const measured = measureDay(userId, rec.days[day]);
  for (const goal of measured.goals) {
    if (!goal.done || rec.days[day].awarded[goal.id]) continue;
    rec.days[day].awarded[goal.id] = true;
    rec.points += goal.points;
    pushMessage(rec, 'Goal complete', `${goalCopy(goal).title}. You earned ${goal.points} goal points.`);
    changed = true;
  }
  if (changed) save();
  return {
    day,
    points: rec.points,
    spendable: spendablePoints(rec),
    unread: rec.messages.filter((m) => !m.read).length,
    goals: measured.goals.map((goal) => ({ ...goal, ...goalCopy(goal) })),
    report: measured.report,
    messages: rec.messages,
  };
}

/* A note becomes read when that message is opened, not when the inbox is. */
export function markMessageRead(userId, messageId) {
  const rec = recordFor(userId);
  const message = rec.messages.find((item) => item.id === messageId);
  if (message && !message.read) {
    message.read = true;
    save();
  }
  return { unread: rec.messages.filter((item) => !item.read).length };
}
