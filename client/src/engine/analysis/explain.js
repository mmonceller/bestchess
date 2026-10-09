import { Position } from '../core/position.js';
import {
  PAWN, KNIGHT, BISHOP, ROOK, QUEEN, KING, WHITE, PIECE_VALUE, FLAG_EP, FLAG_CASTLE, MATE_BOUND,
  BISHOP_DIRS, ROOK_DIRS, colorOf, typeOf, moveFrom, moveTo, movePromo, moveFlags, sqToAlg, SQUARES_64,
} from '../core/constants.js';
import { mateIn } from '../core/search.js';

const NAMES = ['', 'pawn', 'knight', 'bishop', 'rook', 'queen', 'king'];
const CENTER = new Set(['d4', 'e4', 'd5', 'e5']);

const value = (t) => (t === KING ? 10000 : PIECE_VALUE[t]);

function isHanging(pos, sq) {
  const p = pos.board[sq];
  if (!p || typeOf(p) === KING) return false;
  const owner = colorOf(p);
  const enemy = owner ^ 8;
  const attackers = pos.attackers(sq, enemy);
  if (!attackers.length) return false;
  if (!pos.isAttacked(sq, owner)) return true;
  const cheapest = Math.min(...attackers.map((a) => value(typeOf(pos.board[a]))));
  return cheapest < value(typeOf(p));
}

function hangingPieces(pos, color) {
  return SQUARES_64.filter((sq) => pos.board[sq] && colorOf(pos.board[sq]) === color && isHanging(pos, sq));
}

/* Pieces of `color` that are not defended by any friendly piece (loose pieces). */
export function loosePieces(pos, color) {
  return SQUARES_64.filter((sq) => {
    const p = pos.board[sq];
    return p && colorOf(p) === color && typeOf(p) !== KING && !pos.isAttacked(sq, color);
  }).map(sqToAlg);
}

function isPassedPawn(pos, sq, color) {
  const f = sq & 7;
  const dir = color === WHITE ? -16 : 16;
  for (let t = sq + dir; t >= 0 && t < 128; t += dir) {
    for (let df = -1; df <= 1; df++) {
      const ff = f + df;
      if (ff < 0 || ff > 7) continue;
      const s = (t & 0x70) + ff;
      if (pos.board[s] === ((color ^ 8) | PAWN)) return false;
    }
  }
  return true;
}

function pieceCount(pos) {
  return SQUARES_64.reduce((n, sq) => n + (pos.board[sq] && typeOf(pos.board[sq]) !== PAWN ? 1 : 0), 0);
}

function material(pos, color) {
  return SQUARES_64.reduce((n, sq) => {
    const p = pos.board[sq];
    return p && colorOf(p) === color && typeOf(p) !== KING ? n + PIECE_VALUE[typeOf(p)] : n;
  }, 0);
}

const piecesOf = (pos, color) => SQUARES_64.filter((sq) => pos.board[sq] && colorOf(pos.board[sq]) === color).map((sq) => typeOf(pos.board[sq]));

/* Does the slider on `sq` pin an enemy piece to its king or to a more valuable piece behind it? */
function createsPin(pos, sq) {
  const p = pos.board[sq];
  const t = typeOf(p);
  const dirs = t === BISHOP ? BISHOP_DIRS : t === ROOK ? ROOK_DIRS : t === QUEEN ? [...BISHOP_DIRS, ...ROOK_DIRS] : [];
  const them = colorOf(p) ^ 8;
  for (const d of dirs) {
    let front = null;
    for (let s = sq + d; !(s & 0x88); s += d) {
      const q = pos.board[s];
      if (!q) continue;
      if (colorOf(q) !== them) break;
      if (!front) { front = typeOf(q); if (front === KING) break; continue; }
      const back = typeOf(q);
      if (back === KING || (value(back) > value(front) && value(back) > value(t))) return true;
      break;
    }
  }
  return false;
}

const rankOf = (sq) => 8 - (sq >> 4);
const fileOf = (sq) => sq & 7;
const forward = (color) => (color === WHITE ? 1 : -1);
const findPiece = (pos, piece) => SQUARES_64.find((sq) => pos.board[sq] === piece);
const passedPawns = (pos, color) => SQUARES_64.filter((sq) => pos.board[sq] === (color | PAWN) && isPassedPawn(pos, sq, color));

/* Is every square strictly between two squares on the same file empty? */
function clearFile(pos, a, b) {
  const step = a < b ? 16 : -16;
  for (let s = a + step; s !== b; s += step) if (pos.board[s]) return false;
  return true;
}

/*
 * Strategic ideas taught in the lessons, checked after the move is made and worded the
 * way the coaches say them, so hints and lessons give the same advice.
 */
function strategicIdea(pos, { us, them, to, mover, context }) {
  if (mover === ROOK) {
    for (const color of [us, them]) {
      const pawn = passedPawns(pos, color).find((sq) => fileOf(sq) === fileOf(to)
        && (rankOf(to) - rankOf(sq)) * forward(color) < 0 && clearFile(pos, to, sq));
      if (pawn != null) {
        return color === us
          ? { tag: 'rookBehindPasser', text: 'Puts your rook behind your passed pawn — rooks belong behind passed pawns, where they gain room as the pawn advances.' }
          : { tag: 'rookBehindPasser', text: 'Puts your rook behind their passed pawn — from there it stops the pawn and stays active.' };
      }
    }
    const enemyKing = findPiece(pos, them | KING);
    if (context.includes('rookEndgame') && enemyKing != null) {
      const cuts = passedPawns(pos, us).some((sq) => {
        const [lo, hi] = [fileOf(sq), fileOf(enemyKing)].sort((a, b) => a - b);
        return fileOf(to) > lo && fileOf(to) < hi;
      });
      if (cuts) return { tag: 'cutOff', text: 'Cuts the enemy king off — your rook works like a wall it can\'t cross to help.' };
    }
  }
  if (mover === KING && context.includes('pawnEndgame')) {
    const enemyKing = findPiece(pos, them | KING);
    const df = Math.abs(fileOf(enemyKing) - fileOf(to));
    const dr = Math.abs(rankOf(enemyKing) - rankOf(to));
    if ((df === 0 && dr === 2) || (dr === 0 && df === 2)) {
      return { tag: 'opposition', text: 'Takes the opposition — the kings face each other, so your opponent must step aside.' };
    }
  }
  if (mover !== PAWN && passedPawns(pos, them).some((sq) => sq === to + (them === WHITE ? 16 : -16))) {
    return { tag: 'blockade', text: 'Blockades their passed pawn — a piece right in front of it stops it cold.' };
  }
  if (mover === KNIGHT) {
    const r = rankOf(to);
    const inEnemyHalf = us === WHITE ? r >= 5 && r <= 7 : r >= 2 && r <= 4;
    const pawnGuard = SQUARES_64.some((sq) => pos.board[sq] === (us | PAWN)
      && Math.abs(fileOf(sq) - fileOf(to)) === 1 && rankOf(sq) === r - forward(us));
    const canBeChased = SQUARES_64.some((sq) => pos.board[sq] === (them | PAWN)
      && Math.abs(fileOf(sq) - fileOf(to)) === 1 && (rankOf(sq) - r) * forward(us) > 0);
    if (inEnemyHalf && pawnGuard && !canBeChased) {
      return { tag: 'outpost', text: 'Puts your knight on an outpost — a safe square protected by a pawn that no enemy pawn can chase it from.' };
    }
  }
  return null;
}

/* Broad labels for the kind of position, so hints can point to the lessons that cover it. */
function positionTags(pos, us, them, fullmove, score) {
  const tags = [];
  const mine = piecesOf(pos, us);
  const theirs = piecesOf(pos, them);
  const nonPawn = (list) => list.filter((t) => t !== PAWN && t !== KING);
  if (fullmove <= 12) tags.push('opening');
  if (pieceCount(pos) <= 6) tags.push('endgame');
  if (theirs.length === 1) tags.push('loneKing');
  if (!nonPawn(mine).length && !nonPawn(theirs).length) tags.push('pawnEndgame');
  if (nonPawn(mine).every((t) => t === ROOK) && nonPawn(theirs).every((t) => t === ROOK)
    && nonPawn(mine).length === 1 && nonPawn(theirs).length === 1) tags.push('rookEndgame');
  const diff = material(pos, us) - material(pos, them);
  if (diff > 0) tags.push('materialUp');
  if (diff < 0) tags.push('materialDown');
  if (diff >= 200) tags.push('ahead');
  if (score <= -150 && score > -MATE_BOUND) tags.push('losing');
  return tags;
}

export function describeScore(score) {
  if (Math.abs(score) > MATE_BOUND) {
    const n = mateIn(score);
    return n > 0 ? `You have a forced mate in ${n}.` : `Danger: you're getting mated in ${-n}.`;
  }
  const s = score / 100;
  if (s >= 3) return 'You are winning — trade pieces and keep it simple.';
  if (s >= 1.2) return 'You are clearly better.';
  if (s >= 0.4) return 'You have a slight edge.';
  if (s > -0.4) return 'The position is balanced.';
  if (s > -1.2) return 'You are slightly worse — stay solid.';
  if (s > -3) return 'You are in trouble; look for counterplay.';
  return 'You are losing — make it messy, set traps and fight on.';
}

/*
 * Builds short human-readable reasons for why `uci` is a good move in `fen`.
 * `score` is the engine score for the side to move after playing the best line.
 * `tags` name the ideas behind the move (most important first) and `piece` is the moving piece.
 */
export function explainMove(fen, uci, score = 0) {
  const pos = new Position(fen);
  const m = pos.uciToMove(uci);
  if (!m) return { reasons: ['This move keeps the position under control.'], assessment: describeScore(score), tags: [], piece: null };

  const us = pos.side;
  const them = us ^ 8;
  const from = moveFrom(m);
  const to = moveTo(m);
  const flags = moveFlags(m);
  const mover = typeOf(pos.board[from]);
  const capturedType = flags & FLAG_EP ? PAWN : typeOf(pos.board[to]);
  const promo = movePromo(m);
  const fullmove = pos.fullmove;
  const endgame = pieceCount(pos) <= 6;
  const context = positionTags(pos, us, them, fullmove, score);
  const piece = NAMES[mover];

  const moverWasHanging = isHanging(pos, from);
  const hangingBefore = hangingPieces(pos, us).filter((sq) => sq !== from);
  const enemyHangingBefore = new Set(hangingPieces(pos, them));

  pos.make(m);
  const reasons = [];
  const tags = [];
  const add = (tag, text) => { tags.push(tag); reasons.push(text); };
  const replies = pos.legalMoves();
  const check = pos.inCheck();

  if (!replies.length && check) {
    return { reasons: ['Checkmate! The king has no escape.'], assessment: 'Game over — you win.', tags: ['mate', ...context], piece };
  }
  if (!replies.length) {
    return { reasons: ['This forces stalemate — only good if you were losing.'], assessment: describeScore(score), tags: context, piece };
  }

  if (Math.abs(score) > MATE_BOUND && score > 0) add('mate', `Starts a forced checkmate in ${mateIn(score)}.`);
  if (promo) add('promotion', `Promotes the pawn to a ${NAMES[promo]}.`);

  const attackedAfter = pos.isAttacked(to, them);
  const defendedAfter = pos.isAttacked(to, us);

  if (capturedType) {
    const cap = NAMES[capturedType];
    if (moverWasHanging && attackedAfter && value(capturedType) < value(mover)) {
      add('desperado', `Your ${piece} was lost anyway, so it grabs a ${cap} on the way out.`);
    } else if (!attackedAfter) add('freePiece', `Grabs a free ${cap} — nothing can recapture.`);
    else if (value(capturedType) > value(mover)) add('winMaterial', `Wins material: your ${piece} takes a ${cap}.`);
    else if (value(capturedType) === value(mover)) {
      add('trade', context.includes('ahead')
        ? `Trades ${piece}s while you're ahead — every trade makes your extra material count more.`
        : `Trades ${piece}s on your terms.`);
    }
    else if (enemyHangingBefore.has(to) && defendedAfter) add('winMaterial', `Takes the ${cap}; your recapture keeps the material.`);
    else add('sacrifice', `A sacrifice: giving up the ${piece} for a ${cap} opens the position for your attack.`);
  }

  /* Targets now hit by the moved piece. */
  const targets = [];
  for (const sq of SQUARES_64) {
    const p = pos.board[sq];
    if (!p || colorOf(p) !== them) continue;
    if (!pos.attackers(sq, us).includes(to)) continue;
    const t = typeOf(p);
    if (t === KING || value(t) > value(mover) || !pos.isAttacked(sq, them)) targets.push(t);
  }
  const safeEnough = !attackedAfter || defendedAfter;
  if (targets.length >= 2 && safeEnough) {
    const names = targets.map((t) => NAMES[t]);
    add('fork', `Fork! Your ${piece} attacks the ${names.slice(0, 2).join(' and the ')} at once.`);
  } else if (safeEnough && createsPin(pos, to)) {
    add('pin', `Pins a piece: it can't move without exposing something more valuable behind it.`);
  } else if (check) {
    add('check', 'Gives check, so your opponent must respond to it.');
  } else if (targets.length === 1 && safeEnough) {
    add('attack', `Attacks the ${NAMES[targets[0]]}, gaining time.`);
  }

  if (moverWasHanging && (!attackedAfter || defendedAfter) && !capturedType) {
    add('rescue', `Rescues your ${piece}, which was under attack.`);
  }
  const hangingAfter = new Set(hangingPieces(pos, us));
  const saved = hangingBefore.filter((sq) => !hangingAfter.has(sq) && pos.board[sq]);
  if (saved.length && !capturedType) {
    add('protect', `Protects your ${NAMES[typeOf(pos.board[saved[0]])]} on ${sqToAlg(saved[0])}.`);
  }

  if (flags & FLAG_CASTLE) add('castle', 'Castles: the king gets safe and your rooks connect.');

  if (reasons.length < 2 && !tags.includes('mate')) {
    const idea = strategicIdea(pos, { us, them, to, mover, context });
    if (idea) add(idea.tag, idea.text);
  }

  if (!reasons.length) {
    if (mover === PAWN && CENTER.has(sqToAlg(to)) && fullmove <= 15) {
      add('center', 'Claims the center — control the middle so your pieces have room to come out.');
    } else if ((mover === KNIGHT || mover === BISHOP) && fullmove <= 12 && ((from >> 4) === (us === WHITE ? 7 : 0))) {
      add('develop', `Develops your ${piece} — the opening is a race to get your pieces out.`);
    } else if (mover === PAWN && isPassedPawn(pos, to, us)) {
      add('passedPawn', 'Pushes your passed pawn — a passed pawn is a baby queen, and no pawn can stop it.');
    } else if (mover === KING && endgame) {
      add('activeKing', 'Activates the king — in endgames, the king is a fighting piece. Bring it toward the middle.');
    } else if (mover === ROOK && !SQUARES_64.some((sq) => (sq & 7) === (to & 7) && pos.board[sq] === (us | PAWN))) {
      add('openFile', 'Puts the rook on an open file — rooks need open roads to do their job.');
    } else if (mover === PAWN && !capturedType) {
      add('space', 'A useful pawn move that gains space and restricts enemy pieces.');
    } else {
      add('improve', `Improves your ${piece} — when nothing urgent is happening, fix your worst piece.`);
    }
  }

  return { reasons: reasons.slice(0, 2), assessment: describeScore(score), tags: [...tags, ...context], piece };
}
