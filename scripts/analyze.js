import { Position } from '../client/src/engine/core/position.js';
import { Searcher } from '../client/src/engine/core/search.js';

/* Usage: node scripts/analyze.js "<fen>" [timeMs] [--multi] */
const [fen, time = '2000', flag] = process.argv.slice(2);
const pos = new Position(fen);
const s = new Searcher();
const res = s.search(pos, { timeMs: +time, multi: flag === '--multi', maxDepth: flag === '--multi' ? 5 : 64 });
console.log({
  best: pos.moveToUci(res.bestMove),
  score: res.score,
  depth: res.depth,
  nodes: res.nodes,
  ms: res.timeMs,
  pv: res.pv.map((m, i) => {
    const u = (() => { const p = new Position(fen); for (let k = 0; k < i; k++) p.make(res.pv[k]); return p.moveToUci(m); })();
    return u;
  }).join(' '),
});
if (flag === '--multi') console.log(res.rootScores.slice(0, 6).map((r) => `${pos.moveToUci(r.move)}:${r.score}`).join('  '));
