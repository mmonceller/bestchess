import { Chess } from 'chess.js';
import { playBook, toMove } from './moves.js';
import { altStartNote, bookMoveNote } from './notes.js';

export function sameBoard(a, b) {
  if (!a || !b) return false;
  return a.split(' ').slice(0, 4).join(' ') === b.split(' ').slice(0, 4).join(' ');
}

/*
 * After an alternate solve, the continuation is built from the book-end position.
 * If the player is not there, the extra moves do not follow their last move.
 */
export function needsBookLine(playerFen, puzzle) {
  if (!playerFen || !puzzle?.moves?.length) return false;
  return !sameBoard(playerFen, playBook(puzzle).chess.fen());
}

export function bookLineFrames(puzzle) {
  const us = puzzle.fen.split(' ')[1];
  const chess = new Chess(puzzle.fen);
  const frames = [{
    fen: puzzle.fen,
    move: null,
    ours: false,
    planned: true,
    note: altStartNote(),
    why: null,
  }];
  for (const uci of puzzle.moves || []) {
    const before = new Chess(chess.fen());
    const number = before.moveNumber();
    const onlyBefore = before.moves().length === 1;
    let played;
    try { played = chess.move(toMove(uci)); } catch { break; }
    const ours = played.color === us;
    frames.push({
      fen: chess.fen(),
      move: played,
      number,
      ours,
      planned: true,
      note: bookMoveNote(played, { ours, first: frames.length === 1, onlyBefore }),
      why: null,
    });
  }
  return frames;
}

export function withPlannedLine(puzzle, extra) {
  const book = bookLineFrames(puzzle);
  const rest = (extra?.frames || []).filter((f) => f.move);
  return { startFen: puzzle.fen, frames: [...book, ...rest], includesBook: true };
}
