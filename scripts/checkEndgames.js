import { Chess } from 'chess.js';
import { LESSONS } from '../client/src/training/lessons/index.js';
import { bestMoves, pieceCount } from './lib/tablebase.js';

/*
 * Checks endgame lesson moves against the Lichess tablebase (needs internet).
 *   node scripts/checkEndgames.js            check every move step with 7 pieces or fewer
 *   node scripts/checkEndgames.js "<fen>" [uci...]   list the best moves (after playing the given moves)
 */
const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });

if (process.argv[2]) {
  const start = new Chess(process.argv[2]);
  for (const uci of process.argv.slice(3)) start.move(toMove(uci));
  const { result, moves, all } = await bestMoves(start.fen());
  console.log(start.fen());
  console.log(`${result}: best ${moves.join(' ')}`);
  console.log(all.map((m) => `${m.uci}:${m.category}${m.dtm != null ? `(dtm ${m.dtm})` : ''}`).join('  '));
  process.exit(0);
}

let errors = 0;
let checked = 0;
for (const lesson of LESSONS) {
  const steps = [...lesson.steps.map((s, i) => [s, i]), ...lesson.bonus.map((s, i) => [s, `bonus ${i}`])];
  for (const [step, i] of steps) {
    if (step.type !== 'move' || pieceCount(step.fen) > 7) continue;
    checked++;
    const game = new Chess(step.fen);
    const noted = new Set();
    for (let k = 0; k < step.line.length; k++) {
      const fen = game.fen();
      if (k % 2 === 0) {
        const { result, moves } = await bestMoves(fen);
        const accepted = step.accept?.[k] || [step.line[k]];
        const bad = accepted.filter((u) => !moves.includes(u));
        const extra = moves.filter((u) => !accepted.includes(u));
        const mark = bad.length ? '✗' : '✓';
        if (bad.length) errors++;
        console.log(`${mark} [${lesson.id} #${i}] ply ${k} ${result}: accepted ${accepted.join(',')}${bad.length ? ` — NOT best: ${bad.join(',')}` : ''}${extra.length ? ` (also best: ${extra.join(',')})` : ''}`);
        for (const uci of Object.keys(step.wrong || {})) {
          if (noted.has(uci) || !game.moves({ verbose: true }).some((m) => m.lan === uci)) continue;
          noted.add(uci);
          if (moves.includes(uci)) console.log(`  ! [${lesson.id} #${i}] wrong-move note ${uci} keeps the same result (fine if it's a style point)`);
        }
      }
      game.move(toMove(step.line[k]));
    }
  }
}
console.log(errors ? `\n${errors} problem(s) in ${checked} endgame steps` : `\nAll ${checked} endgame steps match the tablebase`);
process.exit(errors ? 1 : 0);
