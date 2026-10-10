import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import Stars from '../components/Stars.jsx';
import { getCoach } from '../../../training/coaches.js';

/* A winding trail of lesson nodes, like a game level map. */
const WIDTH = 320;
const ROW = 128;
const SWAY = [0, 1, 1.6, 1, 0, -1, -1.6, -1];
const xAt = (i) => WIDTH / 2 + SWAY[i % SWAY.length] * 62;
const yAt = (i) => 84 + i * ROW;
/* Room under the last node's centre: half the button, a two-line title and the stars/minutes line. */
const BELOW_LAST = 124;

function trail(count) {
  let d = `M ${xAt(0)} ${yAt(0)}`;
  for (let i = 1; i < count; i++) {
    const midY = (yAt(i - 1) + yAt(i)) / 2;
    d += ` C ${xAt(i - 1)} ${midY}, ${xAt(i)} ${midY}, ${xAt(i)} ${yAt(i)}`;
  }
  return d;
}

export default function LessonPath({ lessons, progress, nextId, color, onOpen }) {
  const height = yAt(lessons.length - 1) + BELOW_LAST;
  const doneCount = lessons.filter((l) => progress[l.id]).length;
  return (
    <div className="lesson-path" style={{ width: WIDTH, height, '--track': color }}>
      <svg className="trail" width={WIDTH} height={height} aria-hidden="true">
        <path d={trail(lessons.length)} className="trail-base" />
        {doneCount > 0 && <path d={trail(Math.min(lessons.length, doneCount + 1))} className="trail-done" />}
      </svg>
      {lessons.map((l, i) => {
        const coach = getCoach(l.coach);
        const p = progress[l.id];
        const state = p ? 'done' : l.id === nextId ? 'next' : 'open';
        return (
          <div key={l.id} className={`path-node ${state}`} style={{ left: xAt(i), top: yAt(i), '--coach': coach.color, '--i': i }}>
            {state === 'next' && <span className="node-tag">Start here</span>}
            <button className="node-btn" onClick={() => onOpen(l)} aria-label={`${l.title} with ${coach.name}`}>
              <CoachAvatar coach={coach} size={56} />
              {p && <span className="node-check"><Icon name="check" size={14} /></span>}
              {p && !p.bonusStars && l.bonus.length > 0 && <span className="node-bonus" title="Bonus round available"><Icon name="gem" size={13} /></span>}
            </button>
            <div className="node-label">
              <b>{l.title}</b>
              {p ? <Stars value={p.stars} /> : <span className="muted small">{l.minutes} min</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
