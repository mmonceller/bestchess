import { Router } from 'express';
import { db, save } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);

const LESSON_ID = /^[a-z0-9-]{1,60}$/;

router.get('/', (req, res) => {
  res.json({ progress: db.progress[req.user.id] || {} });
});

router.put('/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  if (!LESSON_ID.test(lessonId)) return res.status(400).json({ error: 'Bad lesson id.' });
  const stars = Math.max(1, Math.min(3, Number(req.body?.stars) || 1));
  const mine = (db.progress[req.user.id] ||= {});
  const prev = mine[lessonId];
  mine[lessonId] = {
    stars: Math.max(stars, prev?.stars || 0),
    attempts: (prev?.attempts || 0) + 1,
    firstCompletedAt: prev?.firstCompletedAt || Date.now(),
    lastCompletedAt: Date.now(),
  };
  save();
  res.json({ progress: mine });
});

/* Merges progress recorded while logged out. */
router.post('/merge', (req, res) => {
  const incoming = req.body?.progress || {};
  const mine = (db.progress[req.user.id] ||= {});
  for (const [id, p] of Object.entries(incoming)) {
    if (!LESSON_ID.test(id)) continue;
    const stars = Math.max(1, Math.min(3, Number(p?.stars) || 1));
    const prev = mine[id];
    mine[id] = {
      stars: Math.max(stars, prev?.stars || 0),
      attempts: (prev?.attempts || 0) + (Number(p?.attempts) || 1),
      firstCompletedAt: prev?.firstCompletedAt || Number(p?.firstCompletedAt) || Date.now(),
      lastCompletedAt: Date.now(),
    };
  }
  save();
  res.json({ progress: mine });
});

export default router;
