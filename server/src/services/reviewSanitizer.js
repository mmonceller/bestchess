/* Validates a client-computed game review before it is stored on a game record. */
const KINDS = new Set(['best', 'excellent', 'good', 'forced', 'inaccuracy', 'mistake', 'blunder']);
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;
const SAN = /^[KQRBNa-hxO0-9=+#-]{2,10}$/;
const TAG = /^[a-zA-Z]{1,20}$/;
const MAX_MOVES = 300;

const text = (v, max = 300) => String(v ?? '').slice(0, max);
const num = (v, min, max) => Math.max(min, Math.min(max, Math.round(Number(v) || 0)));
const uci = (v) => (UCI.test(v) ? v : null);
const san = (v) => (SAN.test(v) ? v : null);

function note(v) {
  if (!v || !san(v.san)) return null;
  return { san: v.san, why: text(v.why, 200) };
}

const DANGER = new Set(['mated', 'threat', 'losing']);
function danger(v) {
  if (!v || !DANGER.has(v.level)) return null;
  return { level: v.level, text: text(v.text, 240) };
}

function move(m) {
  if (!m || !KINDS.has(m.kind) || !uci(m.uci) || !san(m.san)) return null;
  return {
    ply: num(m.ply, 0, 1000),
    color: num(m.ply, 0, 1000) % 2 ? 'b' : 'w',
    san: m.san,
    uci: m.uci,
    kind: m.kind,
    accuracy: num(m.accuracy, 0, 100),
    eval: num(m.eval, -5000, 5000),
    best: uci(m.best),
    bestLine: (Array.isArray(m.bestLine) ? m.bestLine : []).map(san).filter(Boolean).slice(0, 6),
    reply: uci(m.reply),
    text: text(m.text),
    idea: text(m.idea, 200),
    better: note(m.better),
    punish: note(m.punish),
    tags: (Array.isArray(m.tags) ? m.tags : []).filter((t) => TAG.test(t)).slice(0, 6),
    piece: ['pawn', 'knight', 'bishop', 'rook', 'queen', 'king'].includes(m.piece) ? m.piece : null,
    danger: danger(m.danger),
  };
}

/* One side's reviewed moves with their summary recomputed from scratch. */
function side(list) {
  const moves = list.slice(0, MAX_MOVES).map(move).filter(Boolean);
  const counts = {};
  for (const k of KINDS) counts[k] = moves.filter((m) => m.kind === k).length;
  const accuracy = moves.length ? Math.round(moves.reduce((s, m) => s + m.accuracy, 0) / moves.length) : null;
  return { summary: { accuracy, counts, moves: moves.length }, moves };
}

/* `opponent` is the optional review of the other side's moves, made only when the player asks. */
export function sanitizeReview(r) {
  if (!r || !Array.isArray(r.moves)) return null;
  return {
    version: num(r.version, 1, 100),
    color: r.color === 'b' ? 'b' : 'w',
    createdAt: Date.now(),
    ...side(r.moves),
    opponent: Array.isArray(r.opponent?.moves) ? side(r.opponent.moves) : null,
  };
}
