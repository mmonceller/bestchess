/*
 * Online seats this browser holds, kept in localStorage so closing the tab or the browser
 * doesn't lose them: { [code]: { key, color, opponent, savedAt } }. The key is the player
 * key the seat was last held with; the server lets it reclaim the seat once it's empty.
 */
const KEY = 'bc.onlineSeats';
const MAX_AGE = 24 * 60 * 60_000;
export const SEATS_CHANGED = 'bc:seats-changed';

function read() {
  try {
    const all = JSON.parse(localStorage.getItem(KEY) || '{}');
    const now = Date.now();
    return Object.fromEntries(Object.entries(all).filter(([, s]) => s?.key && now - s.savedAt < MAX_AGE));
  } catch {
    return {};
  }
}

function write(all) {
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new Event(SEATS_CHANGED));
}

export const savedSeats = {
  all: read,
  get: (code) => read()[code] || null,
  list: () => Object.entries(read()).map(([code, s]) => ({ code, ...s })),
  save(code, seat) {
    const all = read();
    const prev = all[code];
    if (prev && prev.key === seat.key && prev.color === seat.color && prev.opponent === seat.opponent) return;
    write({ ...all, [code]: { ...seat, savedAt: Date.now() } });
  },
  remove(code) {
    const all = read();
    if (!(code in all)) return;
    delete all[code];
    write(all);
  },
  keepOnly(codes) {
    const all = read();
    const kept = Object.fromEntries(Object.entries(all).filter(([code]) => codes.has(code)));
    if (Object.keys(kept).length !== Object.keys(all).length) write(kept);
  },
};
