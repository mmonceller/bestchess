import { useCallback, useEffect, useRef, useState } from 'react';
import { trainerApi } from '../api/endpoints.js';
import { tokenStore } from '../api/http.js';
import { useAuth } from '../context/AuthContext.jsx';
import { guestStorage } from './guestStorage.js';

/*
 * The player's training profile: chosen starting point, pattern-trainer rating,
 * XP from puzzles, streaks and per-pattern stats. Server-backed when logged in.
 */
const KEY = 'bc.trainer';

export const PATHS = {
  new: { label: 'I\'m brand new to chess', blurb: 'Learn how the pieces move, step by step.', icon: 'seedling', rating: 400, track: 'first' },
  knows: { label: 'I know how the pieces move', blurb: 'Build habits that win games.', icon: 'knight', rating: 800, track: 'beginner' },
  improve: { label: 'I play and want to level up', blurb: 'Sharpen tactics, plans and endgames.', icon: 'mountain', rating: 1200, track: 'intermediate' },
};

export const defaultTrainer = () => ({
  path: null,
  rating: 600,
  games: 0,
  xp: 0,
  solved: 0,
  streak: 0,
  bestStreak: 0,
  patterns: {},
  recent: [],
  lastDay: null,
  dayStreak: 0,
  woodpecker: {},
});

const today = () => new Date().toISOString().slice(0, 10);

/* Marks today as a training day and keeps the day streak going. */
export function touchDay(t) {
  const day = today();
  if (t.lastDay === day) return t;
  const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
  return { ...t, lastDay: day, dayStreak: t.lastDay === yesterday ? t.dayStreak + 1 : 1 };
}

const readGuest = () => ({ ...defaultTrainer(), ...guestStorage.read(KEY, {}) });

export function useTrainer() {
  const { user } = useAuth();
  const [trainer, setTrainer] = useState(() => (user ? null : readGuest()));
  const current = useRef(trainer);
  const saveTimer = useRef(null);

  useEffect(() => {
    if (!user) {
      const t = readGuest();
      current.current = t;
      setTrainer(t);
      return undefined;
    }
    let alive = true;
    trainerApi.get()
      .then((d) => { if (alive) { const t = { ...defaultTrainer(), ...d.trainer }; current.current = t; setTrainer(t); } })
      .catch(() => { if (alive) { const t = defaultTrainer(); current.current = t; setTrainer(t); } });
    return () => { alive = false; };
  }, [user]);

  const flush = useCallback(() => {
    if (!saveTimer.current) return;
    clearTimeout(saveTimer.current);
    saveTimer.current = null;
    trainerApi.save(current.current).catch(() => {});
  }, []);

  useEffect(() => flush, [flush]);

  const update = useCallback((fn) => {
    if (!current.current) return;
    const next = fn(current.current);
    current.current = next;
    setTrainer(next);
    if (!user) { guestStorage.write(KEY, next); return; }
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(flush, 400);
  }, [user, flush]);

  return { trainer, loading: !trainer, update };
}

/* After logging in, folds this session's guest training into the account. */
export async function mergeGuestTrainer() {
  const guest = guestStorage.read(KEY, null);
  if (!tokenStore.get() || !guest) return;
  const { trainer: server } = await trainerApi.get();
  const patterns = { ...(server?.patterns || {}) };
  for (const [id, s] of Object.entries(guest.patterns || {})) {
    const p = patterns[id] || { seen: 0, solved: 0 };
    patterns[id] = { seen: p.seen + (s.seen || 0), solved: p.solved + (s.solved || 0) };
  }
  const merged = server
    ? {
      ...server,
      path: server.path || guest.path,
      xp: (server.xp || 0) + (guest.xp || 0),
      solved: (server.solved || 0) + (guest.solved || 0),
      games: (server.games || 0) + (guest.games || 0),
      rating: server.games ? server.rating : guest.rating,
      bestStreak: Math.max(server.bestStreak || 0, guest.bestStreak || 0),
      patterns,
      woodpecker: { ...(guest.woodpecker || {}), ...(server.woodpecker || {}) },
    }
    : { ...defaultTrainer(), ...guest };
  await trainerApi.save(merged);
  guestStorage.remove(KEY);
}
