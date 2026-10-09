import { Router } from 'express';
import crypto from 'node:crypto';
import { db, save, findUserByName } from '../db/store.js';
import { userView } from '../services/userView.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { createSession, destroySession } from '../auth/sessions.js';
import { requireAuth, bearerToken } from '../middleware/auth.js';

const router = Router();
const USERNAME = /^[a-zA-Z0-9_]{3,20}$/;

const failedLogins = new Map();
function tooManyAttempts(key) {
  const entry = failedLogins.get(key);
  return entry && entry.count >= 8 && Date.now() - entry.at < 10 * 60 * 1000;
}
function recordFailure(key) {
  const entry = failedLogins.get(key) || { count: 0, at: Date.now() };
  entry.count++;
  entry.at = Date.now();
  failedLogins.set(key, entry);
}

router.post('/register', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  if (!USERNAME.test(username)) return res.status(400).json({ error: 'Username must be 3–20 letters, numbers or underscores.' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  if (findUserByName(username)) return res.status(409).json({ error: 'That username is taken.' });

  const { salt, hash } = hashPassword(password);
  const user = {
    id: crypto.randomUUID(),
    username,
    usernameLower: username.toLowerCase(),
    salt,
    passHash: hash,
    rating: 1200,
    stats: { wins: 0, losses: 0, draws: 0 },
    createdAt: Date.now(),
  };
  db.users.push(user);
  save();
  res.json({ token: createSession(user.id), user: userView(user) });
});

router.post('/login', (req, res) => {
  const { username = '', password = '' } = req.body || {};
  const key = username.toLowerCase();
  if (tooManyAttempts(key)) return res.status(429).json({ error: 'Too many attempts. Try again in a few minutes.' });
  const user = findUserByName(username);
  if (!user || !verifyPassword(password, user.salt, user.passHash)) {
    recordFailure(key);
    return res.status(401).json({ error: 'Wrong username or password.' });
  }
  failedLogins.delete(key);
  res.json({ token: createSession(user.id), user: userView(user) });
});

router.post('/logout', (req, res) => {
  destroySession(bearerToken(req));
  res.json({ ok: true });
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ user: userView(req.user) });
});

export default router;
