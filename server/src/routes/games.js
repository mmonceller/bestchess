import { Router } from 'express';
import { db } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';
import { recordGame } from '../services/gameRecords.js';

const router = Router();
router.use(requireAuth);

router.get('/', (req, res) => {
  const games = db.games
    .filter((g) => g.userId === req.user.id)
    .sort((a, b) => b.date - a.date)
    .slice(0, 100)
    .map(({ pgn, ...rest }) => rest);
  res.json({ games });
});

router.get('/:id', (req, res) => {
  const game = db.games.find((g) => g.id === req.params.id && g.userId === req.user.id);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  res.json({ game });
});

/* Only computer games are submitted by the client; online games are recorded by the server. */
router.post('/', (req, res) => {
  const body = req.body || {};
  if (body.mode !== 'computer') return res.status(400).json({ error: 'Only computer games can be submitted.' });
  const record = recordGame(req.user.id, body);
  res.json({ game: record });
});

export default router;
