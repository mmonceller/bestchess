import Icon from '../icons/Icon.jsx';
import LessonReminder from './LessonReminder.jsx';
import MoveLine from '../notation/MoveLine.jsx';
import MoveText from '../notation/MoveText.jsx';
import NotationGuideButton from '../notation/NotationGuideButton.jsx';

/*
 * AI assistant card: best move, one or two short reasons, and the expected follow-up.
 * `lesson` (optional) is a reminder from a lesson the player completed.
 */
export default function HintCard({ hint, loading, onClose, title = 'AI Coach', lesson, reviewLink = true }) {
  if (!hint && !loading) return null;
  return (
    <div className="hint-card fade-in">
      <div className="hint-head">
        <span className="hint-avatar"><Icon name="bot" size={18} /></span>
        <b>{title}</b>
        <span className="spacer" />
        {onClose && <button className="btn ghost small" onClick={onClose} aria-label="Close hint"><Icon name="close" size={16} /></button>}
      </div>
      {loading ? (
        <div className="row muted"><span className="spinner" /> Thinking…</div>
      ) : (
        <>
          {hint.san && <div className="hint-move">Try <b><MoveLine fen={hint.fen} moves={[hint.san]} numbered={false} /></b></div>}
          <ul className="hint-reasons">
            {hint.reasons?.map((r, i) => <li key={i}><MoveText text={r} /></li>)}
          </ul>
          {hint.line?.length > 1 && <div className="hint-line muted">Likely line: <MoveLine fen={hint.fen} moves={hint.line} /></div>}
          {hint.assessment && <div className="hint-assess"><MoveText text={hint.assessment} /></div>}
          <NotationGuideButton />
          
          <LessonReminder lesson={lesson} reviewLink={reviewLink} />
        </>
      )}
    </div>
  );
}
