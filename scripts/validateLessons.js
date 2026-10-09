import { Chess } from 'chess.js';
import { LESSONS, TRACKS } from '../client/src/training/lessons/index.js';
import { COACHES } from '../client/src/training/coaches.js';
import { gradeMove } from '../client/src/engine/analysis/api.js';
import { Position } from '../client/src/engine/core/position.js';
import { minMovesToCollect } from '../client/src/training/pieceMoves.js';
import { TAG_LESSONS, PIECE_LESSONS } from '../client/src/training/hints/lessonLinks.js';
import { BONUS } from '../client/src/training/lessons/bonus/index.js';

/*
 * Verifies every lesson: legal positions, legal lines, engine-approved student moves
 * (unless the step is a `teach` step about rules, or a `tablebase` step verified by
 * scripts/checkEndgames.js), and optimal par for star hunts.
 */
const SQUARE = /^[a-h][1-8]$/;
const PLACEMENT = /^([pnbrqkPNBRQK1-8]{1,8}\/){7}[pnbrqkPNBRQK1-8]{1,8} [wb] /;
const MAX_STUDENT_LOSS = 40;
const ENGINE_STEPS = new Set(['find', 'move', 'best', 'drill']);
const trackIds = new Set(TRACKS.map((t) => t.id));
const coachIds = new Set(Object.keys(COACHES));
let errors = 0;
const fail = (lesson, i, msg) => { errors++; console.log(`  ✗ [${lesson.id} #${i}] ${msg}`); };

const toMove = (uci) => ({ from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] });
const squaresOk = (lesson, i, list, what) => {
  for (const sq of list || []) if (!SQUARE.test(sq)) fail(lesson, i, `bad ${what} square ${sq}`);
};
const pieceAt = (fen, sq) => {
  const rows = fen.split(' ')[0].split('/');
  const row = rows[8 - Number(sq[1])];
  let col = 0;
  for (const ch of row) {
    if (/\d/.test(ch)) col += Number(ch);
    else { if ('abcdefgh'[col] === sq[0]) return ch; col++; }
  }
  return null;
};

const ids = new Set();
for (const lesson of LESSONS) {
  console.log(`${lesson.id} (${lesson.steps.length} steps)`);
  if (ids.has(lesson.id)) fail(lesson, '-', 'duplicate lesson id');
  ids.add(lesson.id);
  if (!trackIds.has(lesson.track)) fail(lesson, '-', `unknown track ${lesson.track}`);
  if (!coachIds.has(lesson.coach)) fail(lesson, '-', `unknown coach ${lesson.coach}`);

  if (!lesson.bonus.length) console.log(`  (no bonus round for ${lesson.id})`);
  const allSteps = [
    ...lesson.steps.map((step, i) => [step, i]),
    ...lesson.bonus.map((step, i) => [step, `bonus ${i}`]),
  ];
  allSteps.forEach(([step, i]) => {
    let game = null;
    if (step.fen) {
      if (!PLACEMENT.test(step.fen)) { fail(lesson, i, `bad fen ${step.fen}`); return; }
      if (ENGINE_STEPS.has(step.type) || /k/.test(step.fen.split(' ')[0])) {
        try { game = new Chess(step.fen); } catch (e) { fail(lesson, i, `bad fen: ${e.message}`); return; }
      }
    }
    for (const [a, b] of step.arrows || []) if (!SQUARE.test(a) || !SQUARE.test(b)) fail(lesson, i, 'bad arrow');
    squaresOk(lesson, i, step.highlights, 'highlight');

    switch (step.type) {
      case 'talk': {
        for (const sq of [].concat(step.showMoves || [])) {
          if (!step.fen || !pieceAt(step.fen, sq)) fail(lesson, i, `showMoves square ${sq} is empty`);
        }
        break;
      }
      case 'quiz': {
        const correct = step.options.filter((o) => o.correct).length;
        if (correct !== 1) fail(lesson, i, `quiz needs exactly 1 correct option, has ${correct}`);
        for (const o of step.options) if (!o.why) fail(lesson, i, `option "${o.text}" has no explanation`);
        break;
      }
      case 'find': {
        for (const sq of step.targets) if (!game.get(sq)) fail(lesson, i, `find target ${sq} is empty`);
        break;
      }
      case 'move': {
        const line = step.line;
        const studentFens = [];
        for (let k = 0; k < line.length; k++) {
          const fen = game.fen();
          if (k % 2 === 0) {
            studentFens.push(fen);
            const options = step.accept?.[k] || [line[k]];
            if (!options.includes(line[k])) fail(lesson, i, `line move ${line[k]} not in accept list`);
            for (const uci of options) {
              const g = gradeMove(fen, uci, { timeMs: 1500 });
              if (!g.legal) { fail(lesson, i, `illegal student move ${uci}`); continue; }
              const ok = g.loss <= MAX_STUDENT_LOSS;
              const excused = step.teach || step.tablebase;
              const mark = ok ? '✓' : excused ? '~' : '✗';
              console.log(`    ${mark} #${i} ply ${k} ${uci} loss=${g.loss} (engine best ${g.best})${!ok && step.tablebase ? ' — tablebase-checked' : ''}`);
              if (!ok && !excused) errors++;
            }
          }
          try { game.move(toMove(line[k])); } catch { fail(lesson, i, `illegal line move ${line[k]}`); break; }
        }
        for (const uci of Object.keys(step.wrong || {})) {
          if (!studentFens.some((f) => new Position(f).uciToMove(uci))) fail(lesson, i, `wrong-move ${uci} is illegal`);
        }
        break;
      }
      case 'best': {
        const legal = game.moves({ verbose: true }).map((m) => m.from + m.to + (m.promotion || ''));
        const g = gradeMove(step.fen, legal[0], { timeMs: 2500 });
        console.log(`    best-step #${i}: engine best ${g.best} score ${g.bestScore}, maxLoss ${step.maxLoss}`);
        break;
      }
      case 'drill': {
        if (!['mate', 'promote', 'hold'].includes(step.goal)) fail(lesson, i, `bad goal ${step.goal}`);
        if (!step.moves) fail(lesson, i, 'drill needs a move limit');
        break;
      }
      case 'collect': {
        if (!'rbqknp'.includes(step.piece)) fail(lesson, i, `bad piece ${step.piece}`);
        squaresOk(lesson, i, [step.start, ...step.stars, ...(step.blockers || []), ...Object.keys(step.enemies || {})], 'collect');
        const best = minMovesToCollect(step);
        const mark = best === step.par ? '✓' : '✗';
        console.log(`    ${mark} #${i} star hunt par ${step.par}, optimal ${best}`);
        if (best !== step.par) errors++;
        break;
      }
      case 'squares': {
        if (!step.squares?.length) fail(lesson, i, 'squares step has no squares');
        squaresOk(lesson, i, step.squares, 'squares');
        break;
      }
      case 'recap': {
        if (!step.items?.length) fail(lesson, i, 'recap has no items');
        for (const it of step.items) if (!step.numbered && !it.icon && !it.label) fail(lesson, i, `recap item "${it.title}" needs an icon or label`);
        break;
      }
      default: fail(lesson, i, `unknown step type ${step.type}`);
    }
  });
}

const lessonIds = new Set(LESSONS.map((l) => l.id));
for (const id of Object.keys(BONUS)) {
  if (!lessonIds.has(id)) { errors++; console.log(`  ✗ bonus round for unknown lesson ${id}`); }
}
for (const [tag, links] of [...Object.entries(TAG_LESSONS), ...Object.entries(PIECE_LESSONS).map(([k, l]) => [k, [l]])]) {
  for (const l of links) {
    if (!lessonIds.has(l.lesson)) { errors++; console.log(`  ✗ hint link "${tag}" points to unknown lesson ${l.lesson}`); }
  }
}

console.log(errors ? `\n${errors} problem(s) found` : `\nAll ${LESSONS.length} lessons and hint links valid`);
process.exit(errors ? 1 : 0);
