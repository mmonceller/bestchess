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
};
