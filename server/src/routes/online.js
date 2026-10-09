import { Router } from 'express';
import { bearerToken } from '../middleware/auth.js';
import { userFromToken } from '../auth/sessions.js';
import { activeGamesFor } from '../online/activeGames.js';

const router = Router();

/* Works for guests too: they send the seats their browser remembered. */
router.post('/active', (req, res) => {
  const user = userFromToken(bearerToken(req));
  const saved = Array.isArray(req.body?.saved)
    ? req.body.saved.map((s) => ({ code: String(s?.code || '').slice(0, 8), key: String(s?.key || '').slice(0, 64) }))
    : [];
  res.json({ games: activeGamesFor({ userId: user?.id ?? null, saved }) });
});

export default router;
