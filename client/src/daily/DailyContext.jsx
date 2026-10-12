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

/* Loads today's goals once this account is on, and again when the page changes. */
export function DailyProvider({ children }) {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const request = useRef(0);

  const refresh = useCallback(() => {
    if (!user) { setData(null); return Promise.resolve(null); }
    const id = ++request.current;
    const day = localDay();
    return dailyApi.today(day, localMidnight(day)).then((next) => {
      if (id === request.current) setData(next);
      return next;
    }).catch(() => null);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    const onChange = () => {
      if (user && !location.hash.startsWith('#/messages')) refresh();
    };
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
      return { ...current, messages, unread: messages.filter((message) => !message.read).length };
    });
    return dailyApi.read(messageId).catch(() => {
      setData((current) => {
        if (!current) return current;
        const messages = current.messages.map((message) => (
          message.id === messageId ? { ...message, read: false } : message
        ));
        return { ...current, messages, unread: messages.filter((message) => !message.read).length };
      });
    });
  }, [user]);

  const value = useMemo(() => ({
    data,
    points: data?.points ?? null,
    unread: data?.unread || 0,
    refresh,
    markRead,
  }), [data, refresh, markRead]);

  return <DailyContext.Provider value={value}>{children}</DailyContext.Provider>;
}

export const useDaily = () => useContext(DailyContext);
