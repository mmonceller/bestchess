import { Chess } from 'chess.js';
import { Position } from '../client/src/engine/core/position.js';
import { Searcher } from '../client/src/engine/core/search.js';
import { loosePieces } from '../client/src/engine/analysis/explain.js';

/* Lesson-design helper: prints engine top moves and loose pieces for candidate positions. */
const fens = process.argv.slice(2);
for (const fen of fens) {
  try { new Chess(fen); } catch (e) { console.log('INVALID', fen, e.message); continue; }
  const pos = new Position(fen);
  const s = new Searcher();
  const res = s.search(pos, { timeMs: 2500, multi: true, maxDepth: 6 });
  const top = res.rootScores.slice(0, 4).map((r) => `${pos.moveToUci(r.move)}:${r.score}`).join('  ');
  const deep = new Searcher().search(new Position(fen), { timeMs: 2500 });
  console.log(fen);
  console.log(`  multi(d${res.depth}) ${top}`);
  console.log(`  deep(d${deep.depth}) ${new Position(fen).moveToUci(deep.bestMove)}:${deep.score}`);
  console.log(`  loose white=${loosePieces(pos, 0)} black=${loosePieces(pos, 8)}`);
}
