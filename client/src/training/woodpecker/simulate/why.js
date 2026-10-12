import { Chess } from 'chess.js';
import { PIECE, VALUE, toMove } from './moves.js';

function material(chess, color) {
  return chess.board().flat().reduce((n, p) => n + (p && p.color === color ? VALUE[p.type] : 0), 0);
}

function kingSq(chess, color) {
  for (const row of chess.board()) {
    for (const p of row) {
      if (p?.type === 'k' && p.color === color) return p.square;
    }
  }
  return null;
}

function kingExposed(chess, color) {
  const sq = kingSq(chess, color);
  if (!sq) return false;
  const rank = Number(sq[1]);
  return color === 'b' ? rank <= 6 : rank >= 3;
}

function undefended(chess, color) {
  const them = color === 'w' ? 'b' : 'w';
  let n = 0;
  for (const row of chess.board()) {
    for (const p of row) {
      if (!p || p.color !== color || p.type === 'k') continue;
      const sq = p.square;
      if (!sq) continue;
      if (chess.isAttacked(sq, them) && !chess.isAttacked(sq, color)) n += 1;
    }
  }
  return n;
}

export function giftLabel(puzzle) {
  const chess = new Chess(puzzle.fen);
  const us = chess.turn();
  const moves = puzzle.moves || [];
  let gift = null;
  let best = 0;
  for (let i = 0; i < moves.length; i++) {
    let mv;
    try { mv = chess.move(toMove(moves[i])); } catch { break; }
    if (mv.color !== us || !mv.captured) continue;
    const loss = (VALUE[mv.piece] || 0) - (VALUE[mv.captured] || 0);
    if (loss < 2) continue;
    const rec = moves[i + 1] && moves[i + 1].slice(2, 4) === mv.to;
    if (!rec && !chess.moves({ verbose: true }).some((m) => m.to === mv.to && m.captured)) continue;
    if (loss > best) { best = loss; gift = PIECE[mv.piece]; }
  }
  if ((puzzle.motifs || []).includes('sacrifice') && !gift) gift = 'material';
  return gift;
}

function because(gift) {
  return gift ? ` That is why the ${gift} was given.` : ' That is why the earlier moves were necessary.';
}

/*
 * One payoff sentence from the start of the exercise to this position: mate, material,
 * a wrecked king, or threats that have been cleared.
 */
export function payoff(startFen, nowFen, us, { gift, last } = {}) {
  const start = new Chess(startFen);
  const now = new Chess(nowFen);
  const them = us === 'w' ? 'b' : 'w';
  const themToMove = now.turn() === them;
  const startGap = material(start, us) - material(start, them);
  const nowGap = material(now, us) - material(now, them);
  const gain = nowGap - startGap;
  const canMate = now.turn() === us && now.moves().some((s) => s.includes('#'));

  if (now.isCheckmate() && themToMove) {
    return `Now you mate in safety.${because(gift)}`;
  }
  if (canMate) {
    return `Now you can mate in safety.${because(gift)}`;
  }
  if (gain >= 3) {
    return `Now you have more material and the advantage.${because(gift)}`;
  }
  if (gain >= 1) {
    return `You come out ahead in material.${because(gift)}`;
  }
  if (themToMove && now.inCheck() && now.moves().length <= 2) {
    return `The king is driven out and almost trapped.${because(gift)}`;
  }
  if (!kingExposed(start, them) && kingExposed(now, them)) {
    return `Their king is in the open and you can hunt it.${because(gift)}`;
  }
  if (undefended(now, us) < undefended(start, us)) {
    return `The threats to your pieces are gone. The earlier moves cleared the way.`;
  }
  if (undefended(now, them) > undefended(start, them)) {
    return `Their pieces are hanging. The earlier moves opened those targets.`;
  }
  if (themToMove && now.inCheck()) {
    return `Their king is under fire. The earlier sacrifice opened this attack.`;
  }
  if (last) {
    return gift
      ? `You are better here. That is why the ${gift} was given.`
      : 'You are better here. That is why the earlier moves were necessary.';
  }
  return null;
}
