import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { dailyApi } from '../api/endpoints.js';

const DailyContext = createContext(null);

export function localDay(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function localMidnight(day) {
  const [year, month, date] = day.split('-').map(Number);
  return new Date(year, month - 1, date).getTime();
}

const CACHE_KEY = 'bc.daily.view';

function readCache(userId) {
  try {
    const saved = JSON.parse(localStorage.getItem(CACHE_KEY) || 'null');
    if (!saved || saved.userId !== userId || saved.day !== localDay()) return null;
    return saved.data;
  } catch {
    return null;
  }
}

function writeCache(userId, data) {
  try {
    const { fetchedAt, ...rest } = data;
    localStorage.setItem(CACHE_KEY, JSON.stringify({ userId, day: localDay(), data: rest }));
  } catch {
    /* A full disk should not block the inbox. */
  }
}

/* Loads today's goals once this account is on, and again when the page changes. */
export function DailyProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [failed, setFailed] = useState(false);
  const request = useRef(0);
  const flight = useRef(null);

  const refresh = useCallback(() => {
    if (!user) { setData(null); setFailed(false); return Promise.resolve(null); }
    if (flight.current?.userId === user.id) return flight.current.promise;
    const id = ++request.current;
    const day = localDay();
    const promise = dailyApi.today(day, localMidnight(day)).then((next) => {
      if (id === request.current) {
        const view = { ...next, fetchedAt: Date.now() };
        setData(view);
        setFailed(false);
        writeCache(user.id, view);
      }
      return next;
    }).catch(() => {
      if (id === request.current) setFailed(true);
      return null;
    }).finally(() => {
      if (flight.current?.promise === promise) flight.current = null;
    });
    flight.current = { userId: user.id, promise };
    return promise;
  }, [user]);

  useEffect(() => {
    if (!user?.id) { setData(null); setFailed(false); return; }
    const cached = readCache(user.id);
    setData(cached ? { ...cached, fetchedAt: 0 } : null);
    setFailed(false);
  }, [user?.id]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onChange = () => { if (user) refresh(); };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, [user, refresh]);

  const markRead = useCallback((messageId) => {
    if (!user || !messageId) return Promise.resolve();
    request.current += 1;
    setData((current) => {
      if (!current) return current;
      const messages = current.messages.map((message) => (
        message.id === messageId ? { ...message, read: true } : message
      ));
      const next = { ...current, messages, unread: messages.filter((message) => !message.read).length };
      writeCache(user.id, next);
      return next;
    });
    return dailyApi.read(messageId).catch(() => {
      setData((current) => {
        if (!current) return current;
        const messages = current.messages.map((message) => (
          message.id === messageId ? { ...message, read: false } : message
        ));
        const next = { ...current, messages, unread: messages.filter((message) => !message.read).length };
        writeCache(user.id, next);
        return next;
      });
    });
  }, [user]);

  const value = useMemo(() => ({
    data,
    failed,
    points: data?.points ?? null,
    unread: data?.unread || 0,
    refresh,
    markRead,
  }), [data, failed, refresh, markRead]);

  return <DailyContext.Provider value={value}>{children}</DailyContext.Provider>;
}

export const useDaily = () => useContext(DailyContext);
