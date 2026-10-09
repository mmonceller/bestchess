import { useEffect, useMemo, useState } from 'react';
import { gamesApi } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { evaluateMastery } from './criteria.js';

/* Game history only exists for logged-in players, so guests can't unlock Master Class. */
export function useMastery(progress, trainer, enabled = true) {
  const { user } = useAuth();
  const [games, setGames] = useState(null);

  useEffect(() => {
    if (!user || !enabled) { setGames([]); return undefined; }
    let alive = true;
    gamesApi.list().then((d) => { if (alive) setGames(d.games); }).catch(() => { if (alive) setGames([]); });
    return () => { alive = false; };
  }, [user, enabled]);

  return useMemo(
    () => ({ ...evaluateMastery({ progress, trainer, games }), isGuest: !user, loading: games === null || !trainer }),
    [progress, trainer, games, user],
  );
}
