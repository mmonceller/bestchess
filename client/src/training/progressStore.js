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

  const complete = useCallback(async (lessonId, stars) => {
    if (user) {
      try {
        const d = await progressApi.complete(lessonId, stars);
        setProgress(d.progress);
        return;
      } catch { /* fall back to the session copy */ }
    }
    const local = readGuest();
    const prev = local[lessonId];
    local[lessonId] = {
      stars: Math.max(stars, prev?.stars || 0),
      attempts: (prev?.attempts || 0) + 1,
      firstCompletedAt: prev?.firstCompletedAt || Date.now(),
      lastCompletedAt: Date.now(),
    };
    guestStorage.write(KEY, local);
    setProgress(local);
  }, [user]);

  return { progress, loading, complete };
}
