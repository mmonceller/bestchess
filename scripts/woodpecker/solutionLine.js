import { Chess } from 'chess.js';

/*
 * Turns a solution paragraph from the book into its main line as UCI moves.
 * Figurines are converted to letters. The line starts at the first numbered move for the
 * side to move that is legal, follows the moves in order, may resume after a stretch of
 * plain commentary when the next expected move number appears, and stops at the first
 * side variation (a numbered move that isn't the expected next one).
 */
const FIGURINES = { '¦': 'R', '¥': 'B', '¤': 'N', '£': 'Q', '¢': 'K', '†': '+', '‡': '#' };
const SAN = /^(O-O-O|O-O|[KQRBN][a-h]?[1-8]?x?[a-h][1-8]|[a-h](?:x[a-h])?[1-8](?:=?[QRBN])?)[+#]?/;
const MOVE_NO = /^(\d+)\.(\.\.)?$/;
const ANNOTATION = /^[!?+\-–=±µ²³©„÷∞#½01]*$/;

function normalize(text) {
  return text
    .replace(/[¦¥¤£¢†‡]/g, (c) => FIGURINES[c])
    .replace(/0–0–0|0-0-0/g, 'O-O-O')
    .replace(/0–0|0-0/g, 'O-O')
    .replace(/(\d+)\.\s+(\.\.\.)?\s*(?=[KQRBNOa-h])/g, (m, n, dots) => `${n}.${dots || ''}`)
    .replace(/(\d+\.(?:\.\.)?)(?=[KQRBNOa-h])/g, '$1 ');
}

function readToken(token) {
  const no = MOVE_NO.exec(token);
  if (no) return { number: Number(no[1]), black: Boolean(no[2]) };
  const m = SAN.exec(token);
  return m ? { san: m[1] } : null;
}

/* Returns { moves, firstNumber }; moves are UCI strings, empty when no line was found. */
export function mainLine(fen, solutionText) {
  let c;
  try { c = new Chess(fen); } catch { return { moves: [], firstNumber: null }; }
  const side = c.turn();
  const tokens = normalize(solutionText || '').split(/\s+/).filter(Boolean);
  const moves = [];
  let firstNumber = null;
  let pendingNo = null;
  let inProse = false;
  let inSideline = false;
  let afterMove = false;
  let noAfterMove = false;

  const expected = () => {
    const ply = moves.length + (side === 'b' ? 1 : 0);
    return { number: firstNumber + Math.floor(ply / 2), black: ply % 2 === 1 };
  };
  const tryMove = (san) => {
    try { return c.move(san); } catch { return null; }
  };

  for (const raw of tokens) {
    const tok = readToken(raw);
    if (tok && 'number' in tok) { pendingNo = tok; noAfterMove = afterMove; continue; }
    afterMove = Boolean(tok);
    if (!tok) {
      if (moves.length && !ANNOTATION.test(raw) && raw !== 'mate') inProse = true;
      pendingNo = null;
      continue;
    }
    if (!moves.length) {
      const ok = pendingNo && pendingNo.black === (side === 'b');
      const num = pendingNo?.number;
      pendingNo = null;
      if (!ok) continue;
      const mv = tryMove(tok.san);
      if (!mv) break;
      firstNumber = num;
      moves.push(mv.lan);
      continue;
    }
    const exp = expected();
    const numbered = Boolean(pendingNo);
    const onTime = numbered && pendingNo.number === exp.number && pendingNo.black === exp.black;
    pendingNo = null;
    if (inSideline) {
      if (!onTime || noAfterMove) continue;
    } else if (numbered && !onTime) {
      inSideline = true;
      continue;
    } else if (inProse && !numbered) {
      continue;
    }
    const mv = tryMove(tok.san);
    if (!mv) {
      if (numbered && !inSideline) break;
      if (!inSideline) inProse = true;
      continue;
    }
    inProse = false;
    inSideline = false;
    moves.push(mv.lan);
    if (c.isGameOver()) break;
  }
  return { moves, firstNumber };
}
