import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { markMessageRead, openDay, validWindow } from '../services/daily/openDay.js';

const router = Router();
router.use(requireAuth);

/* Today's goals and the summary since this account opened the app on this local day. */
router.get('/', (req, res) => {
  const day = String(req.query.day || '');
  const since = req.query.since;
  if (!validWindow(day, since)) return res.status(400).json({ error: 'That day is outside the current window.' });
  res.json(openDay(req.user.id, day, since));
});

router.post('/read', (req, res) => {
  const id = String(req.body?.id || '');
  if (!id) return res.status(400).json({ error: 'Missing message.' });
  res.json(markMessageRead(req.user.id, id));
});

export default router;
