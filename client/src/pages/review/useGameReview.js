import { useCallback, useEffect, useRef, useState } from 'react';
import { gamesApi } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { engine } from '../../engine/engineClient.js';
import { analyzeGame } from '../../review/analyzeGame.js';
import { readStashedGame } from '../../review/pendingReview.js';

/*
 * Loads a game (from the account when `gameId` is given, otherwise the one just played in
 * this tab), runs the review on request and saves it to the account when possible.
 * saveState: 'saved' | 'saving' | 'error' | 'guest' | 'unsaved' | null
 */
export function useGameReview(gameId, autoStart) {
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [saveState, setSaveState] = useState(null);
  const alive = useRef(true);
  const started = useRef(false);

  useEffect(() => {
    alive.current = true;
    if (gameId) {
      gamesApi.get(gameId)
        .then((d) => {
          if (!alive.current) return;
          setGame(d.game);
          if (d.game.review) { setReview(d.game.review); setSaveState('saved'); }
        })
        .catch((e) => alive.current && setError(e.message));
    } else {
      const g = readStashedGame();
      if (g?.pgn) setGame(g);
      else setError('There is no game to review yet. Finish a game first.');
    }
    return () => {
      alive.current = false;
      if (started.current) engine.cancel();
    };
  }, [gameId]);

  const start = useCallback(async () => {
    if (!game || started.current) return;
    started.current = true;
    setProgress({ done: 0, total: 0 });
    let result = null;
    try {
      result = await analyzeGame(game.pgn, game.color, {
        onProgress: (done, total) => alive.current && setProgress({ done, total }),
        isCancelled: () => !alive.current,
      });
    } catch {
      result = null;
    }
    started.current = false;
    if (!alive.current) return;
    setProgress(null);
    if (!result) { setError('The review was interrupted. Please try again.'); return; }
    setReview(result);

    if (!gameId || !user) { setSaveState(user ? 'unsaved' : 'guest'); return; }
    setSaveState('saving');
    gamesApi.saveReview(gameId, result)
      .then((d) => { if (alive.current) { setReview(d.review); setSaveState('saved'); } })
      .catch(() => alive.current && setSaveState('error'));
  }, [game, gameId, user]);

  useEffect(() => {
    if (autoStart && game && !review && !progress) start();
  }, [autoStart, game]); // eslint-disable-line react-hooks/exhaustive-deps

  return { game, error, review, progress, saveState, start };
}
