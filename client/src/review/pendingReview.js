/*
 * The game a player just finished. sessionStorage keeps it for this tab.
 * localStorage keeps a logged-in player's game when the account save has not
 * succeeded yet, so closing the tab does not drop it.
 */
const KEY = 'bc.pendingReview';

function write(storage, game) {
  try { storage.setItem(KEY, JSON.stringify(game)); } catch { /* storage full or blocked */ }
}

function read(storage) {
  try {
    const game = JSON.parse(storage.getItem(KEY));
    return game?.pgn ? game : null;
  } catch {
    return null;
  }
}

export function stashGame(game, { durable = false } = {}) {
  write(sessionStorage, game);
  if (durable) write(localStorage, game);
}

export function readStashedGame() {
  return read(sessionStorage) || read(localStorage);
}

export function clearDurableStash() {
  localStorage.removeItem(KEY);
}

export function clearStashedGame() {
  sessionStorage.removeItem(KEY);
  clearDurableStash();
}
