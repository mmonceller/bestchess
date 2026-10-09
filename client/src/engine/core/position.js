import {
  EMPTY, PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, WHITE, BLACK,
  FLAG_CAPTURE, FLAG_EP, FLAG_CASTLE, FLAG_DOUBLE,
  CASTLE_WK, CASTLE_WQ, CASTLE_BK, CASTLE_BQ, CASTLE_MASK,
  KNIGHT_DIRS, BISHOP_DIRS, ROOK_DIRS, KING_DIRS, PIECE_CHARS,
  onBoard, colorOf, typeOf, sqToAlg, algToSq,
  moveFrom, moveTo, movePromo, moveFlags, encodeMove,
} from './constants.js';
import { Z1, Z2 } from './zobrist.js';

export const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

const MAX_PLY = 1024;

export class Position {
  constructor(fen = START_FEN) {
    this.board = new Int8Array(128);
    this.kings = new Int16Array(2);
    this.stackMove = new Int32Array(MAX_PLY);
    this.stackCaptured = new Int8Array(MAX_PLY);
    this.stackCastle = new Uint8Array(MAX_PLY);
    this.stackEp = new Int16Array(MAX_PLY);
    this.stackHalf = new Int16Array(MAX_PLY);
    this.stackH1 = new Int32Array(MAX_PLY);
    this.stackH2 = new Int32Array(MAX_PLY);
    this.ply = 0;
    this.load(fen);
  }

  load(fen) {
    const [placement, side, castle, ep, half, full] = fen.trim().split(/\s+/);
    this.board.fill(EMPTY);
    let r = 0;
    let f = 0;
    for (const ch of placement) {
      if (ch === '/') { r++; f = 0; continue; }
      if (ch >= '1' && ch <= '8') { f += +ch; continue; }
      const lower = ch.toLowerCase();
      const type = PIECE_CHARS.indexOf(lower);
      const color = ch === lower ? BLACK : WHITE;
      const sq = r * 16 + f;
      this.board[sq] = color | type;
      if (type === KING) this.kings[color >> 3] = sq;
      f++;
    }
    this.side = side === 'b' ? BLACK : WHITE;
    this.castle = 0;
    if (castle && castle !== '-') {
      if (castle.includes('K')) this.castle |= CASTLE_WK;
      if (castle.includes('Q')) this.castle |= CASTLE_WQ;
      if (castle.includes('k')) this.castle |= CASTLE_BK;
      if (castle.includes('q')) this.castle |= CASTLE_BQ;
    }
    this.ep = ep && ep !== '-' ? algToSq(ep) : -1;
    this.halfmove = half ? +half : 0;
    this.fullmove = full ? +full : 1;
    this.ply = 0;
    this.computeHash();
  }

  computeHash() {
    let h1 = 0;
    let h2 = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (!onBoard(sq)) { sq += 7; continue; }
      const p = this.board[sq];
      if (p) { h1 ^= Z1.piece[p * 128 + sq]; h2 ^= Z2.piece[p * 128 + sq]; }
    }
    h1 ^= Z1.castle[this.castle];
    h2 ^= Z2.castle[this.castle];
    if (this.ep >= 0) { h1 ^= Z1.ep[this.ep]; h2 ^= Z2.ep[this.ep]; }
    if (this.side === BLACK) { h1 ^= Z1.side; h2 ^= Z2.side; }
    this.h1 = h1;
    this.h2 = h2;
  }

  fen() {
    let out = '';
    for (let r = 0; r < 8; r++) {
      let empty = 0;
      for (let f = 0; f < 8; f++) {
        const p = this.board[r * 16 + f];
        if (!p) { empty++; continue; }
        if (empty) { out += empty; empty = 0; }
        const ch = PIECE_CHARS[typeOf(p)];
        out += colorOf(p) === WHITE ? ch.toUpperCase() : ch;
      }
      if (empty) out += empty;
      if (r < 7) out += '/';
    }
    let c = '';
    if (this.castle & CASTLE_WK) c += 'K';
    if (this.castle & CASTLE_WQ) c += 'Q';
    if (this.castle & CASTLE_BK) c += 'k';
    if (this.castle & CASTLE_BQ) c += 'q';
    return `${out} ${this.side === WHITE ? 'w' : 'b'} ${c || '-'} ${this.ep >= 0 ? sqToAlg(this.ep) : '-'} ${this.halfmove} ${this.fullmove}`;
  }

  isAttacked(sq, by) {
    const b = this.board;
    if (by === WHITE) {
      if (onBoard(sq + 15) && b[sq + 15] === (WHITE | PAWN)) return true;
      if (onBoard(sq + 17) && b[sq + 17] === (WHITE | PAWN)) return true;
    } else {
      if (onBoard(sq - 15) && b[sq - 15] === (BLACK | PAWN)) return true;
      if (onBoard(sq - 17) && b[sq - 17] === (BLACK | PAWN)) return true;
    }
    const knight = by | KNIGHT;
    for (let i = 0; i < 8; i++) {
      const t = sq + KNIGHT_DIRS[i];
      if (onBoard(t) && b[t] === knight) return true;
    }
    const king = by | KING;
    for (let i = 0; i < 8; i++) {
      const t = sq + KING_DIRS[i];
      if (onBoard(t) && b[t] === king) return true;
    }
    const bishop = by | BISHOP;
    const rook = by | ROOK;
    const queen = by | QUEEN;
    for (let i = 0; i < 4; i++) {
      const d = BISHOP_DIRS[i];
      let t = sq + d;
      while (onBoard(t)) {
        const p = b[t];
        if (p) { if (p === bishop || p === queen) return true; break; }
        t += d;
      }
    }
    for (let i = 0; i < 4; i++) {
      const d = ROOK_DIRS[i];
      let t = sq + d;
      while (onBoard(t)) {
        const p = b[t];
        if (p) { if (p === rook || p === queen) return true; break; }
        t += d;
      }
    }
    return false;
  }

  /* Returns the squares of every `by` piece attacking `sq`. */
  attackers(sq, by) {
    const out = [];
    const b = this.board;
    const pawnSrc = by === WHITE ? [sq + 15, sq + 17] : [sq - 15, sq - 17];
    for (const t of pawnSrc) if (onBoard(t) && b[t] === (by | PAWN)) out.push(t);
    for (const d of KNIGHT_DIRS) { const t = sq + d; if (onBoard(t) && b[t] === (by | KNIGHT)) out.push(t); }
    for (const d of KING_DIRS) { const t = sq + d; if (onBoard(t) && b[t] === (by | KING)) out.push(t); }
    const scan = (dirs, a, c) => {
      for (const d of dirs) {
        let t = sq + d;
        while (onBoard(t)) {
          const p = b[t];
          if (p) { if (p === (by | a) || p === (by | c)) out.push(t); break; }
          t += d;
        }
      }
    };
    scan(BISHOP_DIRS, BISHOP, QUEEN);
    scan(ROOK_DIRS, ROOK, QUEEN);
    return out;
  }

  inCheck(side = this.side) {
    return this.isAttacked(this.kings[side >> 3], side ^ 8);
  }

  generate(moves, capturesOnly = false) {
    const b = this.board;
    const us = this.side;
    const them = us ^ 8;
    let n = 0;
    const pushPawn = (from, to, flags) => {
      const r = to >> 4;
      if (r === 0 || r === 7) {
        moves[n++] = encodeMove(from, to, QUEEN, flags);
        if (!capturesOnly) {
          moves[n++] = encodeMove(from, to, KNIGHT, flags);
          moves[n++] = encodeMove(from, to, ROOK, flags);
          moves[n++] = encodeMove(from, to, BISHOP, flags);
        }
      } else if (!capturesOnly || flags & FLAG_CAPTURE) {
        moves[n++] = encodeMove(from, to, 0, flags);
      }
    };
    for (let from = 0; from < 128; from++) {
      if (from & 0x88) { from += 7; continue; }
      const p = b[from];
      if (!p || colorOf(p) !== us) continue;
      const type = typeOf(p);
      if (type === PAWN) {
        const dir = us === WHITE ? -16 : 16;
        const startRank = us === WHITE ? 6 : 1;
        const one = from + dir;
        if (onBoard(one) && !b[one]) {
          pushPawn(from, one, 0);
          if (!capturesOnly && (from >> 4) === startRank && !b[one + dir]) {
            moves[n++] = encodeMove(from, one + dir, 0, FLAG_DOUBLE);
          }
        }
        for (const side of [-1, 1]) {
          const to = one + side;
          if (!onBoard(to)) continue;
          if (b[to] && colorOf(b[to]) === them) pushPawn(from, to, FLAG_CAPTURE);
          else if (to === this.ep) moves[n++] = encodeMove(from, to, 0, FLAG_CAPTURE | FLAG_EP);
        }
      } else if (type === KNIGHT || type === KING) {
        const dirs = type === KNIGHT ? KNIGHT_DIRS : KING_DIRS;
        for (let i = 0; i < 8; i++) {
          const to = from + dirs[i];
          if (!onBoard(to)) continue;
          const t = b[to];
          if (!t) { if (!capturesOnly) moves[n++] = encodeMove(from, to, 0, 0); }
          else if (colorOf(t) === them) moves[n++] = encodeMove(from, to, 0, FLAG_CAPTURE);
        }
      } else {
        const dirs = type === BISHOP ? BISHOP_DIRS : type === ROOK ? ROOK_DIRS : KING_DIRS;
        for (let i = 0; i < dirs.length; i++) {
          const d = dirs[i];
          let to = from + d;
          while (onBoard(to)) {
            const t = b[to];
            if (!t) { if (!capturesOnly) moves[n++] = encodeMove(from, to, 0, 0); }
            else { if (colorOf(t) === them) moves[n++] = encodeMove(from, to, 0, FLAG_CAPTURE); break; }
            to += d;
          }
        }
      }
    }
    if (!capturesOnly) n = this.generateCastles(moves, n);
    return n;
  }

  generateCastles(moves, n) {
    const b = this.board;
    if (this.side === WHITE) {
      if (this.castle & CASTLE_WK && !b[117] && !b[118] && b[119] === (WHITE | ROOK) &&
        !this.isAttacked(116, BLACK) && !this.isAttacked(117, BLACK) && !this.isAttacked(118, BLACK)) {
        moves[n++] = encodeMove(116, 118, 0, FLAG_CASTLE);
      }
      if (this.castle & CASTLE_WQ && !b[115] && !b[114] && !b[113] && b[112] === (WHITE | ROOK) &&
        !this.isAttacked(116, BLACK) && !this.isAttacked(115, BLACK) && !this.isAttacked(114, BLACK)) {
        moves[n++] = encodeMove(116, 114, 0, FLAG_CASTLE);
      }
    } else {
      if (this.castle & CASTLE_BK && !b[5] && !b[6] && b[7] === (BLACK | ROOK) &&
        !this.isAttacked(4, WHITE) && !this.isAttacked(5, WHITE) && !this.isAttacked(6, WHITE)) {
        moves[n++] = encodeMove(4, 6, 0, FLAG_CASTLE);
      }
      if (this.castle & CASTLE_BQ && !b[3] && !b[2] && !b[1] && b[0] === (BLACK | ROOK) &&
        !this.isAttacked(4, WHITE) && !this.isAttacked(3, WHITE) && !this.isAttacked(2, WHITE)) {
        moves[n++] = encodeMove(4, 2, 0, FLAG_CASTLE);
      }
    }
    return n;
  }

  movePiece(from, to, p) {
    this.board[to] = p;
    this.board[from] = EMPTY;
    this.h1 ^= Z1.piece[p * 128 + from] ^ Z1.piece[p * 128 + to];
    this.h2 ^= Z2.piece[p * 128 + from] ^ Z2.piece[p * 128 + to];
  }

  /* Makes a pseudo-legal move; returns false (and undoes it) if it leaves the mover in check. */
  make(m) {
    const b = this.board;
    const from = moveFrom(m);
    const to = moveTo(m);
    const flags = moveFlags(m);
    const promo = movePromo(m);
    const us = this.side;
    const p = b[from];
    const i = this.ply;

    this.stackMove[i] = m;
    this.stackCastle[i] = this.castle;
    this.stackEp[i] = this.ep;
    this.stackHalf[i] = this.halfmove;
    this.stackH1[i] = this.h1;
    this.stackH2[i] = this.h2;

    let captured = EMPTY;
    if (flags & FLAG_EP) {
      const capSq = to + (us === WHITE ? 16 : -16);
      captured = b[capSq];
      b[capSq] = EMPTY;
      this.h1 ^= Z1.piece[captured * 128 + capSq];
      this.h2 ^= Z2.piece[captured * 128 + capSq];
    } else if (b[to]) {
      captured = b[to];
      this.h1 ^= Z1.piece[captured * 128 + to];
      this.h2 ^= Z2.piece[captured * 128 + to];
    }
    this.stackCaptured[i] = captured;

    this.movePiece(from, to, p);
    if (promo) {
      const np = us | promo;
      b[to] = np;
      this.h1 ^= Z1.piece[p * 128 + to] ^ Z1.piece[np * 128 + to];
      this.h2 ^= Z2.piece[p * 128 + to] ^ Z2.piece[np * 128 + to];
    }
    if (flags & FLAG_CASTLE) {
      if (to === 118) this.movePiece(119, 117, WHITE | ROOK);
      else if (to === 114) this.movePiece(112, 115, WHITE | ROOK);
      else if (to === 6) this.movePiece(7, 5, BLACK | ROOK);
      else if (to === 2) this.movePiece(0, 3, BLACK | ROOK);
    }
    if (typeOf(p) === KING) this.kings[us >> 3] = to;

    this.h1 ^= Z1.castle[this.castle];
    this.h2 ^= Z2.castle[this.castle];
    this.castle &= CASTLE_MASK[from] & CASTLE_MASK[to];
    this.h1 ^= Z1.castle[this.castle];
    this.h2 ^= Z2.castle[this.castle];

    if (this.ep >= 0) { this.h1 ^= Z1.ep[this.ep]; this.h2 ^= Z2.ep[this.ep]; }
    this.ep = flags & FLAG_DOUBLE ? (from + to) >> 1 : -1;
    if (this.ep >= 0) { this.h1 ^= Z1.ep[this.ep]; this.h2 ^= Z2.ep[this.ep]; }

    this.halfmove = typeOf(p) === PAWN || captured ? 0 : this.halfmove + 1;
    if (us === BLACK) this.fullmove++;
    this.side = us ^ 8;
    this.h1 ^= Z1.side;
    this.h2 ^= Z2.side;
    this.ply++;

    if (this.isAttacked(this.kings[us >> 3], this.side)) {
      this.unmake();
      return false;
    }
    return true;
  }

  unmake() {
    if (this.stackMove[this.ply - 1] === 0) { this.unmakeNull(); return; }
    this.ply--;
    const i = this.ply;
    const m = this.stackMove[i];
    const b = this.board;
    const from = moveFrom(m);
    const to = moveTo(m);
    const flags = moveFlags(m);
    this.side ^= 8;
    const us = this.side;
    if (us === BLACK) this.fullmove--;

    const moved = movePromo(m) ? us | PAWN : b[to];
    b[from] = moved;
    b[to] = EMPTY;
    const captured = this.stackCaptured[i];
    if (flags & FLAG_EP) b[to + (us === WHITE ? 16 : -16)] = captured;
    else b[to] = captured;

    if (flags & FLAG_CASTLE) {
      if (to === 118) { b[119] = WHITE | ROOK; b[117] = EMPTY; }
      else if (to === 114) { b[112] = WHITE | ROOK; b[115] = EMPTY; }
      else if (to === 6) { b[7] = BLACK | ROOK; b[5] = EMPTY; }
      else if (to === 2) { b[0] = BLACK | ROOK; b[3] = EMPTY; }
    }
    if (typeOf(moved) === KING) this.kings[us >> 3] = from;

    this.castle = this.stackCastle[i];
    this.ep = this.stackEp[i];
    this.halfmove = this.stackHalf[i];
    this.h1 = this.stackH1[i];
    this.h2 = this.stackH2[i];
  }

  makeNull() {
    const i = this.ply;
    this.stackMove[i] = 0;
    this.stackCastle[i] = this.castle;
    this.stackEp[i] = this.ep;
    this.stackHalf[i] = this.halfmove;
    this.stackH1[i] = this.h1;
    this.stackH2[i] = this.h2;
    this.stackCaptured[i] = EMPTY;
    if (this.ep >= 0) { this.h1 ^= Z1.ep[this.ep]; this.h2 ^= Z2.ep[this.ep]; }
    this.ep = -1;
    this.side ^= 8;
    this.h1 ^= Z1.side;
    this.h2 ^= Z2.side;
    this.halfmove++;
    this.ply++;
  }

  unmakeNull() {
    this.ply--;
    const i = this.ply;
    this.side ^= 8;
    this.ep = this.stackEp[i];
    this.halfmove = this.stackHalf[i];
    this.h1 = this.stackH1[i];
    this.h2 = this.stackH2[i];
  }

  legalMoves() {
    const buf = new Int32Array(256);
    const n = this.generate(buf);
    const out = [];
    for (let i = 0; i < n; i++) {
      if (this.make(buf[i])) { out.push(buf[i]); this.unmake(); }
    }
    return out;
  }

  /* True when the current position already occurred since the last irreversible move. */
  isRepetition(historyH1, historyH2) {
    const limit = Math.min(this.halfmove, historyH1.length);
    for (let k = 2; k <= limit; k += 2) {
      const idx = historyH1.length - k;
      if (historyH1[idx] === this.h1 && historyH2[idx] === this.h2) return true;
    }
    return false;
  }

  hasNonPawnMaterial(side) {
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const p = this.board[sq];
      if (p && colorOf(p) === side) {
        const t = typeOf(p);
        if (t !== PAWN && t !== KING) return true;
      }
    }
    return false;
  }

  isInsufficientMaterial() {
    let minors = 0;
    for (let sq = 0; sq < 128; sq++) {
      if (sq & 0x88) { sq += 7; continue; }
      const t = typeOf(this.board[sq]);
      if (t === PAWN || t === ROOK || t === QUEEN) return false;
      if (t === KNIGHT || t === BISHOP) minors++;
    }
    return minors <= 1;
  }

  moveToUci(m) {
    const promo = movePromo(m);
    return sqToAlg(moveFrom(m)) + sqToAlg(moveTo(m)) + (promo ? PIECE_CHARS[promo] : '');
  }

  uciToMove(uci) {
    const legal = this.legalMoves();
    return legal.find((m) => this.moveToUci(m) === uci) || 0;
  }
}
