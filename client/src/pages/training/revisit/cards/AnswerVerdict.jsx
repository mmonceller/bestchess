import Notice from '../../../../components/game/Notice.jsx';
import MoveText from '../../../../components/notation/MoveText.jsx';

/* One-line verdict on the player's saved answer for a step. */
export default function AnswerVerdict({ known, ok, okText, badText, children }) {
  if (!known) {
    return (
      <Notice tone="ok" icon="info">
        No saved answer for this step — you finished it before answers were recorded. Try it again below.
      </Notice>
    );
  }
  return (
    <Notice tone={ok ? 'good' : 'ok'} icon={ok ? 'checkCircle' : 'retry'}>
      <span className="answer-line"><MoveText text={ok ? okText : badText} /></span>
      {children && <span className="answer-detail">{children}</span>}
    </Notice>
  );
}
