import { TRACKS, lessonsInTrack } from '../index.js';

/* Tune-up stays off the Today page until these worlds are finished. */
export const WORLDS_BEFORE_TUNE_UP = 6;

export function tuneUpUnlocked(progress) {
  if (!progress) return false;
  const worlds = TRACKS.filter((track) => !track.gated && !track.supplement).slice(0, WORLDS_BEFORE_TUNE_UP);
  return worlds.every((world) => {
    const lessons = lessonsInTrack(world.id);
    return lessons.length > 0 && lessons.every((lesson) => progress[lesson.id]);
  });
}
