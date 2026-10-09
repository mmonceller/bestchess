import { LESSONS, TRACKS } from './lessons/index.js';

/* For each coach: how many open lessons they teach and in which tracks (gated tracks stay a surprise). */
export function lessonsByCoach() {
  const open = new Set(TRACKS.filter((t) => !t.gated).map((t) => t.id));
  const out = {};
  for (const lesson of LESSONS) {
    if (!open.has(lesson.track) || !lesson.coach) continue;
    const entry = out[lesson.coach] || (out[lesson.coach] = { count: 0, tracks: [] });
    entry.count++;
    if (!entry.tracks.some((t) => t.id === lesson.track)) entry.tracks.push(TRACKS.find((t) => t.id === lesson.track));
  }
  return out;
}
