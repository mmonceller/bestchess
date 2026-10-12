import { db } from '../../db/store.js';
import { skillFor } from '../skill/skillRating.js';
import { masterySnapshot } from '../skill/skillBreakdown.js';
import { lessonsDone, patternSeen, recommendedLevelId, woodpeckerCounts } from './stats.js';

const DAY_MS = 24 * 60 * 60 * 1000;
export const GOAL_POINTS = 25;

/* Days opened before each player had their own list. Left in place once a goal has paid out. */
export const GOALS = [
  { id: 'bot', target: 2, href: '#/computer' },
  { id: 'friend', target: 1, href: '#/online' },
  { id: 'patterns', target: 10, href: '#/puzzles' },
  { id: 'woodpecker', target: 10, href: '#/puzzles/woodpecker' },
];

export { recommendedLevelId };
export const woodpeckerTried = (woodpecker) => woodpeckerCounts(woodpecker).tried;

export function snapshot(userId) {
  const skill = skillFor(userId);
  const trainer = db.trainer[userId] || {};
  return {
    skill: skill.rating ?? null,
    puzzle: trainer.rating || 0,
    puzzlesPlayed: trainer.games || 0,
    woodpecker: woodpeckerTried(trainer.woodpecker),
    botLevel: recommendedLevelId(skill.rating),
    lessons: lessonsDone(userId),
    patterns: patternSeen(userId),
    mastery: masterySnapshot(userId),
  };
}

function gamesSince(userId, since, until) {
  return db.games.filter((g) => g.userId === userId && g.date >= since && g.date < until);
}

function roleOf(row) {
  if (!row) return null;
  if (row.applied >= 2 && row.applied >= row.missed * 2) return 'strength';
  if (row.missed > 0 && row.missed * 2 > row.applied) return 'weakness';
  return null;
}

/* Strengths and weaknesses compared with the counts saved at the start of the day. */
export function masteryChanges(before, after) {
  const then = new Map((before || []).map((row) => [row.tag, row]));
  const now = new Map((after || []).map((row) => [row.tag, row]));
  const tags = new Set([...then.keys(), ...now.keys()]);
  const rows = [];
  for (const tag of tags) {
    const prev = then.get(tag);
    const next = now.get(tag);
    const role = roleOf(next) || roleOf(prev);
    if (!role) continue;
    const score = (row) => (row ? row.applied - row.missed : 0);
    const delta = score(next) - score(prev);
    rows.push({ tag, role, direction: delta > 0 ? 'up' : delta < 0 ? 'down' : 'same' });
  }
  const rank = { down: 0, up: 1, same: 2 };
  rows.sort((a, b) => rank[a.direction] - rank[b.direction] || a.tag.localeCompare(b.tag));
  return rows.slice(0, 8);
}

function todaysGoals(day) {
  if (day.plan?.length) return day.plan;
  return GOALS.map((goal) => ({
    ...goal,
    points: GOAL_POINTS,
    botLevel: goal.id === 'bot' ? day.baseline?.botLevel ?? null : null,
  }));
}

function tally(goal, stats) {
  if (goal.id === 'bot') {
    return stats.computer.filter((game) => goal.botLevel == null || Number(game.level) === goal.botLevel).length;
  }
  if (goal.id === 'botWin') {
    return stats.computer.filter((game) => game.result === 'win' && Number(game.level) === goal.botLevel).length;
  }
  if (goal.id === 'friend') return stats.online;
  if (goal.id === 'patterns') return stats.patterns;
  if (goal.id === 'woodpecker') return stats.woodpecker;
  if (goal.id === 'lesson') return stats.lessons;
  if (goal.id === 'focus') return Math.max(0, (stats.seen[goal.focus] || 0) - (stats.baseSeen[goal.focus] || 0));
  return 0;
}

/* Progress toward today's goals, plus the skill and puzzle change since login. */
export function measureDay(userId, day) {
  const base = day.baseline || {};
  const trainer = db.trainer[userId] || {};
  const skill = skillFor(userId);
  const finished = gamesSince(userId, day.since, day.since + DAY_MS);
  const seen = patternSeen(userId);
  const stats = {
    computer: finished.filter((game) => game.mode === 'computer'),
    online: finished.filter((game) => game.mode === 'online').length,
    patterns: Math.max(0, (trainer.games || 0) - (base.puzzlesPlayed || 0)),
    woodpecker: Math.max(0, woodpeckerTried(trainer.woodpecker) - (base.woodpecker || 0)),
    lessons: Math.max(0, lessonsDone(userId) - (base.lessons || 0)),
    seen,
    baseSeen: base.patterns || {},
  };
  const goals = todaysGoals(day).map((goal) => {
    const n = tally(goal, stats);
    return {
      ...goal,
      points: goal.points || GOAL_POINTS,
      progress: Math.min(goal.target, n),
      done: n >= goal.target,
    };
  });
  const puzzleNow = trainer.rating || 0;
  const skillNow = skill.rating ?? null;
  return {
    goals,
    report: {
      skill: {
        known: skillNow != null || base.skill != null,
        before: base.skill,
        after: skillNow,
        delta: skillNow == null || base.skill == null ? 0 : skillNow - base.skill,
      },
      puzzle: { before: base.puzzle || 0, after: puzzleNow, delta: puzzleNow - (base.puzzle || 0) },
      mastery: masteryChanges(base.mastery, masterySnapshot(userId)),
    },
  };
}
