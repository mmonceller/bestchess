import Icon from '../../../components/icons/Icon.jsx';
import { KINDS, KIND_ORDER } from '../../../review/classify.js';
import EvalChart from './EvalChart.jsx';
import OpponentReview from './OpponentReview.jsx';

function verdict(acc) {
  if (acc == null) return '';
  if (acc >= 90) return 'Outstanding! You played like a strong club player.';
  if (acc >= 80) return 'Great game. Only a few small slips.';
  if (acc >= 65) return 'Solid effort. A couple of moments to learn from.';
  if (acc >= 50) return 'Some good ideas, and some big chances to improve.';
  return 'A tough game. Each mistake below is a lesson for next time.';
}

/*
 * Accuracy, a count of each kind of move, and the game's ups and downs, plus the optional
 * review of the opponent's moves (`opponent` = { shown, progress, onToggle }).
 */
export default function ReviewSummary({ review, currentPly, onSelect, onNextMistake, phases, opponent }) {
  const { accuracy, counts } = review.summary;
  const mistakes = (counts.inaccuracy || 0) + (counts.mistake || 0) + (counts.blunder || 0);
  return (
    <div className="card review-summary">
      <div className="review-score">
        <div className="accuracy-ring" style={{ '--acc': accuracy ?? 0 }}>
          <b>{accuracy ?? '–'}</b><span>accuracy</span>
        </div>
        <p className="review-verdict">{verdict(accuracy)}</p>
      </div>
      <div className="kind-counts">
        {KIND_ORDER.filter((k) => counts[k]).map((k) => (
          <span key={k} className={`kind-chip tone-${KINDS[k].tone}`}>
            <Icon name={KINDS[k].icon} size={15} /> {counts[k]} {KINDS[k].short}
          </span>
        ))}
      </div>
      <EvalChart moves={review.moves} currentPly={currentPly} onSelect={onSelect} phases={phases} />
      <div className="muted small eval-legend">Above the line: you were better. Below: your opponent was.</div>
      {mistakes > 0 && (
        <button className="btn block icon-text" onClick={onNextMistake}>
          <Icon name="target" size={18} /> Go to my next slip
        </button>
      )}
      {opponent && <OpponentReview review={review} {...opponent} />}
    </div>
  );
}
