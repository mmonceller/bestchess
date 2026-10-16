import crypto from 'node:crypto';
import { CORE_LESSONS } from '../../client/src/training/lessons/index.js';

/*
 * Creates a short-lived account on a running BestChess server and opens today's goals.
 * The account has finished every core lesson and has not played a game, which is the
 * case that should come back with 3 goals: Pattern Trainer, Woodpecker, and a bot game.
 *
 * Deployed site (default):
 *   npm run check:goals
 * This machine:
 *   API_URL=http://localhost:3001/api npm run check:goals
 */
const API = process.env.API_URL || 'https://bestchess.onrender.com/api';
const SITE = API.replace(/\/api\/?$/, '');
const EXPECTED = 3;

const stamp = Date.now().toString(36).slice(-6);
const username = `goal3_${stamp}`;
const password = crypto.randomBytes(9).toString('base64url');

async function call(path, { method = 'GET', body, token } = {}) {
  const res = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${method} ${path}: ${data.error || res.status}`);
  return data;
}

function localDay(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

const { token } = await call('/auth/register', { method: 'POST', body: { username, password } });

const now = Date.now();
const progress = Object.fromEntries(CORE_LESSONS.map((lesson, i) => [lesson.id, {
  stars: 1,
  attempts: 1,
  firstCompletedAt: now - (CORE_LESSONS.length - i) * 60_000,
}]));
await call('/progress/merge', { method: 'POST', token, body: { progress } });

const day = localDay();
const since = new Date(day + 'T00:00:00').getTime();
const daily = await call(`/daily?day=${day}&since=${since}`, { token });
const goals = daily.goals || [];

console.log(`Site: ${SITE}/#/login`);
console.log(`Account: ${username}`);
console.log(`Password: ${password}`);
console.log(`Core lessons marked done: ${CORE_LESSONS.length}`);
console.log(`Today (${day}) returned ${goals.length} goal${goals.length === 1 ? '' : 's'}:`);
for (const goal of goals) console.log(`  - ${goal.title} (${goal.id}, ${goal.progress}/${goal.target})`);
if (goals.length !== EXPECTED) {
  console.log(`Expected ${EXPECTED} for an account that has finished the core lessons and has not played yet.`);
  process.exit(1);
}
console.log('This matches the short list: no lesson left, no weak pattern, and no friend game.');
