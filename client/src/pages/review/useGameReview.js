import { useCallback, useEffect, useRef, useState } from 'react';
import { gamesApi } from '../../api/endpoints.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { engine } from '../../engine/engineClient.js';
import { analyzeGame } from '../../review/analyzeGame.js';
import { readStashedGame } from '../../review/pendingReview.js';
import { forgetFinishedGame, saveFinishedGame } from '../../review/saveFinishedGame.js';
import { navigate } from '../../router/router.js';

/*
 * Loads a game (from the account when `gameId` is given, otherwise the one just played in
 * this tab), runs the review on request and saves it to the account when possible.
 * The opponent's moves are only reviewed when asked for (reviewOpponent), to keep reviews quick.
 * saveState: 'saved' | 'saving' | 'error' | 'guest' | 'unsaved' | null
 */
export function useGameReview(gameId, autoStart) {
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [error, setError] = useState('');
  const [review, setReview] = useState(null);
  const [progress, setProgress] = useState(null);
  const [opponentProgress, setOpponentProgress] = useState(null);
  const [saveState, setSaveState] = useState(null);
  const alive = useRef(true);
  const started = useRef(false);
  const accountId = useRef(gameId || null);
  const uploading = useRef(null);

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

  const accountGameId = useCallback(() => {
    if (accountId.current) return Promise.resolve(accountId.current);
    if (!user) return Promise.resolve(null);
    const stashed = readStashedGame();
    if (!stashed || stashed.mode === 'online') return Promise.resolve(null);
    if (!uploading.current) {
      uploading.current = saveFinishedGame(stashed).then((id) => {
        accountId.current = id;
        if (!id) uploading.current = null;
        return id;
      }).catch(() => { uploading.current = null; return null; });
    }
    return uploading.current;
  }, [user]);

  useEffect(() => {
    if (gameId || !user || !game) return;
    accountGameId();
  }, [gameId, user, game, accountGameId]);

  const persist = useCallback((next) => {
    if (!user) { setSaveState('guest'); return; }
    setSaveState('saving');
    accountGameId().then((id) => {
      if (!alive.current) return null;
      if (!id) { setSaveState('unsaved'); return null; }
      return gamesApi.saveReview(id, next).then((d) => {
        if (!alive.current) return;
        setReview(d.review);
        setSaveState('saved');
        forgetFinishedGame();
        if (!gameId) navigate(`/review/${id}?start=1`, { replace: true });
      });
    }).catch(() => alive.current && setSaveState('error'));
  }, [accountGameId, gameId, user]);

  const run = useCallback(async (color, opts, onProgress) => {
    started.current = true;
    let result = null;
    try {
      result = await analyzeGame(game.pgn, color, {
        ...opts,
        onProgress: (done, total) => alive.current && onProgress({ done, total }),
        isCancelled: () => !alive.current,
      });
    } catch {
      result = null;
    }
    started.current = false;
    return alive.current ? result : null;
  }, [game]);

  const start = useCallback(async () => {
    if (!game || started.current) return;
    setProgress({ done: 0, total: 0 });
    const result = await run(game.color, {}, setProgress);
    if (!alive.current) return;
    setProgress(null);
    if (!result) { setError('The review was interrupted. Please try again.'); return; }
    setReview(result);
    persist(result);
  }, [game, run, persist]);

  const reviewOpponent = useCallback(async () => {
    if (!game || !review || review.opponent || started.current) return;
    setOpponentProgress({ done: 0, total: 0 });
    const result = await run(game.color === 'w' ? 'b' : 'w', { danger: false }, setOpponentProgress);
    if (!alive.current) return;
    setOpponentProgress(null);
    if (!result) { setError('The opponent review was interrupted. Please try again.'); return; }
    const next = { ...review, opponent: { summary: result.summary, moves: result.moves } };
    setReview(next);
    persist(next);
  }, [game, review, run, persist]);

  useEffect(() => {
    if (autoStart && game && !review && !progress) start();
  }, [autoStart, game]); // eslint-disable-line react-hooks/exhaustive-deps

  return { game, error, review, progress, opponentProgress, saveState, start, reviewOpponent };
}
