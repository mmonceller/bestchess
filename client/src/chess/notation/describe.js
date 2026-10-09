import { parseSan } from './parseSan.js';

/*
 * Plain-English description of a move, e.g. "White's knight takes the queen on h3, giving check."
 * `ctx` (all optional) comes from replaying the game: { color: 'w'|'b', from, captured, enPassant }.
 */
export const PIECE_NAMES = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight', P: 'pawn' };

const ANNOTATIONS = {
  '!': 'A good move.',
  '!!': 'A brilliant move!',
  '?': 'A mistake.',
  '??': 'A blunder.',
  '!?': 'An interesting try.',
  '?!': 'A doubtful move.',
};

const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function origin(p, ctx) {
  if (ctx.from && (p.fromFile || p.fromRank || p.piece === 'P')) return ` on ${ctx.from}`;
  if (p.fromFile && p.fromRank) return ` on ${p.fromFile}${p.fromRank}`;
  if (p.fromFile) return ` from the ${p.fromFile}-file`;
  if (p.fromRank) return ` from rank ${p.fromRank}`;
  return '';
}

export function describeMove(san, ctx = {}) {
  const p = parseSan(san);
  if (!p) return null;
  const side = ctx.color === 'w' ? 'White' : ctx.color === 'b' ? 'Black' : null;
  let text;
  if (p.castle) {
    const wing = p.castle === 'king' ? 'on the king\'s side (short castling)' : 'on the queen\'s side (long castling)';
    text = `${side || 'The king'} castles ${wing}`;
  } else {
    const piece = PIECE_NAMES[p.piece];
    const who = side ? `${side}'s ${piece}` : capitalize(piece);
    const action = p.capture
      ? `takes ${ctx.captured ? `the ${PIECE_NAMES[ctx.captured.toUpperCase()]} ` : ''}on ${p.to}${ctx.enPassant ? ' (en passant)' : ''}`
      : `moves to ${p.to}`;
    text = `${who}${origin(p, ctx)} ${action}`;
    if (p.promotion) text += ` and becomes a ${PIECE_NAMES[p.promotion]}`;
  }
  if (p.mate) text += ' — checkmate!';
  else if (p.check) text += ', giving check.';
  else text += '.';
  if (p.annotation && ANNOTATIONS[p.annotation]) text += ` ${ANNOTATIONS[p.annotation]}`;
  return text;
}
