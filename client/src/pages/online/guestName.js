const KEY = 'bc.guestName';

export function getGuestName() {
  let n = localStorage.getItem(KEY);
  if (!n) {
    n = `Guest${Math.floor(1000 + Math.random() * 9000)}`;
    localStorage.setItem(KEY, n);
  }
  return n;
}

export const setGuestName = (n) => localStorage.setItem(KEY, n.slice(0, 20));
