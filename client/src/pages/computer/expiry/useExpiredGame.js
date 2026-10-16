import { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { gamesApi } from '../../../api/endpoints.js';
import { getLevel } from '../../../engine/levels.js';
import { loadSavedGames, clearSavedGame } from '../savedGame.js';
import { clearStashedGame, readStashedGame, stashGame } from '../../../review/pendingReview.js';
import { isExpired, expiredRecord } from './inactivity.js';

const NOTE_KEY = 'bc.computerExpired';

function loadNotes() {
  try {
    const raw = JSON.parse(localStorage.getItem(NOTE_KEY));
    if (Array.isArray(raw)) return raw;
    return raw ? [raw] : [];
  } catch {
    return [];
  }
}

/*
 * Settles saved bot games that went too long without a move: each is recorded as a resignation
 * (for logged-in players) and a note is kept until the player dismisses it.
 * Waits for the login check so the record goes to the right account.
 */
export function useExpiredGame() {
  const { user, ready, refresh } = useAuth();
  const [notes, setNotes] = useState(loadNotes);

  useEffect(() => {
    if (!ready) return;
    const expired = loadSavedGames().filter(isExpired);
    if (!expired.length) return;
    const added = expired.map((saved) => {
      clearSavedGame(saved.id);
      if (user) {
        const record = { ...expiredRecord(saved), mode: 'computer' };
        stashGame(record, { durable: true });
        gamesApi.saveComputerGame(record).then(() => {
          if (readStashedGame()?.pgn === record.pgn) clearStashedGame();
          refresh();
        }).catch(() => {});
      }
      return { level: getLevel(saved.level).name, movedAt: saved.movedAt, recorded: Boolean(user) };
    });
    const next = [...loadNotes(), ...added];
    localStorage.setItem(NOTE_KEY, JSON.stringify(next));
    setNotes(next);
  }, [ready]); // eslint-disable-line react-hooks/exhaustive-deps

  function dismiss(index) {
    const next = index == null ? [] : notes.filter((_, i) => i !== index);
    if (next.length) localStorage.setItem(NOTE_KEY, JSON.stringify(next));
    else localStorage.removeItem(NOTE_KEY);
    setNotes(next);
  }

  return { notes, dismiss };
}
