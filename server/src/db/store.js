import { config } from '../config.js';
import { createFileBackend } from './backends/fileBackend.js';
import { createMongoBackend } from './backends/mongoBackend.js';

/*
 * In-memory document store. Routes read and change `db` directly and call save();
 * changes are written to the backend (MongoDB when MONGODB_URI is set, otherwise a
 * JSON file) shortly afterwards.
 */
const EMPTY = { users: [], sessions: {}, games: [], progress: {}, trainer: {} };

export const db = structuredClone(EMPTY);

let backend = null;
let timer = null;
let writing = null;
let dirty = false;

export async function initStore() {
  backend = config.mongoUri
    ? await createMongoBackend(config.mongoUri, config.mongoDb)
    : createFileBackend(config.dataFile);
  Object.assign(db, structuredClone(EMPTY), (await backend.load()) || {});

  const now = Date.now();
  for (const [token, s] of Object.entries(db.sessions)) {
    if (now - s.createdAt > config.sessionTtlMs) { delete db.sessions[token]; dirty = true; }
  }
  if (dirty) save();
  return backend.name;
}

function schedule(ms) {
  if (!timer && !writing) timer = setTimeout(flush, ms);
}

async function flush() {
  timer = null;
  if (!dirty || !backend) return;
  dirty = false;
  let failed = false;
  writing = backend.write(db)
    .catch((err) => { failed = true; dirty = true; console.error('Could not save data:', err.message); })
    .finally(() => { writing = null; if (dirty) schedule(failed ? 3000 : 250); });
  await writing;
}

export function save() {
  dirty = true;
  schedule(250);
}

/* Writes any pending changes and disconnects. Used on shutdown. */
export async function closeStore() {
  clearTimeout(timer);
  timer = null;
  if (writing) await writing;
  clearTimeout(timer);
  timer = null;
  await flush();
  await backend?.close();
}

export const findUserById = (id) => db.users.find((u) => u.id === id);
export const findUserByName = (name) => db.users.find((u) => u.usernameLower === name.toLowerCase());

export function publicUser(u) {
  if (!u) return null;
  return { id: u.id, username: u.username, rating: u.rating, stats: u.stats, createdAt: u.createdAt };
}
