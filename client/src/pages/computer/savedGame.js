const KEY = 'bc.computerGame';

export function loadSavedGame() {
  try {
    const g = JSON.parse(localStorage.getItem(KEY));
    return g?.pgn !== undefined ? g : null;
  } catch {
    return null;
  }
}

export const saveGame = (g) => localStorage.setItem(KEY, JSON.stringify(g));
export const clearSavedGame = () => localStorage.removeItem(KEY);
