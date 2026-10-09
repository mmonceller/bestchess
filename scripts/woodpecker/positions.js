import { mainLine } from './solutionLine.js';

/* Castling rights the placement allows (king and rook still on their home squares). */
export function possibleCastling(placement) {
  const rows = placement.split('/').map((r) => r.replace(/\d/g, (d) => '.'.repeat(Number(d))));
  const at = (sq) => rows[8 - Number(sq[1])]?.[sq.charCodeAt(0) - 97];
  let rights = '';
  if (at('e1') === 'K') { if (at('h1') === 'R') rights += 'K'; if (at('a1') === 'R') rights += 'Q'; }
  if (at('e8') === 'k') { if (at('h8') === 'r') rights += 'k'; if (at('a8') === 'r') rights += 'q'; }
  return rights || '-';
}

const fenOf = (entry, castling, moveNo = 1) => `${entry.placement} ${entry.side} ${castling} - 0 ${moveNo}`;

/*
 * The starting FEN and the book's main line for one diagram. Castling rights are only
 * granted when the book's line needs them (the diagrams don't say).
 */
export function startingPoint(entry) {
  const plain = mainLine(fenOf(entry, '-'), entry.solution);
  const rights = possibleCastling(entry.placement);
  if (rights !== '-') {
    const castled = mainLine(fenOf(entry, rights), entry.solution);
    if (castled.moves.length > plain.moves.length) {
      return { fen: fenOf(entry, rights, castled.firstNumber), moves: castled.moves };
    }
  }
  return { fen: fenOf(entry, '-', plain.firstNumber || 1), moves: plain.moves };
}
