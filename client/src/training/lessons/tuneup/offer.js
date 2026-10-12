import { LESSONS, TRACKS } from '../index.js';
import { PATTERNS as SKILL } from '../../skill/patterns.js';
import { weakMastery } from './build.js';
import { gameWeakAreas } from './fromGames.js';
import { patternAccuracy, woodpeckerAccuracy } from './eligibility.js';
import { TUNE_UP_ID } from './shell.js';

function hash(text) {
  let n = 7;
  for (const ch of String(text)) n = (Math.imul(n, 33) + ch.charCodeAt(0)) >>> 0;
  return n;
}

function finishedLessons(progress) {
  const open = new Set(TRACKS.filter((track) => !track.gated).map((track) => track.id));
  return LESSONS.filter((lesson) => open.has(lesson.track) && progress?.[lesson.id]);
}

/*
 * The lesson Today's summary hands out. Weak games, puzzles, or a slip today become
 * a tune-up on those ideas. Otherwise one finished lesson is picked to replay.
 */
export function tuneUpOffer({ trainer, progress, gameRecord, mastery, day }) {
  const games = gameWeakAreas(gameRecord?.list);
  const puzzles = weakMastery(trainer).filter((row) => row.rate < 0.5);
  const dropped = (mastery || [])
    .filter((row) => row.direction === 'down')
    .map((row) => SKILL[row.tag]?.name)
    .filter(Boolean);
  const focus = [...new Set([...games, ...puzzles].map((area) => area.name).concat(dropped))].slice(0, 3);
  const puzzlesOff = patternAccuracy(trainer);
  const woodOff = woodpeckerAccuracy(trainer);
  const broadMiss = (puzzlesOff.tried >= 10 && puzzlesOff.rate < 0.5) || (woodOff.tried >= 8 && woodOff.rate < 0.5);
  if (focus.length || broadMiss) {
    const text = focus.length
      ? `A short lesson on ${focus.join(', ')}. It uses what you miss in games and puzzles, including ideas that only look easy on a set-up board.`
      : 'Puzzles are still mostly misses. This short lesson works on the ideas behind them, including ones that only look easy on a set-up board.';
    return {
      kind: 'improve',
      title: 'Tune-up',
      text,
      action: 'Start tune-up',
      href: `#/training/${TUNE_UP_ID}?start=fresh`,
    };
  }
  const done = finishedLessons(progress);
  if (!done.length) {
    return {
      kind: 'refresh',
      title: 'Tune-up',
      text: 'Finish a lesson and this summary will hand you one to replay, so the ideas stay fresh.',
      action: 'Browse lessons',
      href: '#/training',
    };
  }
  const lesson = done[hash(day) % done.length];
  return {
    kind: 'refresh',
    title: 'Tune-up',
    text: `Nothing is slipping right now. Refresh ${lesson.title} and replay it so the idea stays sharp.`,
    action: 'Refresh this lesson',
    href: `#/training/${lesson.id}?start=fresh`,
  };
}
