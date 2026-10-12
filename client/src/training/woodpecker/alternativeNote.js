/*
 * A move that solves the exercise but isn't the book's key. Always wrap SAN in [[ ]]
 * so pawn pushes still render as moves, not squares.
 */
export function alternativeNote(playedSan, bookSan) {
  if (!bookSan) return `[[${playedSan}]] works — have a look at the planned line below.`;
  if (playedSan === bookSan) return `[[${playedSan}]] is the planned idea.`;
  return `[[${playedSan}]] works too! The planned idea was [[${bookSan}]] — that line is below.`;
}

export function alternativeCaption(playedSan, bookSan) {
  if (!bookSan || playedSan === bookSan) return null;
  return `Your [[${playedSan}]] also wins. The planned idea was [[${bookSan}]].`;
}
