import { VALUE, other } from './pieces.js';

/*
 * The enemy piece the player's move went after: one the moved piece now attacks that is
 * either undefended or worth more than the attacker. The most valuable such piece wins.
 */
export function mainTarget(chess, square) {
  const piece = chess.get(square);
  if (!piece) return null;
  const them = other(piece.color);
  let best = null;
  for (const row of chess.board()) {
    for (const cell of row) {
      if (!cell || cell.color !== them || cell.type === 'k') continue;
      if (!chess.attackers(cell.square, piece.color).includes(square)) continue;
      const loose = chess.attackers(cell.square, them).length === 0;
      if (!loose && VALUE[cell.type] <= VALUE[piece.type]) continue;
      if (!best || VALUE[cell.type] > VALUE[best.type]) best = cell;
    }
  }
  return best;
}
