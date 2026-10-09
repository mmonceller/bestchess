import { Router } from 'express';
import { db, save } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';
import { sanitizeAnswers } from '../services/answerSanitizer.js';

const router = Router();
router.use(requireAuth);

const LESSON_ID = /^[a-z0-9-]{1,60}$/;
const clampStars = (v) => Math.max(1, Math.min(3, Number(v) || 1));

/* Combines a new lesson result with the saved one; answers from the latest full run win. */
function mergeLesson(prev, { stars, attempts = 1, firstCompletedAt, answers, bonusStars, bonusAnswers }) {
  const next = {
    ...prev,
    stars: Math.max(clampStars(stars), prev?.stars || 0),
    attempts: (prev?.attempts || 0) + attempts,
    firstCompletedAt: prev?.firstCompletedAt || firstCompletedAt || Date.now(),
    lastCompletedAt: Date.now(),
  };
  if (answers) next.answers = answers;
  if (bonusStars) {
    next.bonusStars = Math.max(clampStars(bonusStars), prev?.bonusStars || 0);
    next.bonusCompletedAt = next.bonusCompletedAt || Date.now();
  }
  if (bonusAnswers) next.bonusAnswers = bonusAnswers;
  return next;
}

router.get('/', (req, res) => {
  res.json({ progress: db.progress[req.user.id] || {} });
});

router.put('/:lessonId', (req, res) => {
  const { lessonId } = req.params;
  if (!LESSON_ID.test(lessonId)) return res.status(400).json({ error: 'Bad lesson id.' });
  const mine = (db.progress[req.user.id] ||= {});
  mine[lessonId] = mergeLesson(mine[lessonId], {
    stars: req.body?.stars,
    answers: sanitizeAnswers(req.body?.answers),
  });
  save();
  res.json({ progress: mine });
});

/* The bonus round is only offered once the lesson itself is finished. */
router.put('/:lessonId/bonus', (req, res) => {
  const { lessonId } = req.params;
  if (!LESSON_ID.test(lessonId)) return res.status(400).json({ error: 'Bad lesson id.' });
  const mine = (db.progress[req.user.id] ||= {});
  const prev = mine[lessonId];
  if (!prev) return res.status(409).json({ error: 'Finish the lesson before the bonus round.' });
  mine[lessonId] = {
    ...prev,
    bonusStars: Math.max(clampStars(req.body?.stars), prev.bonusStars || 0),
    bonusCompletedAt: prev.bonusCompletedAt || Date.now(),
    bonusAnswers: sanitizeAnswers(req.body?.answers) || prev.bonusAnswers,
  };
  save();
  res.json({ progress: mine });
});

/* Merges progress recorded while logged out. */
router.post('/merge', (req, res) => {
  const incoming = req.body?.progress || {};
  const mine = (db.progress[req.user.id] ||= {});
  for (const [id, p] of Object.entries(incoming).slice(0, 200)) {
    if (!LESSON_ID.test(id) || !p || typeof p !== 'object') continue;
    mine[id] = mergeLesson(mine[id], {
      stars: p.stars,
      attempts: Math.max(1, Math.min(1000, Number(p.attempts) || 1)),
      firstCompletedAt: Number(p.firstCompletedAt) || undefined,
      answers: sanitizeAnswers(p.answers),
      bonusStars: p.bonusStars ? p.bonusStars : undefined,
      bonusAnswers: sanitizeAnswers(p.bonusAnswers),
    });
  }
  save();
  res.json({ progress: mine });
});

export default router;
