import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import express from 'express';
import { config } from './config.js';
import { initStore, closeStore } from './db/store.js';
import authRoutes from './routes/auth.js';
import gameRoutes from './routes/games.js';
import progressRoutes from './routes/progress.js';
import trainerRoutes from './routes/trainer.js';
import onlineRoutes from './routes/online.js';
import { attachSocketServer } from './online/socketServer.js';

const storage = await initStore();

const app = express();
app.disable('x-powered-by');
app.use('/api/games', express.json({ limit: '400kb' }));
app.use(express.json({ limit: '100kb' }));

app.use('/api/auth', authRoutes);
app.use('/api/games', gameRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/online', onlineRoutes);
const startedAt = new Date().toISOString();
app.get('/api/health', (req, res) => res.json({ ok: true, commit: process.env.RENDER_GIT_COMMIT?.slice(0, 7) || null, startedAt }));
app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

if (fs.existsSync(config.clientDist)) {
  app.use(express.static(config.clientDist, { maxAge: '7d', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(config.clientDist, 'index.html')));
}

const server = http.createServer(app);
attachSocketServer(server);
server.listen(config.port, () => {
  console.log(`BestChess server listening on http://localhost:${config.port} (storage: ${storage})`);
});

let stopping = false;
async function shutdown(signal) {
  if (stopping) return;
  stopping = true;
  console.log(`${signal} received, saving data and shutting down`);
  server.close();
  try {
    await closeStore();
  } finally {
    process.exit(0);
  }
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
