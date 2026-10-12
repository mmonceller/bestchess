import { Chess } from 'chess.js';

/*
 * After a Woodpecker line, a short note on what it was for. Many lines sacrifice and
 * end in check rather than mate — the win is the material or the wrecked king that remains.
 */
const VALUE = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
const NAME = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen' };

const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

const material = (chess, color) => chess.board().flat().reduce((n, p) => (
  n + (p && p.color === color ? VALUE[p.type] : 0)
), 0);

function lootName(gain) {
  if (gain >= 8) return 'the queen';
  if (gain >= 5) return 'a rook';
  if (gain >= 3) return 'a piece';
  if (gain >= 2) return 'two pawns';
  if (gain >= 1) return 'a pawn';
  return null;
}

function gaveName(types) {
  const top = [...types].sort((a, b) => VALUE[b] - VALUE[a])[0];
  return top ? NAME[top] : 'material';
}

function story(puzzle) {
  const chess = new Chess(puzzle.fen);
  const me = chess.turn();
  const start = material(chess, me) - material(chess, me === 'w' ? 'b' : 'w');
  const gave = [];
  let last = null;
  for (let i = 0; i < (puzzle.moves || []).length; i++) {
    let mv;
    try { mv = chess.move(toMove(puzzle.moves[i])); } catch { break; }
    if (i % 2 !== 0) continue;
    last = {
      san: mv.san,
      piece: mv.promotion || mv.piece,
      captured: mv.captured || null,
      check: chess.inCheck(),
      mate: chess.isCheckmate(),
    };
    const reply = puzzle.moves[i + 1];
    if (reply && reply.slice(2, 4) === mv.to) {
      const given = VALUE[mv.promotion || mv.piece];
      const got = VALUE[mv.captured] || 0;
      if (given - got >= 2) gave.push(mv.promotion || mv.piece);
    }
  }
  const end = material(chess, me) - material(chess, me === 'w' ? 'b' : 'w');
  return {
    last,
    gave,
    sacrifice: gave.length > 0 || (puzzle.motifs || []).includes('sacrifice'),
    gain: end - start,
    loot: lootName(end - start),
    motifs: puzzle.motifs || [],
    mate: puzzle.goal === 'mate' || last?.mate,
  };
}

function because(motifs) {
  if (motifs.includes('decoy')) return 'The sacrifice drags a piece onto a bad square.';
  if (motifs.includes('deflection')) return 'The sacrifice pulls a defender off its job.';
  if (motifs.includes('removeDefender')) return 'Take the piece that was holding the position together, then take what it guarded.';
  if (motifs.includes('fork')) return 'One move attacks two things; they can only save one.';
  if (motifs.includes('skewer')) return 'The big piece must step aside, and you take the one behind it.';
  if (motifs.includes('pin')) return 'A pinned piece cannot save what it was supposed to guard.';
  if (motifs.includes('discovered')) return 'Move one piece out of the way so the piece behind it hits harder.';
  if (motifs.includes('doubleCheck')) return 'Two checks at once — the king has to move.';
  if (motifs.includes('promotion')) return 'The pawn is going through to a queen.';
  if (motifs.includes('backRank')) return 'The king is trapped on the back row by its own pawns.';
  if (motifs.includes('smothered')) return 'The king is boxed in by its own pieces, so a knight check ends it.';
  return null;
}

export function aimText(puzzle) {
  const s = story(puzzle);
  const why = because(s.motifs);
  const gift = s.gave.length ? gaveName(s.gave) : 'material';
  const giftValue = Math.max(0, ...s.gave.map((t) => VALUE[t] || 0));
  const prizeFits = s.loot && s.gain >= 3 && s.gain + 1 >= giftValue;
  const lastTakes = s.last?.captured ? NAME[s.last.captured] : null;
  const quietLast = s.last && !s.last.check && !s.last.captured;

  if (s.mate) {
    if (s.sacrifice) {
      return `The sacrifices are to mate. Giving the ${gift} opens the king so the last check has nowhere to go.`;
    }
    return why ? `The goal is checkmate. ${why}` : 'The goal is checkmate. Follow every check until the king has no square.';
  }

  if (s.sacrifice && s.last?.check && prizeFits) {
    return `You give the ${gift} on purpose. The last check is not mate — it forces the defence, and you win ${s.loot}.`;
  }
  if (s.sacrifice && s.last?.check) {
    return `You give the ${gift} to open the king. This line ends in check, not mate: the attack that remains is the win.`;
  }
  if (s.sacrifice && prizeFits) {
    return `The sacrifice of the ${gift} is to win ${s.loot}. You do not need mate — getting ahead is the goal.`;
  }
  if (s.sacrifice) {
    return why
      ? `${why} The line does not end in mate; the point is the attack you have left.`
      : 'The sacrifice is not for mate. It leaves you with an attack or a better position they cannot hold.';
  }

  if (s.last?.check && prizeFits) {
    return `The last move is a check, not mate. That check is the point of the line: you win ${s.loot}.`;
  }
  if (s.last?.check && lastTakes && VALUE[s.last.captured] >= 3) {
    return `The last check wins the ${lastTakes}. You do not need mate.`;
  }
  if (s.last?.check) {
    return why
      ? `${why} The line stops at check, not mate — from here the attack wins.`
      : 'The line stops at check, not mate. The king is in trouble, and that is enough.';
  }
  if (lastTakes && VALUE[s.last.captured] >= 3) {
    return why ? `${why} You win the ${lastTakes}.` : `The goal is to win the ${lastTakes}, not to mate.`;
  }
  if (s.loot) {
    return why ? `${why} You win ${s.loot}.` : `The goal is to win ${s.loot}, not to mate.`;
  }
  if (quietLast) {
    return 'The last move is a quiet threat they cannot stop. The win is the position you leave — not mate.';
  }
  if (why) return `${why} The line does not have to end in mate.`;
  return 'The winning idea may be a threat they cannot stop — not every exercise is mate.';
}

export function goalAside(puzzle) {
  if (puzzle.goal === 'mate') return `Exercise ${puzzle.n}`;
  return `Exercise ${puzzle.n} · The win may be material, not mate`;
}
