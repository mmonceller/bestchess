import { firstStepsLessons } from './firstSteps.js';
import { beginnerLessons } from './beginner.js';
import { intermediateLessons } from './intermediate.js';
import { advancedLessons } from './advanced.js';
import { strategyLessons } from './strategy.js';
import { endgameLessons } from './endgame.js';
import { masterLessons } from './master.js';
import { masterThinkingLessons } from './masterThinking.js';
import { BONUS } from './bonus/index.js';

/* `gated` tracks stay hidden until the player earns them (see training/mastery). */
export const TRACKS = [
  { id: 'first', name: 'First Steps', blurb: 'Never played before? Start here: the board, the pieces and the rules.', icon: 'pawn', color: '#3ccf7a' },
  { id: 'beginner', name: 'Foundations', blurb: 'Simple habits that stop mistakes and win free pieces.', icon: 'seedling', color: '#4fd1c5' },
  { id: 'intermediate', name: 'Club Player', blurb: 'Think like a strong player: plans, questions and clean technique.', icon: 'swords', color: '#7c5cff' },
  { id: 'advanced', name: 'Level Up', blurb: 'Endgame know-how, pawn structures and match psychology.', icon: 'mountain', color: '#ffb547' },
  { id: 'strategy', name: 'Strategy Lab', blurb: 'Read any position like a master: imbalances, good and bad pieces, weak pawns, space and passed pawns.', icon: 'mind', color: '#4f9dff' },
  { id: 'endgame', name: 'Endgame School', blurb: 'Win the won games and save the lost ones: king races, zugzwang, fortresses, queen vs. pawn and rook endgames.', icon: 'king', color: '#3fbfa0' },
  { id: 'master', name: 'Master Class', blurb: 'For players who have outgrown the basics: calculation, prophylaxis and tournament technique.', icon: 'crown', color: '#ff5c8a', gated: true },
];

export const LESSONS = [...firstStepsLessons, ...beginnerLessons, ...intermediateLessons, ...advancedLessons, ...strategyLessons, ...endgameLessons, ...masterLessons, ...masterThinkingLessons]
  .map((lesson) => ({ ...lesson, bonus: BONUS[lesson.id] || [] }));

/* Every lesson outside the gated tracks — finishing all of them is the first step to Master Class. */
export const CORE_LESSONS = LESSONS.filter((l) => !TRACKS.find((t) => t.id === l.track)?.gated);

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
export const lessonsInTrack = (trackId) => LESSONS.filter((l) => l.track === trackId);
