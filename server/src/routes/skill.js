import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { skillBreakdown } from '../services/skill/skillBreakdown.js';

const router = Router();
router.use(requireAuth);

/* The player's skill rating explained: game-by-game points and the patterns from their reviews. */
router.get('/breakdown', (req, res) => {
  res.json(skillBreakdown(req.user.id));
});

export default router;
