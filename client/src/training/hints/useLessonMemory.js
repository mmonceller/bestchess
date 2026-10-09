import { useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProgress } from '../progressStore.js';
import { tracksForSkill } from '../skill/tiers.js';
import { linkHintToLesson } from './linkHint.js';

/*
 * Returns a function that ties a hint to a lesson: one the player completed, or one
 * suited to their skill level. Only logged-in players get links; guests get null.
 */
export function useLessonMemory() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const completed = useMemo(() => (user ? new Set(Object.keys(progress || {})) : new Set()), [user, progress]);
  const tracks = tracksForSkill(user?.skill);
  return useCallback(
    (hint) => (hint && user && (completed.size || tracks) ? linkHintToLesson(hint, completed, tracks) : null),
    [user, completed, tracks],
  );
}
