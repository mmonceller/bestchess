import { focusCatalog, focusStats, membersOf } from '../../patterns/groups.js';
import { PATTERNS } from '../../patterns/patterns.js';
import { patternAccuracy, woodpeckerAccuracy } from './eligibility.js';
import { DRILLS, drillFor } from './drills.js';
import { areasFromDrops, gameWeakAreas } from './fromGames.js';
import { tuneUpShell } from './shell.js';

const MAX_AREAS = 3;
const MIN_SEEN = 2;

function rateOf(solved, seen) {
  return seen ? solved / seen : 1;
}

/* The pattern-mastery rows the player solves least often, worst first. */
export function weakMastery(trainer) {
  const rows = [];
  for (const focus of focusCatalog()) {
    const stats = focusStats(trainer?.patterns, focus.id);
    if ((stats.seen || 0) < MIN_SEEN) continue;
    let id = focus.id;
    let name = focus.name;
    let seen = stats.seen;
    let solved = stats.solved || 0;
    if (focus.kind === 'group') {
      const worst = membersOf(focus.id)
        .map((member) => ({ id: member, name: PATTERNS[member].name, ...(trainer.patterns?.[member] || {}) }))
        .filter((m) => (m.seen || 0) >= MIN_SEEN)
        .sort((a, b) => rateOf(a.solved, a.seen) - rateOf(b.solved, b.seen))[0];
      if (worst && rateOf(worst.solved, worst.seen) < 0.5) {
        id = worst.id;
        name = worst.name;
        seen = worst.seen;
        solved = worst.solved || 0;
      }
    }
    rows.push({ id, name, seen, solved, rate: rateOf(solved, seen) });
  }
  rows.sort((a, b) => a.rate - b.rate || b.seen - a.seen);
  const failing = rows.filter((r) => r.rate < 0.5);
  return (failing.length ? failing : rows).slice(0, MAX_AREAS);
}

function revFor(ids) {
  return ids.reduce((n, id) => {
    for (const ch of id) n = (Math.imul(n, 33) + ch.charCodeAt(0)) >>> 0;
    return n;
  }, 7);
}

function leadFor(area) {
  const times = `${area.missed} time${area.missed === 1 ? '' : 's'}`;
  if (area.source === 'games' && area.seen && area.rate >= 0.5) {
    return `You solve this in puzzles (${area.solved} of ${area.seen}), but in your games you missed it ${times}. A set-up board makes the idea easier to see. `;
  }
  if (area.source === 'games') {
    return `In your games you missed this ${times}. `;
  }
  if (area.source === 'today') {
    return 'This slipped since you opened the app today. ';
  }
  const named = DRILLS[area.id] ? '' : `${area.name} keeps showing up in your misses. `;
  const score = area.seen ? `Pattern Trainer: ${area.solved} of ${area.seen}. ` : '';
  return `${score}${named}`;
}

function stepsFor(area) {
  const drill = drillFor(area.id);
  const [first, ...rest] = drill.steps;
  return [{ ...first, text: `${leadFor(area)}${first.text}` }, ...rest];
}

function intro(trainer, areas, gameRecord) {
  const puzzles = patternAccuracy(trainer);
  const wood = woodpeckerAccuracy(trainer);
  const reviewedGames = gameRecord?.reviewedGames || 0;
  const scannedGames = gameRecord?.scannedGames || 0;
  const playedGames = gameRecord?.playedGames || 0;
  const fromGames = areas.filter((a) => a.source === 'games' || a.source === 'today').map((a) => a.name);
  const fromPuzzles = areas.filter((a) => a.source === 'puzzles').map((a) => a.name);
  const bits = [
    `Today's tune-up follows the ideas you miss, including ones that are easy to spot only when a puzzle sets the pieces up. Pattern Trainer: ${puzzles.solved} of ${puzzles.tried} solved. Woodpecker Mode: ${wood.solved} of ${wood.tried} solved.`,
  ];
  if (fromGames.length) bits.push(`From your games against friends and bots: ${fromGames.join(', ')}.`);
  if (fromPuzzles.length) bits.push(`From the Pattern Trainer: ${fromPuzzles.join(', ')}.`);
  if (areas.some((area) => area.source === 'default')) bits.push('Forks, pins, and free pieces are the first ideas to check while those scores are still low.');
  if (!reviewedGames && !scannedGames && !playedGames) {
    bits.push('Play a match against a friend or a bot and the ideas you miss over the board are added here, even when you spot them easily in puzzles.');
  } else if (!reviewedGames && !scannedGames) {
    bits.push('The next game you finish is read move by move. Pieces you leave loose count here, even when a puzzle makes them easy to spot.');
  } else if (!fromGames.length && scannedGames) {
    bits.push(`Checked ${scannedGames} recent game${scannedGames === 1 ? '' : 's'} against friends and bots. No repeated miss stood out there, so this list follows the Pattern Trainer.`);
  }
  return { type: 'talk', text: bits.join(' ') };
}

/* Games first: a set-up puzzle can hide a mistake they keep making in real games. */
function chooseAreas(trainer, gameRecord, drops) {
  const puzzles = weakMastery(trainer).filter((row) => row.rate < 0.5);
  const games = [...gameWeakAreas(gameRecord?.list), ...areasFromDrops(drops)];
  const chosen = [];
  const seen = new Set();
  for (const area of games) {
    if (chosen.length >= MAX_AREAS || seen.has(area.id)) continue;
    const stats = focusStats(trainer?.patterns, area.id);
    const seenN = stats.seen || 0;
    chosen.push({
      ...area,
      seen: seenN,
      solved: stats.solved || 0,
      rate: seenN ? rateOf(stats.solved, seenN) : 1,
    });
    seen.add(area.id);
  }
  for (const area of puzzles) {
    if (chosen.length >= MAX_AREAS || seen.has(area.id)) continue;
    chosen.push({ ...area, source: 'puzzles' });
    seen.add(area.id);
  }
  if (chosen.length) return chosen;
  return [
    { id: 'fork', name: 'Fork', seen: 0, solved: 0, source: 'default' },
    { id: 'pin', name: 'Pin', seen: 0, solved: 0, source: 'default' },
    { id: 'hanging', name: 'Free Piece', seen: 0, solved: 0, source: 'default' },
  ];
}

/* Steps follow puzzle misses, game misses, and anything that slipped in today's summary. */
export function buildTuneUpLesson(trainer, gameRecord, drops) {
  const chosen = chooseAreas(trainer, gameRecord, drops);
  const steps = [
    intro(trainer, chosen, gameRecord),
    ...chosen.flatMap(stepsFor),
    {
      type: 'recap',
      title: 'What to look for next time',
      text: 'Run this list in your own games, not only when a puzzle puts the idea in front of you.',
      items: chosen.map((a) => ({
        icon: PATTERNS[a.id]?.icon || (a.id === 'ownLoose' ? 'warning' : a.id === 'checkmate' ? 'crown' : 'target'),
        title: a.name,
        text: drillFor(a.id).habit,
      })),
    },
  ];
  return {
    ...tuneUpShell,
    minutes: 4 + chosen.length * 2,
    rev: revFor(chosen.map((a) => `${a.source || 'puzzles'}:${a.id}`)),
    steps,
    bonus: [],
  };
}
