/*
 * How the game went for the player: one point per reviewed move, above the line when
 * the player was better. Mistakes and blunders are marked; tapping a point jumps to it.
 */
const W = 300;
const H = 72;
const CAP = 800;

const yOf = (cp) => H / 2 - (Math.max(-CAP, Math.min(CAP, cp)) / CAP) * (H / 2 - 6);

export default function EvalChart({ moves, currentPly, onSelect }) {
  if (moves.length < 2) return null;
  const step = W / (moves.length - 1);
  const pts = moves.map((m, i) => [i * step, yOf(m.eval)]);
  const line = pts.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const area = `${line} L${W},${H / 2} L0,${H / 2} Z`;

  return (
    <svg className="eval-chart" viewBox={`-6 0 ${W + 12} ${H}`} role="img" aria-label="How the game went">
      <defs>
        <clipPath id="eval-up"><rect x="-6" y="0" width={W + 12} height={H / 2} /></clipPath>
        <clipPath id="eval-down"><rect x="-6" y={H / 2} width={W + 12} height={H / 2} /></clipPath>
      </defs>
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
  );
}
