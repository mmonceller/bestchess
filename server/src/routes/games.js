import { Router } from 'express';
import { db, save } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';
import { recordGame } from '../services/gameRecords.js';
import { sanitizeReview } from '../services/reviewSanitizer.js';

const router = Router();
router.use(requireAuth);

const findMine = (req) => db.games.find((g) => g.id === req.params.id && g.userId === req.user.id);

router.get('/', (req, res) => {
  const games = db.games
    .filter((g) => g.userId === req.user.id)
    .sort((a, b) => b.date - a.date)
    .slice(0, 100)
    .map(({ pgn, review, ...rest }) => ({ ...rest, reviewed: Boolean(review), accuracy: review?.summary?.accuracy ?? null }));
  res.json({ games });
});

router.get('/:id', (req, res) => {
  const game = findMine(req);
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

/* Stores the move-by-move review the player's browser computed for one of their games. */
router.put('/:id/review', (req, res) => {
  const game = findMine(req);
  if (!game) return res.status(404).json({ error: 'Game not found.' });
  const review = sanitizeReview(req.body?.review);
  if (!review) return res.status(400).json({ error: 'Invalid review.' });
  review.color = game.color;
  game.review = review;
  save();
  res.json({ review });
});

export default router;
