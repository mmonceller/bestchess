import { Chess } from 'chess.js';

const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9 };
const FILES = 'abcdefgh';
const MAX_GAMES = 40;
const MAX_PER_GAME = 4;

function cheapestAttacker(chess, square, color) {
  let best = Infinity;
  for (const sq of chess.attackers(square, color)) {
    const piece = chess.get(sq);
    const value = piece ? VALUE[piece.type] : Infinity;
    if (value < best) best = value;
  }
  return best;
}

/* A knight, bishop, rook, or queen that can be taken for less than it is worth. */
function hangingSquare(chess, square) {
  const piece = chess.get(square);
  if (!piece || piece.type === 'p' || piece.type === 'k') return false;
  const enemy = piece.color === 'w' ? 'b' : 'w';
  if (!chess.attackers(square, enemy).length) return false;
  if (!chess.isAttacked(square, piece.color)) return true;
  return cheapestAttacker(chess, square, enemy) < VALUE[piece.type];
}

function hangingOwn(chess, color) {
  const squares = [];
  const board = chess.board();
  for (let rank = 0; rank < 8; rank++) {
    for (let file = 0; file < 8; file++) {
      const piece = board[rank][file];
      if (!piece || piece.color !== color) continue;
      const square = `${FILES[file]}${8 - rank}`;
      if (hangingSquare(chess, square)) squares.push(square);
    }
  }
  return squares;
}

/* True when this capture wins a piece and does not drop a bigger one. */
function captureWins(chess, move) {
  const victim = VALUE[move.captured] || 0;
  const attacker = VALUE[move.piece] || 0;
  if (victim < 3) return false;
  chess.move(move);
  const hangs = hangingSquare(chess, move.to);
  chess.undo();
  if (victim > attacker) return true;
  return !hangs;
}

function winningCaptures(chess) {
  return chess.moves({ verbose: true }).filter((move) => move.captured && captureWins(chess, move));
}

/* One finished game. Counts pieces this color left loose, and free enemy pieces they walked past. */
export function scanPgn(pgn, color, hintPlies = []) {
  const chess = new Chess();
  if (!pgn) return null;
  try { chess.loadPgn(pgn, { strict: false }); } catch { return null; }
  const history = chess.history({ verbose: true });
  const replay = new Chess();
  const hints = new Set(hintPlies);
  const looseSquares = new Set();
  const ignoredSquares = new Set();
  let ownLoose = 0;
  let missedFree = 0;

  for (let ply = 0; ply < history.length; ply++) {
    const move = history[ply];
    if (replay.turn() !== color) {
      replay.move(move);
      continue;
    }
    const hinted = hints.has(ply);
    if (!hinted && !replay.inCheck() && missedFree < MAX_PER_GAME) {
      const free = winningCaptures(replay);
      const tookFree = free.some((m) => m.from === move.from && m.to === move.to);
      if (!tookFree) {
        for (const cap of free) {
          if (ignoredSquares.has(cap.to) || missedFree >= MAX_PER_GAME) continue;
          ignoredSquares.add(cap.to);
          missedFree++;
        }
      }
    }
    replay.move(move);
    if (hinted || ownLoose >= MAX_PER_GAME) continue;
    const took = VALUE[move.captured] || 0;
    const exempt = took >= (VALUE[move.piece] || 0) ? move.to : null;
    for (const square of hangingOwn(replay, color)) {
      if (square === exempt || looseSquares.has(square) || ownLoose >= MAX_PER_GAME) continue;
      looseSquares.add(square);
      ownLoose++;
    }
  }
  return { ownLoose, missedFree };
}

function add(stats, tag, missed) {
  if (!missed) return;
  const row = (stats[tag] ||= { tag, applied: 0, missed: 0 });
  row.missed += missed;
}

/* Unreviewed games still count. Rescue = left their own piece loose. freePiece = passed up a free capture. */
export function boardPatternList(games) {
  const stats = {};
  let counted = 0;
  for (const game of games.slice(0, MAX_GAMES)) {
    const scan = scanPgn(game.pgn, game.color === 'b' ? 'b' : 'w', game.hintPlies);
    if (!scan) continue;
    counted++;
    add(stats, 'rescue', scan.ownLoose);
    add(stats, 'freePiece', scan.missedFree);
  }
  return { games: counted, list: Object.values(stats).filter((row) => row.missed >= 2) };
}
