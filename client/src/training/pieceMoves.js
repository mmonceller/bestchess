/*
 * Simplified movement rules for teaching: where a single piece can go, ignoring
 * check. Used to show reachable squares and to run the "collect the stars" games.
 */
const FILES = 'abcdefgh';
const toXY = (sq) => [FILES.indexOf(sq[0]), Number(sq[1]) - 1];
const toSq = (x, y) => (x >= 0 && x < 8 && y >= 0 && y < 8 ? FILES[x] + (y + 1) : null);

const ROOK_DIRS = [[1, 0], [-1, 0], [0, 1], [0, -1]];
const BISHOP_DIRS = [[1, 1], [1, -1], [-1, 1], [-1, -1]];
const KNIGHT_JUMPS = [[1, 2], [2, 1], [2, -1], [1, -2], [-1, -2], [-2, -1], [-2, 1], [-1, 2]];

/*
 * Returns [{ to, capture }] for a piece of `type` and `color` on `from`.
 * `friends` and `enemies` are Sets of occupied squares.
 */
export function pieceTargets(type, from, { color = 'w', friends = new Set(), enemies = new Set() } = {}) {
  const [x, y] = toXY(from);
  const out = [];
  const add = (sq) => {
    if (!sq || friends.has(sq)) return false;
    out.push({ to: sq, capture: enemies.has(sq) });
    return !enemies.has(sq);
  };
  const slide = (dirs) => {
    for (const [dx, dy] of dirs) {
      for (let i = 1; i < 8; i++) if (!add(toSq(x + dx * i, y + dy * i))) break;
    }
  };

  switch (type) {
    case 'r': slide(ROOK_DIRS); break;
    case 'b': slide(BISHOP_DIRS); break;
    case 'q': slide([...ROOK_DIRS, ...BISHOP_DIRS]); break;
    case 'n': for (const [dx, dy] of KNIGHT_JUMPS) add(toSq(x + dx, y + dy)); break;
    case 'k': for (const [dx, dy] of [...ROOK_DIRS, ...BISHOP_DIRS]) add(toSq(x + dx, y + dy)); break;
    case 'p': {
      const dir = color === 'w' ? 1 : -1;
      const empty = (sq) => sq && !friends.has(sq) && !enemies.has(sq);
      const one = toSq(x, y + dir);
      if (empty(one)) {
        out.push({ to: one, capture: false });
        const two = toSq(x, y + 2 * dir);
        if ((color === 'w' ? y === 1 : y === 6) && empty(two)) out.push({ to: two, capture: false });
      }
      for (const dx of [-1, 1]) {
        const sq = toSq(x + dx, y + dir);
        if (sq && enemies.has(sq)) out.push({ to: sq, capture: true });
      }
      break;
    }
    default: break;
  }
  return out;
}

/* Reachable squares for the piece standing on `square` in a FEN placement. */
export function reachInPosition(pieces, square) {
  const piece = pieces[square];
  if (!piece) return [];
  const friends = new Set();
  const enemies = new Set();
  for (const [sq, p] of Object.entries(pieces)) {
    if (sq === square) continue;
    (p.color === piece.color ? friends : enemies).add(sq);
  }
  return pieceTargets(piece.type, square, { color: piece.color, friends, enemies });
}

/* Builds a FEN placement string from { e4: 'P', d5: 'p', ... }. */
export function placementFen(map) {
  const rows = [];
  for (let r = 7; r >= 0; r--) {
    let row = '';
    let empty = 0;
    for (let f = 0; f < 8; f++) {
      const ch = map[FILES[f] + (r + 1)];
      if (ch) { if (empty) row += empty; empty = 0; row += ch; } else empty++;
    }
    if (empty) row += empty;
    rows.push(row);
  }
  return `${rows.join('/')} w - - 0 1`;
}

/* Fewest moves to collect every star in any order (breadth-first over position + collected set). */
export function minMovesToCollect({ piece, start, stars, enemies = {}, blockers = [] }) {
  const targets = [...stars, ...Object.keys(enemies)];
  const full = (1 << targets.length) - 1;
  const key = (sq, type, mask) => `${sq}|${type}|${mask}`;
  let frontier = [{ sq: start, type: piece, mask: 0 }];
  const seen = new Set([key(start, piece, 0)]);
  for (let depth = 0; depth < 40 && frontier.length; depth++) {
    const next = [];
    for (const node of frontier) {
      if (node.mask === full) return depth;
      const remainingEnemies = new Set(targets.map((t, i) => (enemies[t] && !(node.mask & (1 << i)) ? t : null)).filter(Boolean));
      for (const { to } of pieceTargets(node.type, node.sq, { friends: new Set(blockers), enemies: remainingEnemies })) {
        const idx = targets.indexOf(to);
        const mask = idx >= 0 ? node.mask | (1 << idx) : node.mask;
        const type = node.type === 'p' && to[1] === '8' ? 'q' : node.type;
        const k = key(to, type, mask);
        if (!seen.has(k)) { seen.add(k); next.push({ sq: to, type, mask }); }
      }
    }
    frontier = next;
  }
  return frontier.some((n) => n.mask === full) ? 40 : Infinity;
}
