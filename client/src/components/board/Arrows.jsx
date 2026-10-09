import { FILES } from './pieces.js';

function center(sq, flipped) {
  let f = FILES.indexOf(sq[0]);
  let r = 8 - Number(sq[1]);
  if (flipped) { f = 7 - f; r = 7 - r; }
  return [f * 12.5 + 6.25, r * 12.5 + 6.25];
}

const COLORS = { green: '#3ccf7a', blue: '#4f9dff', red: '#ff5d6c', orange: '#ffb547' };

export default function Arrows({ arrows, flipped }) {
  if (!arrows?.length) return null;
  return (
    <svg className="board-arrows" viewBox="0 0 100 100" aria-hidden="true">
      <defs>
        {Object.entries(COLORS).map(([name, c]) => (
          <marker key={name} id={`ah-${name}`} markerWidth="4" markerHeight="4" refX="2.2" refY="2" orient="auto">
            <path d="M0,0 L4,2 L0,4 z" fill={c} />
          </marker>
        ))}
      </defs>
      {arrows.map((a, i) => {
        const [x1, y1] = center(a.from, flipped);
        const [x2, y2] = center(a.to, flipped);
        const len = Math.hypot(x2 - x1, y2 - y1);
        const shorten = 4.2;
        const ex = x2 - ((x2 - x1) / len) * shorten;
        const ey = y2 - ((y2 - y1) / len) * shorten;
        const color = a.color || 'green';
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={ex}
            y2={ey}
            stroke={COLORS[color] || color}
            strokeWidth="2.2"
            strokeLinecap="round"
            opacity="0.85"
            markerEnd={`url(#ah-${COLORS[color] ? color : 'green'})`}
          />
        );
      })}
    </svg>
  );
}
