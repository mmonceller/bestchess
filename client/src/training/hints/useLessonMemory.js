import { useCallback, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useProgress } from '../progressStore.js';
import { linkHintToLesson } from './linkHint.js';

/*
 * Returns a function that ties a hint to a lesson the player has completed.
 * Only logged-in players with saved lesson progress get links; everyone else gets null.
 */
export function useLessonMemory() {
  const { user } = useAuth();
  const { progress } = useProgress();
  const completed = useMemo(() => (user ? new Set(Object.keys(progress || {})) : new Set()), [user, progress]);
  return useCallback((hint) => (hint && completed.size ? linkHintToLesson(hint, completed) : null), [completed]);
}
