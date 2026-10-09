import { Position } from '../client/src/engine/core/position.js';

const buf = Array.from({ length: 64 }, () => new Int32Array(256));

function perft(pos, depth, ply = 0) {
  if (depth === 0) return 1;
  const moves = buf[ply];
  const n = pos.generate(moves);
  let nodes = 0;
  for (let i = 0; i < n; i++) {
    if (!pos.make(moves[i])) continue;
    nodes += perft(pos, depth - 1, ply + 1);
    pos.unmake();
  }
  return nodes;
}

const cases = [
  ['rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1', 4, 197281],
  ['r3k2r/p1ppqpb1/bn2pnp1/3PN3/1p2P3/2N2Q1p/PPPBBPPP/R3K2R w KQkq - 0 1', 3, 97862],
  ['8/2p5/3p4/KP5r/1R3p1k/8/4P1P1/8 w - - 0 1', 5, 674624],
  ['r3k2r/Pppp1ppp/1b3nbN/nP6/BBP1P3/q4N2/Pp1P2PP/R2Q1RK1 w kq - 0 1', 4, 422333],
  ['rnbq1k1r/pp1Pbppp/2p5/8/2B5/8/PPP1NnPP/RNBQK2R w KQ - 1 8', 3, 62379],
];

let ok = true;
for (const [fen, depth, expected] of cases) {
  const pos = new Position(fen);
  const before = pos.fen();
  const t = performance.now();
  const got = perft(pos, depth);
  const ms = Math.round(performance.now() - t);
  const pass = got === expected && pos.fen() === before;
  ok &&= pass;
  console.log(`${pass ? 'PASS' : 'FAIL'} depth ${depth}: ${got} (expected ${expected}) ${ms}ms`);
}
process.exit(ok ? 0 : 1);
