const LEGACY_KEY = 'bc.computerGame';
const KEY = 'bc.computerGames';
export const SAVED_GAMES_CHANGED = 'bc.computerGames.changed';

export const MAX_BOT_GAMES = 5;

function readList() {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || '[]');
    return Array.isArray(raw) ? raw.filter((g) => g?.pgn !== undefined) : [];
  } catch {
    return [];
  }
}

function write(list) {
  localStorage.setItem(KEY, JSON.stringify(list));
  window.dispatchEvent(new Event(SAVED_GAMES_CHANGED));
}

function withId(g) {
  return { ...g, id: g.id || `${g.level}-${g.color}-${g.movedAt || Date.now()}`, movedAt: g.movedAt || Date.now() };
}

/* Unfinished bot games in this browser. An older single-game save is folded in once. */
export function loadSavedGames() {
  let list = readList();
  let dirty = false;
  try {
    const old = JSON.parse(localStorage.getItem(LEGACY_KEY));
    if (old?.pgn !== undefined) {
      list = [...list, old];
      localStorage.removeItem(LEGACY_KEY);
      dirty = true;
    }
  } catch { /* ignore a broken leftover */ }
  const next = list.map((g) => {
    if (g.id && g.movedAt) return g;
    dirty = true;
    return withId(g);
  });
  if (dirty) write(next);
  return next;
}

export const loadSavedGame = () => loadSavedGames()[0] || null;

/* `movedAt` only changes when the moves do, so asking for hints doesn't count as activity. */
export function saveGame(g) {
  const list = loadSavedGames();
  const id = g.id || `${g.level}-${g.color}`;
  const i = list.findIndex((x) => x.id === id);
  const prev = i >= 0 ? list[i] : null;
  const movedAt = prev?.pgn === g.pgn ? prev.movedAt : Date.now();
  const next = { ...g, id, movedAt };
  if (i >= 0) list[i] = next;
  else if (list.length < MAX_BOT_GAMES) list.push(next);
  else return;
  write(list);
}

export function clearSavedGame(id) {
  if (id == null) {
    localStorage.removeItem(KEY);
    localStorage.removeItem(LEGACY_KEY);
    return;
  }
  write(loadSavedGames().filter((g) => g.id !== id));
}
