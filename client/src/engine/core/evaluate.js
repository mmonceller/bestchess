import {
  PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, WHITE, BLACK,
  KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, onBoard, colorOf, typeOf,
} from './constants.js';

/* Piece-square tables from White's view, index 0 = a8 ... 63 = h1. */
const PST_PAWN_MG = [
  0, 0, 0, 0, 0, 0, 0, 0,
  50, 50, 50, 50, 50, 50, 50, 50,
  10, 10, 20, 30, 30, 20, 10, 10,
  5, 5, 10, 25, 25, 10, 5, 5,
  0, 0, 0, 20, 20, 0, 0, 0,
  5, -5, -10, 0, 0, -10, -5, 5,
  5, 10, 10, -20, -20, 10, 10, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];
const PST_PAWN_EG = [
  0, 0, 0, 0, 0, 0, 0, 0,
  80, 80, 80, 80, 80, 80, 80, 80,
  50, 50, 50, 50, 50, 50, 50, 50,
  30, 30, 30, 30, 30, 30, 30, 30,
  20, 20, 20, 20, 20, 20, 20, 20,
  10, 10, 10, 10, 10, 10, 10, 10,
  5, 5, 5, 5, 5, 5, 5, 5,
  0, 0, 0, 0, 0, 0, 0, 0,
];
const PST_KNIGHT = [
  -50, -40, -30, -30, -30, -30, -40, -50,
  -40, -20, 0, 0, 0, 0, -20, -40,
  -30, 0, 10, 15, 15, 10, 0, -30,
  -30, 5, 15, 20, 20, 15, 5, -30,
  -30, 0, 15, 20, 20, 15, 0, -30,
  -30, 5, 10, 15, 15, 10, 5, -30,
  -40, -20, 0, 5, 5, 0, -20, -40,
  -50, -40, -30, -30, -30, -30, -40, -50,
];
const PST_BISHOP = [
  -20, -10, -10, -10, -10, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 10, 10, 5, 0, -10,
  -10, 5, 5, 10, 10, 5, 5, -10,
  -10, 0, 10, 10, 10, 10, 0, -10,
  -10, 10, 10, 10, 10, 10, 10, -10,
  -10, 5, 0, 0, 0, 0, 5, -10,
  -20, -10, -10, -10, -10, -10, -10, -20,
];
const PST_ROOK = [
  0, 0, 0, 0, 0, 0, 0, 0,
  5, 10, 10, 10, 10, 10, 10, 5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  -5, 0, 0, 0, 0, 0, 0, -5,
  0, 0, 0, 5, 5, 0, 0, 0,
];
const PST_QUEEN = [
  -20, -10, -10, -5, -5, -10, -10, -20,
  -10, 0, 0, 0, 0, 0, 0, -10,
  -10, 0, 5, 5, 5, 5, 0, -10,
  -5, 0, 5, 5, 5, 5, 0, -5,
  0, 0, 5, 5, 5, 5, 0, -5,
  -10, 5, 5, 5, 5, 5, 0, -10,
  -10, 0, 5, 0, 0, 0, 0, -10,
  -20, -10, -10, -5, -5, -10, -10, -20,
];
const PST_KING_MG = [
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -30, -40, -40, -50, -50, -40, -40, -30,
  -20, -30, -30, -40, -40, -30, -30, -20,
  -10, -20, -20, -20, -20, -20, -20, -10,
  20, 20, 0, 0, 0, 0, 20, 20,
  20, 30, 10, 0, 0, 10, 30, 20,
];
const PST_KING_EG = [
  -50, -40, -30, -20, -20, -30, -40, -50,
  -30, -20, -10, 0, 0, -10, -20, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 30, 40, 40, 30, -10, -30,
  -30, -10, 20, 30, 30, 20, -10, -30,
  -30, -30, 0, 0, 0, 0, -30, -30,
  -50, -30, -30, -30, -30, -30, -30, -50,
];

const MG_VALUE = [0, 82, 337, 365, 477, 1025, 0];
const EG_VALUE = [0, 94, 281, 297, 512, 936, 0];
const PHASE_WEIGHT = [0, 0, 1, 1, 2, 4, 0];
const PASSED_MG = [0, 5, 10, 15, 25, 40, 70, 0];
const PASSED_EG = [0, 10, 20, 35, 60, 100, 150, 0];
const CENTER_DIST = [3, 2, 1, 0, 0, 1, 2, 3];

const pstIndex = (sq, color) => {
  const r = sq >> 4;
  const f = sq & 7;
  return (color === WHITE ? r : 7 - r) * 8 + f;
};

const pawnFiles = [new Int8Array(8), new Int8Array(8)];
/* Board row (0 = 8th rank) of the rearmost white pawn and frontmost-to-rank-8 black pawn per file. */
const whiteMaxRow = new Int8Array(8);
const blackMinRow = new Int8Array(8);

function mobility(pos, sq, dirs, slide, them) {
  const b = pos.board;
  let count = 0;
  for (let i = 0; i < dirs.length; i++) {
    const d = dirs[i];
    let t = sq + d;
    while (onBoard(t)) {
      const p = b[t];
      if (p) { if (colorOf(p) === them) count++; break; }
      count++;
      if (!slide) break;
      t += d;
    }
  }
  return count;
}

function isPassed(sq, color) {
  const f = sq & 7;
  const r = sq >> 4;
  for (let df = -1; df <= 1; df++) {
    const ff = f + df;
    if (ff < 0 || ff > 7) continue;
    if (color === WHITE ? blackMinRow[ff] < r : whiteMaxRow[ff] > r) return false;
  }
  return true;
}

/* Static evaluation in centipawns from the side-to-move's point of view. */
export function evaluate(pos) {
  const b = pos.board;
  let mg = [0, 0];
  let eg = [0, 0];
  let phase = 0;
  const bishops = [0, 0];
  const material = [0, 0];
  const pawnCount = [0, 0];

  pawnFiles[0].fill(0);
  pawnFiles[1].fill(0);
  whiteMaxRow.fill(-1);
  blackMinRow.fill(8);

  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    const p = b[sq];
    if (typeOf(p) === PAWN) {
      const f = sq & 7;
      const r = sq >> 4;
      if (colorOf(p) === WHITE) {
        pawnFiles[0][f]++;
        if (r > whiteMaxRow[f]) whiteMaxRow[f] = r;
      } else {
        pawnFiles[1][f]++;
        if (r < blackMinRow[f]) blackMinRow[f] = r;
      }
    }
  }

  for (let sq = 0; sq < 128; sq++) {
    if (sq & 0x88) { sq += 7; continue; }
    const p = b[sq];
    if (!p) continue;
    const color = colorOf(p);
    const c = color >> 3;
    const type = typeOf(p);
    const idx = pstIndex(sq, color);
    const them = color ^ 8;
    phase += PHASE_WEIGHT[type];
    mg[c] += MG_VALUE[type];
    eg[c] += EG_VALUE[type];
    if (type !== PAWN && type !== KING) material[c] += MG_VALUE[type];

    switch (type) {
      case PAWN: {
        pawnCount[c]++;
        mg[c] += PST_PAWN_MG[idx];
        eg[c] += PST_PAWN_EG[idx];
        const f = sq & 7;
        if (pawnFiles[c][f] > 1) { mg[c] -= 10; eg[c] -= 20; }
        const left = f > 0 ? pawnFiles[c][f - 1] : 0;
        const right = f < 7 ? pawnFiles[c][f + 1] : 0;
        if (!left && !right) { mg[c] -= 12; eg[c] -= 18; }
        if (isPassed(sq, color)) {
          const rel = color === WHITE ? 7 - (sq >> 4) : sq >> 4;
          mg[c] += PASSED_MG[rel];
          eg[c] += PASSED_EG[rel];
          const ahead = sq + (color === WHITE ? -16 : 16);
          if (onBoard(ahead) && b[ahead] && colorOf(b[ahead]) === them) eg[c] -= PASSED_EG[rel] >> 2;
        }
        break;
      }
      case KNIGHT: {
        mg[c] += PST_KNIGHT[idx];
        eg[c] += PST_KNIGHT[idx];
        const mob = mobility(pos, sq, KNIGHT_DIRS, false, them);
        mg[c] += (mob - 4) * 4;
        eg[c] += (mob - 4) * 4;
        break;
      }
      case BISHOP: {
        bishops[c]++;
        mg[c] += PST_BISHOP[idx];
        eg[c] += PST_BISHOP[idx];
        const mob = mobility(pos, sq, BISHOP_DIRS, true, them);
        mg[c] += (mob - 6) * 4;
        eg[c] += (mob - 6) * 5;
        break;
      }
      case ROOK: {
        mg[c] += PST_ROOK[idx];
        eg[c] += PST_ROOK[idx];
        const f = sq & 7;
        if (!pawnFiles[c][f]) {
          const bonus = pawnFiles[them >> 3][f] ? 10 : 22;
          mg[c] += bonus;
          eg[c] += bonus >> 1;
        }
        const mob = mobility(pos, sq, ROOK_DIRS, true, them);
        mg[c] += (mob - 7) * 2;
        eg[c] += (mob - 7) * 4;
        break;
      }
      case QUEEN: {
        mg[c] += PST_QUEEN[idx];
        eg[c] += PST_QUEEN[idx];
        break;
      }
      case KING: {
        mg[c] += PST_KING_MG[idx];
        eg[c] += PST_KING_EG[idx];
        const dir = color === WHITE ? -16 : 16;
        let shield = 0;
        for (let df = -1; df <= 1; df++) {
          const s1 = sq + dir + df;
          const s2 = sq + 2 * dir + df;
          if (onBoard(s1) && b[s1] === (color | PAWN)) shield += 12;
          else if (onBoard(s2) && b[s2] === (color | PAWN)) shield += 6;
          const ff = (sq & 7) + df;
          if (ff >= 0 && ff < 8 && !pawnFiles[c][ff]) shield -= 10;
        }
        mg[c] += shield;
        break;
      }
      default:
    }
  }

  if (bishops[0] >= 2) { mg[0] += 30; eg[0] += 45; }
  if (bishops[1] >= 2) { mg[1] += 30; eg[1] += 45; }

  if (phase > 24) phase = 24;
  let score = ((mg[0] - mg[1]) * phase + (eg[0] - eg[1]) * (24 - phase)) / 24;

  score += mopUp(pos, material, pawnCount);

  /* Without pawns, being up only a minor piece rarely wins. */
  for (let c = 0; c < 2; c++) {
    const sign = c === 0 ? 1 : -1;
    if (sign * score > 0 && pawnCount[c] === 0 && material[c] - material[1 - c] < 400) score /= 4;
  }

  const stm = pos.side === WHITE ? score : -score;
  return Math.round(stm) + 10;
}

/* Drives the losing king to the edge and brings the winning king closer in won endings. */
function mopUp(pos, material, pawnCount) {
  const diff = material[0] - material[1];
  if (Math.abs(diff) < 400) return 0;
  const strong = diff > 0 ? 0 : 1;
  const weak = 1 - strong;
  if (material[weak] > 400 || pawnCount[weak] > 0) return 0;
  const wk = pos.kings[weak];
  const sk = pos.kings[strong];
  const edge = CENTER_DIST[wk & 7] + CENTER_DIST[wk >> 4];
  const dist = Math.abs((wk & 7) - (sk & 7)) + Math.abs((wk >> 4) - (sk >> 4));
  const bonus = edge * 25 + (14 - dist) * 8;
  return strong === 0 ? bonus : -bonus;
}