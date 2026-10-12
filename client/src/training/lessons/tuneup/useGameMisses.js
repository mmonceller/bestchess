import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { skillApi } from '../../../api/endpoints.js';
import { mergeMissLists } from './fromGames.js';

const EMPTY = { list: [], reviewedGames: 0, scannedGames: 0, playedGames: 0 };

/* Reviewed-game pattern stats. Null until the request finishes. Pass false to skip the fetch. */
export function useGameMisses(enabled = true) {
  const { user } = useAuth();
  const [record, setRecord] = useState(null);

  useEffect(() => {
    if (!enabled) return undefined;
    if (!user) { setRecord(EMPTY); return undefined; }
    let on = true;
    skillApi.breakdown()
      .then((data) => {
        if (!on) return;
        setRecord({
          list: mergeMissLists(data.patterns?.list, data.patterns?.board),
          reviewedGames: data.patterns?.reviewedGames || 0,
          scannedGames: data.patterns?.scannedGames || 0,
          playedGames: data.patterns?.playedGames || 0,
        });
      })
      .catch(() => { if (on) setRecord(EMPTY); });
    return () => { on = false; };
  }, [user, enabled]);

  return enabled ? record : EMPTY;
}
