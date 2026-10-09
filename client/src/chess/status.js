export function gameStatus(chess) {
  if (chess.isCheckmate()) return { over: true, winner: chess.turn() === 'w' ? 'b' : 'w', reason: 'checkmate' };
  if (chess.isStalemate()) return { over: true, winner: null, reason: 'stalemate' };
  if (chess.isInsufficientMaterial()) return { over: true, winner: null, reason: 'insufficient material' };
  if (chess.isThreefoldRepetition()) return { over: true, winner: null, reason: 'repetition' };
  if (chess.isDrawByFiftyMoves()) return { over: true, winner: null, reason: '50-move rule' };
  return { over: false, winner: null, reason: null };
}

export function resultText(winner, reason, you) {
  if (!winner) return { title: 'Draw', detail: `By ${reason}.`, outcome: 'draw' };
  const name = winner === 'w' ? 'White' : 'Black';
  if (!you || you === 'spectator') return { title: `${name} wins`, detail: `By ${reason}.`, outcome: 'none' };
  return winner === you
    ? { title: 'You won!', detail: `By ${reason}.`, outcome: 'win' }
    : { title: 'You lost', detail: `By ${reason}.`, outcome: 'loss' };
}

export const toUci = (m) => m.from + m.to + (m.promotion || '');

/* Converts a list of UCI moves to SAN starting from `fen`, stopping at the first illegal move. */
export function uciLineToSan(Chess, fen, line) {
  const c = new Chess(fen);
  const out = [];
  for (const uci of line) {
    try { out.push(c.move({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] }).san); } catch { break; }
  }
  return out;
}
