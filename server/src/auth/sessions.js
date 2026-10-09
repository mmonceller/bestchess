import crypto from 'node:crypto';
import { db, save, findUserById } from '../db/store.js';
import { config } from '../config.js';

export function createSession(userId) {
  const token = crypto.randomBytes(24).toString('hex');
  db.sessions[token] = { userId, createdAt: Date.now() };
  save();
  return token;
}

export function destroySession(token) {
  if (db.sessions[token]) {
    delete db.sessions[token];
    save();
  }
}

export function userFromToken(token) {
  if (!token) return null;
  const s = db.sessions[token];
  if (!s) return null;
  if (Date.now() - s.createdAt > config.sessionTtlMs) {
    destroySession(token);
    return null;
  }
  return findUserById(s.userId) || null;
}
