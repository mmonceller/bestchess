import Icon from '../../../components/icons/Icon.jsx';
import { PATTERNS } from '../../../training/patterns/patterns.js';
import { unlockedPatterns } from '../../../training/patterns/trainerLogic.js';

/* Entry point to the adaptive pattern trainer. */
export default function PuzzleCard({ trainer }) {
  const unlocked = unlockedPatterns(trainer.rating);
  const total = Object.keys(PATTERNS).length;
  return (
    <a className="puzzle-card card" href="#/puzzles">
      <span className="puzzle-card-icon"><Icon name="puzzle" size={30} /></span>
      <div className="puzzle-card-body">
        <h3>Pattern Trainer</h3>
        <p className="muted small">
          Puzzles picked for your level. Solve them to raise your rating and unlock new tricks.
        </p>
        <div className="pattern-dots" aria-label={`${unlocked.length} of ${total} patterns unlocked`}>
          {Object.entries(PATTERNS).map(([id, pat]) => (
            <span key={id} className={unlocked.includes(id) ? 'on' : ''} style={{ '--c': pat.color }} title={pat.name}>
              <Icon name={unlocked.includes(id) ? pat.icon : 'lock'} size={14} />
            </span>
          ))}
        </div>
      </div>
      <span className="puzzle-card-cta">
        <b>{trainer.rating}</b>
        <span className="muted small">rating</span>
        <Icon name="arrowRight" size={20} />
      </span>
    </a>
  );
}
