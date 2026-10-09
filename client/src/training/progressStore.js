import { useCallback, useEffect, useState } from 'react';
import { progressApi } from '../api/endpoints.js';
import { tokenStore } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { guestStorage } from './guestStorage.js';

/* Lesson progress lives on the server for logged-in users and only for this browser session for guests. */
const KEY = 'bc.progress';

const readGuest = () => guestStorage.read(KEY, {});

export async function mergeGuestProgress() {
  const local = readGuest();
  if (!tokenStore.get() || !Object.keys(local).length) return;
  await progressApi.merge(local);
  guestStorage.remove(KEY);
}

function writeGuest(lessonId, change) {
  const local = readGuest();
  local[lessonId] = change(local[lessonId]);
  guestStorage.write(KEY, local);
  return local;
}

export function useProgress() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(() => (user ? {} : readGuest()));
  const [loading, setLoading] = useState(Boolean(user));

  useEffect(() => {
    if (!user) { setProgress(readGuest()); setLoading(false); return; }
    setLoading(true);
    progressApi.get()
      .then((d) => setProgress(d.progress))
      .catch(() => setProgress(readGuest()))
      .finally(() => setLoading(false));
  }, [user]);

  /* Saves a full run of the lesson, including the answers given in it. */
  const complete = useCallback(async (lessonId, stars, answers) => {
    if (user) {
      try {
        const d = await progressApi.complete(lessonId, stars, answers);
        setProgress(d.progress);
        return;
      } catch { /* fall back to the session copy */ }
    }
    setProgress(writeGuest(lessonId, (prev) => ({
      ...prev,
      stars: Math.max(stars, prev?.stars || 0),
      attempts: (prev?.attempts || 0) + 1,
      firstCompletedAt: prev?.firstCompletedAt || Date.now(),
      lastCompletedAt: Date.now(),
      answers: answers || prev?.answers,
    })));
  }, [user]);

  /* Saves the bonus round without touching the original lesson answers. */
  const completeBonus = useCallback(async (lessonId, stars, answers) => {
    if (user) {
      try {
        const d = await progressApi.completeBonus(lessonId, stars, answers);
        setProgress(d.progress);
        return;
      } catch { /* fall back to the session copy */ }
    }
    setProgress(writeGuest(lessonId, (prev) => ({
      ...prev,
      bonusStars: Math.max(stars, prev?.bonusStars || 0),
      bonusCompletedAt: prev?.bonusCompletedAt || Date.now(),
      bonusAnswers: answers || prev?.bonusAnswers,
    })));
  }, [user]);

  return { progress, loading, complete, completeBonus };
}
