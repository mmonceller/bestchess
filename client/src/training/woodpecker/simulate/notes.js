const PIECE = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };

export function startNote(last, willRecapture) {
  if (willRecapture) {
    const gift = PIECE[last?.piece] || 'piece';
    return `The exercise stops here. One possible try is that they take the ${gift} you gave — the next checks show why that was necessary.`;
  }
  return 'The exercise stops here. One possible way they continue, and why those earlier moves were played:';
}

export function moveNote(after, move, { ours, recapture, onlyBefore }) {
  const mate = after.isCheckmate();
  const replies = after.moves();
  const onlyReply = replies.length === 1 ? replies[0] : null;

  if (mate) {
    return ours
      ? `[[${move.san}]] is checkmate. That is why the earlier trade was worth it.`
      : `[[${move.san}]] would mate you — they will look for something else.`;
  }
  if (recapture) {
    return `If they recapture ([[${move.san}]]), they take the piece you offered.`;
  }
  if (!ours && onlyBefore) {
    return `Forced. The only legal move is [[${move.san}]].`;
  }
  if (ours && move.san.includes('+') && onlyReply) {
    return `[[${move.san}]] is not mate. It leaves only [[${onlyReply}]].`;
  }
  if (ours && move.captured) {
    return `Now [[${move.san}]] takes the ${PIECE[move.captured]}.`;
  }
  if (!ours) return `If they answer [[${move.san}]]…`;
  if (move.san.includes('+')) return `[[${move.san}]] keeps the king in check.`;
  return `[[${move.san}]] follows up.`;
}
