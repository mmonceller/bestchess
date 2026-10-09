import { Chess } from 'chess.js';

/*
 * True when `attacker` could checkmate on their very next move if it were their turn now,
 * i.e. the side to move faces a mate-in-one threat. Skipped while the defender is in check,
 * since passing the turn would then be illegal.
 */
export function threatensMate(fen, attacker) {
  const parts = fen.split(' ');
  if (parts[1] === attacker) return false;
  let c;
  try {
    c = new Chess(fen);
    if (c.inCheck()) return false;
    c = new Chess([parts[0], attacker, parts[2], '-', parts[4] || '0', parts[5] || '1'].join(' '));
  } catch {
    return false;
  }
  return c.moves().some((san) => san.includes('#'));
}
