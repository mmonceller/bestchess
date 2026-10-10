import { CORE_LESSONS } from '../../client/src/training/lessons/index.js';
import { MASTERY } from '../../client/src/training/mastery/criteria.js';
import { getLevel } from '../../client/src/engine/levels.js';

/*
 * Dev helper: registers a test account on the running server and gives it everything the
 * Master Class needs (every core lesson, a strong Pattern Trainer record, and wins against
 * strong bots). Usage: node scripts/dev/seedMasterAccount.js [username] [password]
 */
const API = process.env.API_URL || 'http://localhost:3001/api';
const [username = 'master1', password = 'chess123'] = process.argv.slice(2);
const WIN_LEVEL = 5;
const WINS = Math.max(MASTERY.strongWins, 5);

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

const { token } = await call('/auth/register', { method: 'POST', body: { username, password } });

const now = Date.now();
const progress = Object.fromEntries(CORE_LESSONS.map((l, i) => [l.id, { stars: 3, attempts: 1, firstCompletedAt: now - (CORE_LESSONS.length - i) * 3_600_000 }]));
await call('/progress/merge', { method: 'POST', token, body: { progress } });

const solved = MASTERY.puzzlesSolved + 5;
await call('/trainer', {
  method: 'PUT',
  token,
  body: { trainer: { path: 'improve', rating: MASTERY.puzzleRating + 50, games: solved + 5, solved, xp: 5000, streak: 3, bestStreak: 8 } },
});

const level = getLevel(WIN_LEVEL);
for (let i = 0; i < WINS; i++) {
  await call('/games', {
    method: 'POST',
    token,
    body: { mode: 'computer', level: WIN_LEVEL, opponent: level.name, color: i % 2 ? 'b' : 'w', result: 'win', reason: 'checkmate', moves: 60 },
  });
}

console.log(`Created ${username} / ${password}: ${CORE_LESSONS.length} lessons, trainer rating ${MASTERY.puzzleRating + 50}, ${solved} puzzles, ${WINS} wins vs ${level.name}.`);
