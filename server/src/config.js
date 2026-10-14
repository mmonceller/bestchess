import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export const config = {
  port: Number(process.env.PORT) || 3001,
  dataFile: process.env.DATA_FILE || path.join(root, 'data', 'db.json'),
  mongoUri: process.env.MONGODB_URI || '',
  mongoDb: process.env.MONGODB_DB || 'bestchess',
  clientDist: path.resolve(root, '..', 'client', 'dist'),
  sessionTtlMs: 1000 * 60 * 60 * 24 * 30,
  roomIdleMs: 1000 * 60 * 60 * 6,
  adminUser: oneAdminUser(process.env.ADMIN_USER),
};

/* One username. A list, or anything that is not a real username, leaves the page locked. */
function oneAdminUser(value) {
  const name = String(value || '').trim().toLowerCase();
  return /^[a-z0-9_]{3,20}$/.test(name) ? name : '';
}
