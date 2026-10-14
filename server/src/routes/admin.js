import { Router } from 'express';
import { requireAdmin } from '../middleware/requireAdmin.js';
import { userRoster } from '../services/admin/roster.js';
import { pointLogForAdmin } from '../services/pointLog/write.js';
import { readGoalPoints, setGoalPoints } from '../services/admin/goalPoints.js';

const router = Router();
router.use(requireAdmin);

router.get('/users', (req, res) => {
  res.json({ users: userRoster(), log: pointLogForAdmin() });
});

/* Temporary: the admin page can set an account's goal-point balance. */
router.put('/users/:id/goal-points', (req, res) => {
  const points = readGoalPoints(req.body?.points);
  if (points == null) return res.status(400).json({ error: 'Enter a whole number from 0 up.' });
  const saved = setGoalPoints(req.params.id, points);
  if (saved == null) return res.status(404).json({ error: 'No such user.' });
  res.json({ points: saved });
});

export default router;
