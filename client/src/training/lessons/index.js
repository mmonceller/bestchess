import { firstStepsLessons } from './firstSteps.js';
import { beginnerLessons } from './beginner.js';
import { intermediateLessons } from './intermediate.js';
import { advancedLessons } from './advanced.js';

export const TRACKS = [
  { id: 'first', name: 'First Steps', blurb: 'Never played before? Start here: the board, the pieces and the rules.', icon: 'pawn', color: '#3ccf7a' },
  { id: 'beginner', name: 'Foundations', blurb: 'Simple habits that stop mistakes and win free pieces.', icon: 'seedling', color: '#4fd1c5' },
  { id: 'intermediate', name: 'Club Player', blurb: 'Think like a strong player: plans, questions and clean technique.', icon: 'swords', color: '#7c5cff' },
  { id: 'advanced', name: 'Level Up', blurb: 'Endgame know-how, pawn structures and match psychology.', icon: 'mountain', color: '#ffb547' },
];

export const LESSONS = [...firstStepsLessons, ...beginnerLessons, ...intermediateLessons, ...advancedLessons];

export const getLesson = (id) => LESSONS.find((l) => l.id === id);
export const lessonsInTrack = (trackId) => LESSONS.filter((l) => l.track === trackId);
