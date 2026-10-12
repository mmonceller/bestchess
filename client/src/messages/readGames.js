import { useEffect, useState } from 'react';

const KEY = 'bc.messageOpened';
const EVENT = 'bc.messageOpened.changed';

function readIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return new Set(Array.isArray(raw) ? raw : []);
  } catch {
    return new Set();
  }
}

/* An unfinished game stays unread until its row is expanded. */
export function gameIsRead(id) {
  return readIds().has(id);
}

export function markGameRead(id) {
  if (!id || gameIsRead(id)) return;
  const next = readIds();
  next.add(id);
  localStorage.setItem(KEY, JSON.stringify([...next].slice(-200)));
  window.dispatchEvent(new Event(EVENT));
}

/* Bumps when a game is marked read, so badges outside this page update. */
export function useGameReadVersion() {
  const [version, setVersion] = useState(0);
  useEffect(() => {
    const bump = () => setVersion((n) => n + 1);
    window.addEventListener(EVENT, bump);
    return () => window.removeEventListener(EVENT, bump);
  }, []);
  return version;
}
