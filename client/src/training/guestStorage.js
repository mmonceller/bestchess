/* Guest training data lives in sessionStorage, so it disappears when the tab is closed. */
export const guestStorage = {
  read(key, fallback) {
    try { return JSON.parse(sessionStorage.getItem(key)) ?? fallback; } catch { return fallback; }
  },
  write(key, value) {
    try { sessionStorage.setItem(key, JSON.stringify(value)); } catch { /* storage full or disabled */ }
  },
  remove(key) {
    try { sessionStorage.removeItem(key); } catch { /* ignore */ }
  },
};
