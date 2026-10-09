import { useEffect, useState } from 'react';
import { onlineApi } from '../api/endpoints.js';
import { useAuth } from '../context/AuthContext.jsx';
import { savedSeats, SEATS_CHANGED } from './savedSeats.js';

const POLL_MS = 30_000;

/*
 * Unfinished online games the player can go back to: the ones their account is seated in
 * plus the seats this browser remembers. Saved seats the server no longer knows are dropped.
 */
export function useActiveGames(refreshKey) {
  const { user } = useAuth();
  const [games, setGames] = useState([]);

  useEffect(() => {
    let alive = true;
    async function load() {
      const saved = savedSeats.list().map(({ code, key }) => ({ code, key }));
      if (!user && !saved.length) { setGames([]); return; }
      try {
        const res = await onlineApi.active(saved);
        if (!alive) return;
        setGames(res.games);
        savedSeats.keepOnly(new Set(res.games.map((g) => g.code)));
      } catch { /* keep what we had */ }
    }
    load();
    const id = setInterval(load, POLL_MS);
    const onFocus = () => load();
    window.addEventListener('focus', onFocus);
    window.addEventListener(SEATS_CHANGED, onFocus);
    return () => {
      alive = false;
      clearInterval(id);
      window.removeEventListener('focus', onFocus);
      window.removeEventListener(SEATS_CHANGED, onFocus);
    };
  }, [user?.id, refreshKey]);

  return games;
}
