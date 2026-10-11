import { Router } from 'express';
import { bearerToken } from '../middleware/auth.js';
import { userFromToken } from '../auth/sessions.js';
import { activeGamesFor } from '../online/activeGames.js';
import { notifyRoom } from '../online/notify.js';
import { seatFor } from '../online/seatFor.js';

const router = Router();

/* Works for guests too: they send the seats their browser remembered. */
router.post('/active', (req, res) => {
  const user = userFromToken(bearerToken(req));
  const saved = Array.isArray(req.body?.saved)
    ? req.body.saved.map((s) => ({ code: String(s?.code || '').slice(0, 8), key: String(s?.key || '').slice(0, 64) }))
    : [];
  res.json({ games: activeGamesFor({ userId: user?.id ?? null, saved }) });
});

function act(req, res, run) {
  const { room, color } = seatFor(req);
  if (!room || !color) return res.status(404).json({ error: 'Game not found.' });
  run(room, color);
  notifyRoom(room);
  res.json({ ok: true, resign: room.resignFor(color), status: room.status });
}

/* From the unfinished-games list, where there may be no live socket. */
router.post('/resign', (req, res) => act(req, res, (room, color) => room.offerResign(color)));
router.post('/resign-accept', (req, res) => act(req, res, (room, color) => room.acceptResign(color)));
router.post('/resign-decline', (req, res) => act(req, res, (room, color) => room.declineResign(color)));
router.post('/resign-withdraw', (req, res) => act(req, res, (room, color) => room.withdrawResign(color)));

export default router;
