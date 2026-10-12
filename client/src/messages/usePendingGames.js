import { useEffect, useState } from 'react';
import { useNow } from '../hooks/useNow.js';
import { useActiveGames } from '../online/useActiveGames.js';
import { loadSavedGames, SAVED_GAMES_CHANGED } from '../pages/computer/savedGame.js';
import { pendingItems } from './pendingItems.js';

/* Live list of unfinished games for the notification badge and the inbox. */
export function usePendingGames(refreshKey) {
  const now = useNow(1000);
  const online = useActiveGames(refreshKey);
  const [saved, setSaved] = useState(() => loadSavedGames());
  const [deadlines, setDeadlines] = useState({});

  useEffect(() => {
    setDeadlines((prev) => {
      const next = {};
      for (const game of online) {
        if (game.inviteExpiresIn == null) continue;
        const fresh = Date.now() + game.inviteExpiresIn;
        const kept = prev[game.code];
        next[game.code] = kept != null && Math.abs(kept - fresh) < 2000 ? kept : fresh;
      }
      return next;
    });
  }, [online]);

  useEffect(() => {
    const load = () => setSaved(loadSavedGames());
    window.addEventListener(SAVED_GAMES_CHANGED, load);
    window.addEventListener('hashchange', load);
    window.addEventListener('focus', load);
    return () => {
      window.removeEventListener(SAVED_GAMES_CHANGED, load);
      window.removeEventListener('hashchange', load);
      window.removeEventListener('focus', load);
    };
  }, []);

  const live = online.map((game) => (
    deadlines[game.code] == null ? game : { ...game, inviteExpiresIn: Math.max(0, deadlines[game.code] - now) }
  ));
  return pendingItems(saved, live, now);
}
