import Icon from '../../../components/icons/Icon.jsx';

/*
 * Opt-in review of the opponent's moves. It is only computed when asked for, then the
 * toggle shows or hides their comments in the move-by-move review.
 */
export default function OpponentReview({ review, shown, progress, onToggle }) {
  const done = review.opponent;
  if (progress) {
    return (
      <div className="opponent-review">
        <div className="row"><span className="spinner" /> <b className="small">Reviewing your opponent's moves…</b></div>
        <div className="progress-track"><span style={{ width: `${progress.total ? (progress.done / progress.total) * 100 : 0}%` }} /></div>
      </div>
    );
  }
  return (
    <div className="opponent-review">
      <div className="opponent-review-row">
        <button className="btn small icon-text" onClick={onToggle} aria-pressed={Boolean(shown && done)}>
          <Icon name={shown && done ? 'eye' : 'friends'} size={16} />
          {!done ? "Review my opponent's moves too" : shown ? "Hide my opponent's moves" : "Show my opponent's moves"}
        </button>
        {done && <span className="muted small">Opponent accuracy: <b>{done.summary.accuracy ?? '–'}%</b></span>}
      </div>
      {!done && <span className="muted small">Optional. It takes about as long as your own review.</span>}
    </div>
  );
}
