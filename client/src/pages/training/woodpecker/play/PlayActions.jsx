import Icon from '../../../../components/icons/Icon.jsx';

/* Hint / take-back / solution / next, depending on where the exercise stands. */
export default function PlayActions({ done, busy, hinted, retry, onHint, onGiveUp, onTryAgain, onNext, extra = null }) {
  if (done) {
    return (
      <div className="wp-done-actions">
        {extra}
        <button className="btn primary block icon-text" onClick={onNext} autoFocus>
          Next exercise <Icon name="arrowRight" size={18} />
        </button>
      </div>
    );
  }
  if (retry) {
    return (
      <>
        <button className="btn primary icon-text" onClick={onTryAgain}>
          <Icon name="undo" size={18} /> Try again
        </button>
        <button className="btn icon-text" onClick={onGiveUp}>
          <Icon name="eye" size={18} /> Show solution
        </button>
      </>
    );
  }
  return (
    <>
      <button
        className="btn icon-text"
        onClick={onHint}
        disabled={hinted || busy}
        title="Using the hint counts this exercise as a miss"
      >
        <Icon name="hint" size={18} /> Hint
      </button>
      <button className="btn icon-text" onClick={onGiveUp} disabled={busy}>
        <Icon name="eye" size={18} /> Show solution
      </button>
    </>
  );
}
