import { PHASE_NAMES, PHASE_SHORT } from '../../../chess/phase.js';

/*
 * How the game went for the player: one point per reviewed move, above the line when
 * the player was better. Mistakes and blunders are marked; tapping a point jumps to it.
 * `phases[ply]` (optional) shades the opening, middlegame and endgame.
 */
const W = 300;
const H = 72;
const CAP = 800;

const yOf = (cp) => H / 2 - (Math.max(-CAP, Math.min(CAP, cp)) / CAP) * (H / 2 - 6);

/* Consecutive runs of moves in the same stage, as x ranges on the chart. */
function phaseBands(moves, phases, step) {
  if (!phases) return [];
  const bands = [];
  moves.forEach((m, i) => {
    const phase = phases[m.ply];
    const last = bands[bands.length - 1];
    if (last?.phase === phase) last.end = i;
    else bands.push({ phase, start: i, end: i });
  });
  return bands.map((b, i) => ({
    ...b,
    x0: i === 0 ? 0 : (b.start - 0.5) * step,
    x1: i === bands.length - 1 ? W : (b.end + 0.5) * step,
  }));
}

export default function EvalChart({ moves, currentPly, onSelect, phases }) {
  if (moves.length < 2) return null;
  const step = W / (moves.length - 1);
  const pts = moves.map((m, i) => [i * step, yOf(m.eval)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H / 2} L0,${H / 2} Z`;
  const bands = phaseBands(moves, phases, step);

  return (
    <div className="eval-chart-wrap">
      <svg className="eval-chart" viewBox={`-6 0 ${W + 12} ${H}`} role="img" aria-label="How the game went">
        <defs>
          <clipPath id="eval-up"><rect x="-6" y="0" width={W + 12} height={H / 2} /></clipPath>
          <clipPath id="eval-down"><rect x="-6" y={H / 2} width={W + 12} height={H / 2} /></clipPath>
        </defs>
        {bands.map((b) => <rect key={b.phase} x={b.x0} y="0" width={Math.max(0, b.x1 - b.x0)} height={H} className={`eval-phase phase-${b.phase}`} />)}
        {bands.slice(1).map((b) => <line key={`div-${b.phase}`} x1={b.x0} x2={b.x0} y1="0" y2={H} className="eval-phase-divider" />)}
        <path d={area} className="eval-area up" clipPath="url(#eval-up)" />
        <path d={area} className="eval-area down" clipPath="url(#eval-down)" />
        <line x1="0" x2={W} y1={H / 2} y2={H / 2} className="eval-zero" />
        <path d={line} className="eval-line" />
        {moves.map((m, i) => {
          const [x, y] = pts[i];
          const marked = m.kind === 'mistake' || m.kind === 'blunder' || m.kind === 'inaccuracy';
          const current = m.ply === currentPly;
          if (!marked && !current) return null;
          return <circle key={m.ply} cx={x} cy={y} r={current ? 4.5 : 3.2} className={`eval-dot mark-${m.kind}${current ? ' current' : ''}`} />;
        })}
        {moves.map((m, i) => (
          <rect key={`hit-${m.ply}`} x={i * step - step / 2} y="0" width={Math.max(step, 4)} height={H} fill="transparent" onClick={() => onSelect(m.ply)} style={{ cursor: 'pointer' }} />
        ))}
      </svg>
      {bands.length > 0 && (
        <div className="eval-phases" aria-label="Game stages">
          {bands.map((b) => {
            const share = (b.x1 - b.x0) / W;
            return (
              <button
                key={b.phase}
                type="button"
                className={`eval-phase-label phase-${b.phase}`}
                style={{ flexGrow: share, flexBasis: 0 }}
                title={`${PHASE_NAMES[b.phase]}: moves ${Math.floor(moves[b.start].ply / 2) + 1}–${Math.floor(moves[b.end].ply / 2) + 1}`}
                onClick={() => onSelect(moves[b.start].ply)}
              >
                {share >= 0.26 ? PHASE_NAMES[b.phase] : share >= 0.12 ? PHASE_SHORT[b.phase] : PHASE_NAMES[b.phase][0]}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
