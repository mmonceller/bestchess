import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { onlineApi } from '../api/endpoints.js';
import { savedSeats, SEATS_CHANGED } from './savedSeats.js';

const POLL_MS = 10_000;
const MAX_WAIT = 60_000;

/* One poll for every caller. The header, the resume button, and Messages used to each
   POST /online/active on their own, so a down server filled the console with 502s. */
let cache = [];
const listeners = new Set();
let timer = null;
let inflight = false;
let again = false;
let scheduled = false;
let wait = POLL_MS;
let userId = null;
let bound = false;

function publish(next) {
  cache = next;
  listeners.forEach((fn) => fn(next));
}

function seats() {
  return savedSeats.list().map(({ code, key }) => ({ code, key }));
}

async function load() {
  const saved = seats();
  if (!userId && saved.length === 0) {
    publish([]);
    return true;
  }
  try {
    const res = await onlineApi.active(saved);
    const games = res.games || [];
    publish(games);
    savedSeats.keepOnly(new Set(games.map((g) => g.code)));
    return true;
  } catch {
    return false;
  }
}

function arm(ms) {
  clearTimeout(timer);
  if (!listeners.size) return;
  timer = setTimeout(() => {
    if (document.visibilityState === 'hidden') { arm(POLL_MS); return; }
    run();
  }, ms);
}

function run() {
  if (scheduled) return;
  if (inflight) { again = true; return; }
  scheduled = true;
  queueMicrotask(() => {
    scheduled = false;
    if (!listeners.size) return;
    if (inflight) { again = true; return; }
    inflight = true;
    clearTimeout(timer);
    load().then((ok) => {
      wait = ok ? POLL_MS : Math.min(Math.max(wait, POLL_MS) * 2, MAX_WAIT);
    }).finally(() => {
      inflight = false;
      if (again && listeners.size) {
        again = false;
        run();
        return;
      }
      again = false;
      arm(wait);
    });
  });
}

function bindWindow() {
  if (bound) return;
  bound = true;
  window.addEventListener(SEATS_CHANGED, () => { if (listeners.size) run(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && listeners.size) run();
  });
}

/* Live online games for the signed-in account, plus seats this browser still remembers. */
export function useActiveGames(refreshKey) {
  const { user } = useAuth();
  const [games, setGames] = useState(cache);
  const seenKey = useRef(refreshKey);

  useEffect(() => {
    bindWindow();
    userId = user?.id || null;
    listeners.add(setGames);
    setGames(cache);
    if (listeners.size === 1) run();
    return () => {
      listeners.delete(setGames);
      if (!listeners.size) clearTimeout(timer);
    };
  }, [user?.id]);

  useEffect(() => {
    if (seenKey.current === refreshKey) return;
    seenKey.current = refreshKey;
    run();
  }, [refreshKey]);

  return games;
}
