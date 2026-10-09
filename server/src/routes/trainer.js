import { Router } from 'express';
import { db, save } from '../db/store.js';
import { requireAuth } from '../middleware/auth.js';

/* Training profile: starting path, pattern-trainer rating, XP, streaks, per-pattern stats and Woodpecker cycles. */
const router = Router();
router.use(requireAuth);

const PATHS = new Set(['new', 'knows', 'improve']);
const ID = /^[a-z0-9-]{1,40}$/i;
const DAY = /^\d{4}-\d{2}-\d{2}$/;
const int = (v, min, max) => Math.max(min, Math.min(max, Math.round(Number(v) || 0)));
const WOODPECKER_SETS = ['easy', 'intermediate', 'advanced'];
const HOUR_MS = 3_600_000;

function cycleRun(r = {}) {
  return {
    cycle: int(r.cycle, 1, 1000),
    index: int(r.index, 0, 2000),
    solved: int(r.solved, 0, 2000),
    ms: int(r.ms, 0, 1000 * HOUR_MS),
    missed: (Array.isArray(r.missed) ? r.missed : []).map((n) => int(n, 1, 2000)).slice(0, 2000),
    history: (Array.isArray(r.history) ? r.history : []).slice(-50).map((h) => ({
      cycle: int(h?.cycle, 1, 1000),
      solved: int(h?.solved, 0, 2000),
      total: int(h?.total, 0, 2000),
      ms: int(h?.ms, 0, 1000 * HOUR_MS),
      day: DAY.test(h?.day) ? h.day : null,
    })),
  };
}

function woodpecker(w = {}) {
  const out = {};
  for (const id of WOODPECKER_SETS) if (w && w[id]) out[id] = cycleRun(w[id]);
  return out;
}

function sanitize(t = {}) {
  const patterns = {};
  for (const [id, s] of Object.entries(t.patterns || {}).slice(0, 40)) {
    if (!ID.test(id)) continue;
    const seen = int(s?.seen, 0, 1e6);
    patterns[id] = { seen, solved: int(s?.solved, 0, seen) };
  }
  return {
    path: PATHS.has(t.path) ? t.path : null,
    rating: int(t.rating, 100, 3000),
    games: int(t.games, 0, 1e6),
    xp: int(t.xp, 0, 1e8),
    solved: int(t.solved, 0, 1e6),
    streak: int(t.streak, 0, 1e5),
    bestStreak: int(t.bestStreak, 0, 1e5),
    patterns,
    recent: (Array.isArray(t.recent) ? t.recent : []).filter((r) => typeof r === 'string' && ID.test(r)).slice(-60),
    lastDay: DAY.test(t.lastDay) ? t.lastDay : null,
    dayStreak: int(t.dayStreak, 0, 1e5),
    woodpecker: woodpecker(t.woodpecker),
  };
}

router.get('/', (req, res) => {
  res.json({ trainer: db.trainer[req.user.id] || null });
});

router.put('/', (req, res) => {
  db.trainer[req.user.id] = sanitize(req.body?.trainer);
  save();
  res.json({ trainer: db.trainer[req.user.id] });
});

export default router;
