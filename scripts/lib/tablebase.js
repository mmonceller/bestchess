/* Thin client for the public Lichess Syzygy tablebase (positions with up to 7 pieces). */
const API = 'https://tablebase.lichess.ovh/standard';
const cache = new Map();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export const pieceCount = (fen) => fen.split(' ')[0].replace(/[^a-z]/gi, '').length;

export async function probe(fen) {
  if (cache.has(fen)) return cache.get(fen);
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`${API}?fen=${encodeURIComponent(fen)}`).catch(() => null);
    if (!res || res.status === 429) { await sleep(2000 * (attempt + 1)); continue; }
    if (!res.ok) throw new Error(`tablebase ${res.status} for ${fen}`);
    const data = await res.json();
    cache.set(fen, data);
    await sleep(250);
    return data;
  }
  throw new Error(`tablebase rate limit for ${fen}`);
}

/* Result for the side making the move, from a move entry (whose category is the opponent's view). */
const FLIP = { win: 'loss', loss: 'win', draw: 'draw', 'cursed-win': 'blessed-loss', 'blessed-loss': 'cursed-win', unknown: 'unknown' };
export const moverResult = (move) => FLIP[move.category] || move.category;

/* Every move that keeps the best achievable result, plus that result. */
export async function bestMoves(fen) {
  const data = await probe(fen);
  const best = data.category;
  return { result: best, moves: data.moves.filter((m) => moverResult(m) === best).map((m) => m.uci), all: data.moves };
}
