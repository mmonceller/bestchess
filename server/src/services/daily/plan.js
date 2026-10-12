import { db } from '../../db/store.js';
import { skillFor } from '../skill/skillRating.js';
import { GOAL_POINTS } from './measure.js';
import {
  botName,
  lessonsDone,
  lessonsRemaining,
  nextWorldName,
  patternName,
  patternUnlocked,
  recommendedLevelId,
  woodpeckerCounts,
} from './stats.js';

const RECENT = 20;

function hashSeed(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function pick(rng, values) {
  return values[Math.floor(rng() * values.length)];
}

function count(n, one, many) {
  return `${n} ${n === 1 ? one : many}`;
}

function shuffle(rng, list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function levelRecord(games, level) {
  const rows = games.filter((game) => game.mode === 'computer' && Number(game.level) === level);
  return { games: rows.length, wins: rows.filter((game) => game.result === 'win').length };
}

/* Read-only picture of how this account has been playing. Does not write the database. */
export function readProfile(userId) {
  const trainer = db.trainer[userId] || {};
  const games = db.games
    .filter((game) => game.userId === userId)
    .sort((a, b) => b.date - a.date);
  const recent = games.slice(0, RECENT);
  const computer = recent.filter((game) => game.mode === 'computer' && Number(game.level));
  const byLevel = new Map();
  for (const game of computer) {
    const level = Number(game.level);
    const row = byLevel.get(level) || { level, games: 0, wins: 0 };
    row.games += 1;
    if (game.result === 'win') row.wins += 1;
    byLevel.set(level, row);
  }
  const mostPlayed = [...byLevel.values()].sort((a, b) => b.games - a.games || a.level - b.level)[0] || null;
  const woodpecker = woodpeckerCounts(trainer.woodpecker);
  const patterns = Object.entries(trainer.patterns || {}).map(([id, stats]) => ({
    id,
    name: patternName(id),
    seen: stats?.seen || 0,
    solved: stats?.solved || 0,
  })).filter((row) => row.name);
  const rating = trainer.rating || 0;
  const done = lessonsDone(userId);
  return {
    lessonsDone: done,
    lessonsLeft: lessonsRemaining(userId),
    world: nextWorldName(userId),
    finishedGames: games.length,
    onlineGames: games.filter((game) => game.mode === 'online').length,
    trainerGames: trainer.games || 0,
    trainerSolved: trainer.solved || 0,
    trainerRating: rating,
    recommended: recommendedLevelId(skillFor(userId).rating),
    mostPlayed,
    winsAt: (level) => levelRecord(games, level).wins,
    woodpecker,
    weakPatterns: patterns
      .filter((row) => row.seen >= 4 && patternUnlocked(row.id, rating) && row.solved / row.seen < 0.55)
      .sort((a, b) => a.solved / a.seen - b.solved / b.seen || b.seen - a.seen),
  };
}

function goal(id, target, href, title, detail, extra = {}) {
  return { id, target, href, points: GOAL_POINTS, title, detail, ...extra };
}

function lessonGoal(profile, target) {
  const where = profile.world ? ` Next up is ${profile.world}.` : '';
  return goal(
    'lesson',
    target,
    '#/training',
    `Finish ${count(target, 'lesson', 'lessons')}`,
    `A lesson in Learn Chess counts once you finish it.${where}`,
  );
}

function botGoal(target, level, detail) {
  return goal(
    'bot',
    target,
    `#/computer?level=${level}`,
    `Play ${count(target, 'game', 'games')} against ${botName(level)}`,
    detail,
    { botLevel: level },
  );
}

function winGoal(target, level, detail) {
  return goal(
    'botWin',
    target,
    `#/computer?level=${level}`,
    `Win ${count(target, 'game', 'games')} against ${botName(level)}`,
    detail,
    { botLevel: level },
  );
}

function friendGoal(target, detail) {
  return goal(
    'friend',
    target,
    '#/online',
    `Play ${count(target, 'game', 'games')} with a friend`,
    detail,
  );
}

function patternGoal(target, detail) {
  return goal(
    'patterns',
    target,
    '#/puzzles',
    `Play ${count(target, 'puzzle', 'puzzles')} in the Pattern Trainer`,
    detail,
  );
}

function focusGoal(target, row) {
  const rate = `${row.solved} of ${row.seen}`;
  return goal(
    'focus',
    target,
    `#/puzzles?focus=${row.id}`,
    `Play ${count(target, `${row.name} puzzle`, `${row.name} puzzles`)}`,
    `${row.name} is a pattern you miss often in the trainer (${rate} solved).`,
    { focus: row.id },
  );
}

function woodpeckerGoal(target, detail) {
  return goal(
    'woodpecker',
    target,
    '#/puzzles/woodpecker',
    `Do ${count(target, 'exercise', 'exercises')} in Woodpecker Mode`,
    detail,
  );
}

/* Brand-new accounts get a short list: one lesson, one easy bot, a few puzzles. */
function easyPlan(profile, rng) {
  const level = profile.winsAt(1) > 0 ? 2 : 1;
  const name = botName(level);
  const puzzles = pick(rng, [3, 5]);
  const lessons = Math.min(profile.lessonsLeft, profile.lessonsDone === 0 ? 1 : pick(rng, [1, 2]));
  const goals = [];
  if (lessons > 0) goals.push(lessonGoal(profile, lessons));
  goals.push(botGoal(
    1,
    level,
    level === 1
      ? 'One game against Pawn Pusher. A gentle first match.'
      : 'You already beat Pawn Pusher. Rookie is the next easy step.',
  ));
  goals.push(patternGoal(
    puzzles,
    puzzles === 3
      ? 'Three puzzles. Short on purpose while you are starting out.'
      : 'Five puzzles. Still a short session.',
  ));
  if (goals.length < 4) {
    const lost = profile.finishedGames > 0 && profile.winsAt(level) === 0;
    goals.push(lost
      ? winGoal(1, level, `Your last games against ${name} are still short of a win.`)
      : winGoal(1, level, `Win one against ${name}. One is enough for today.`));
  }
  if (goals.length < 4) {
    goals.push(friendGoal(1, 'One game with a friend, when you want a person across the board.'));
  }
  return goals.slice(0, 4);
}

function botChoice(profile, rng) {
  const played = profile.mostPlayed;
  if (played && played.games >= 3 && played.wins / played.games >= 0.75 && played.level < 8) {
    const next = played.level + 1;
    const detail = `You have won ${played.wins} of ${played.games} against ${botName(played.level)}. ${botName(next)} is the next step up.`;
    return rng() < 0.5 ? botGoal(pick(rng, [1, 2]), next, detail) : winGoal(1, next, detail);
  }
  if (played && played.games >= 2 && played.wins / played.games < 0.45) {
    const detail = `You have won ${played.wins} of ${played.games} against ${botName(played.level)}. Today's goal is one win there.`;
    return winGoal(1, played.level, detail);
  }
  const level = profile.recommended || played?.level || 2;
  return botGoal(
    pick(rng, [1, 2]),
    level,
    `Finish a game against ${botName(level)}, picked from how you have been playing.`,
  );
}

function experiencedPlan(profile, rng) {
  const pool = [];
  const puzzleRate = profile.trainerGames ? profile.trainerSolved / profile.trainerGames : 1;
  const woodRate = profile.woodpecker.tried ? profile.woodpecker.solved / profile.woodpecker.tried : 1;

  if (profile.lessonsLeft) {
    pool.push({ weight: profile.lessonsDone < 20 ? 4 : 2, goal: lessonGoal(profile, 1) });
  }
  if (profile.weakPatterns.length) {
    const row = profile.weakPatterns[Math.floor(rng() * Math.min(3, profile.weakPatterns.length))];
    const target = row.solved / row.seen < 0.35 ? pick(rng, [4, 5]) : pick(rng, [5, 6]);
    pool.push({ weight: 5, goal: focusGoal(target, row) });
  }
  if (profile.trainerGames < 6) {
    pool.push({ weight: 3, goal: patternGoal(pick(rng, [4, 5]), 'A short run in the Pattern Trainer.') });
  } else if (puzzleRate < 0.6) {
    const target = puzzleRate < 0.4 ? pick(rng, [5, 6, 8]) : pick(rng, [6, 8, 10]);
    pool.push({
      weight: 4,
      goal: patternGoal(target, `The Pattern Trainer is ${profile.trainerSolved} solved out of ${profile.trainerGames}. Today's set follows that.`),
    });
  } else {
    pool.push({ weight: 2, goal: patternGoal(pick(rng, [8, 10]), 'You are solving most puzzles. A longer set keeps that going.') });
  }
  if (profile.woodpecker.tried >= 4 && woodRate < 0.6) {
    const target = woodRate < 0.3 ? pick(rng, [5, 6, 8]) : pick(rng, [6, 8, 10]);
    pool.push({
      weight: 5,
      goal: woodpeckerGoal(target, `Woodpecker Mode is ${profile.woodpecker.solved} solved out of ${profile.woodpecker.tried}. Today's set is sized to that.`),
    });
  } else if (profile.woodpecker.tried > 0) {
    pool.push({ weight: 2, goal: woodpeckerGoal(pick(rng, [8, 10]), 'Another Woodpecker session, from the set you already started.') });
  } else if (profile.lessonsDone >= 9) {
    pool.push({ weight: 1, goal: woodpeckerGoal(4, 'A short first visit to Woodpecker Mode.') });
  }
  pool.push({ weight: 4, goal: botChoice(profile, rng) });
  if (profile.onlineGames < 2 && profile.finishedGames >= 1) {
    pool.push({
      weight: profile.onlineGames === 0 ? 3 : 2,
      goal: friendGoal(1, profile.onlineGames === 0
        ? 'Bot games are most of what you play. One game with a person counts today.'
        : 'One more game with a friend.'),
    });
  }

  const ranked = [...pool].sort((a, b) => b.weight - a.weight);
  const lead = ranked[0];
  const rest = shuffle(rng, ranked.slice(1));
  const chosen = [];
  for (const item of [lead, ...rest]) {
    if (chosen.length === 4) break;
    if (chosen.some((goal) => goal.id === item.goal.id)) continue;
    chosen.push(item.goal);
  }
  return chosen;
}

/* Same player and day always get the same list. The next day rolls a new one. */
export function buildPlan(profile, seed) {
  const rng = hashSeed(seed);
  const fresh = profile.finishedGames < 3 && profile.trainerGames < 8 && profile.lessonsDone < 12;
  return fresh ? easyPlan(profile, rng) : experiencedPlan(profile, rng);
}

export function planFor(userId, day) {
  return buildPlan(readProfile(userId), `${userId}|${day}`);
}

export function planBlurb(plan) {
  const titles = plan.map((item) => item.title);
  if (!titles.length) return "Today's goals are ready.";
  if (titles.length === 1) return `Today's goal: ${titles[0]}.`;
  const last = titles[titles.length - 1];
  return `Today's goals follow your recent play: ${titles.slice(0, -1).join(', ')}, and ${last}.`;
}

/* An existing day keeps its list once a goal has paid out, so points already earned stay put. */
export function canAssignPlan(day) {
  if (day?.plan?.length) return false;
  const awarded = day?.awarded || {};
  return !Object.keys(awarded).some((id) => awarded[id]);
}
