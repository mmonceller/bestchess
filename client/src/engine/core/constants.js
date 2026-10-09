export const EMPTY = 0;
export const PAWN = 1;
export const KNIGHT = 2;
export const BISHOP = 3;
export const ROOK = 4;
export const QUEEN = 5;
export const KING = 6;

export const WHITE = 0;
export const BLACK = 8;

export const FLAG_CAPTURE = 1;
export const FLAG_EP = 2;
export const FLAG_CASTLE = 4;
export const FLAG_DOUBLE = 8;

export const CASTLE_WK = 1;
export const CASTLE_WQ = 2;
export const CASTLE_BK = 4;
export const CASTLE_BQ = 8;

export const KNIGHT_DIRS = [-33, -31, -18, -14, 14, 18, 31, 33];
export const BISHOP_DIRS = [-17, -15, 15, 17];
export const ROOK_DIRS = [-16, -1, 1, 16];
export const KING_DIRS = [-17, -16, -15, -1, 1, 15, 16, 17];

export const PIECE_VALUE = [0, 100, 320, 330, 500, 900, 20000];

export const PIECE_CHARS = ' pnbrqk';

export const MATE = 30000;
export const MATE_BOUND = 29000;
export const INF = 32000;

export const onBoard = (sq) => (sq & 0x88) === 0;
export const rankOf = (sq) => sq >> 4;
export const fileOf = (sq) => sq & 7;
export const colorOf = (p) => p & 8;
export const typeOf = (p) => p & 7;

export const SQUARES_64 = [];
for (let r = 0; r < 8; r++) for (let f = 0; f < 8; f++) SQUARES_64.push(r * 16 + f);

export function sqToAlg(sq) {
  return 'abcdefgh'[sq & 7] + (8 - (sq >> 4));
}

export function algToSq(alg) {
  const f = alg.charCodeAt(0) - 97;
  const r = 8 - parseInt(alg[1], 10);
  return r * 16 + f;
}

/* Squares that, when touched, strip castling rights. */
export const CASTLE_MASK = new Uint8Array(128).fill(15);
CASTLE_MASK[112] = 15 & ~CASTLE_WQ;
CASTLE_MASK[119] = 15 & ~CASTLE_WK;
CASTLE_MASK[116] = 15 & ~(CASTLE_WK | CASTLE_WQ);
CASTLE_MASK[0] = 15 & ~CASTLE_BQ;
CASTLE_MASK[7] = 15 & ~CASTLE_BK;
CASTLE_MASK[4] = 15 & ~(CASTLE_BK | CASTLE_BQ);

export const moveFrom = (m) => m & 127;
export const moveTo = (m) => (m >> 7) & 127;
export const movePromo = (m) => (m >> 14) & 7;
export const moveFlags = (m) => (m >> 17) & 15;
export const encodeMove = (from, to, promo, flags) => from | (to << 7) | (promo << 14) | (flags << 17);
