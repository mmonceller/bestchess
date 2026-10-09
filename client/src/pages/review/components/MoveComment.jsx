import Icon from '../../../components/icons/Icon.jsx';
import LessonReminder from '../../../components/game/LessonReminder.jsx';
import Move from '../../../components/notation/Move.jsx';
import MoveLine from '../../../components/notation/MoveLine.jsx';
import MoveText from '../../../components/notation/MoveText.jsx';
import { KINDS } from '../../../review/classify.js';

/*
 * Coach commentary for one of the player's moves, with the better move and the punishing reply.
 * `move` is the verbose chess.js move (with `before` / `after` positions) for richer move descriptions.
 */
export default function MoveComment({ item, move, moveNumber, showBetter, onToggleBetter, lesson }) {
  const k = KINDS[item.kind];
  const fine = item.kind === 'excellent' || item.kind === 'good';
  const showLabel = fine ? 'Show the engine\'s top choice' : 'Show the better move on the board';
  const ctx = move ? { color: move.color, from: move.from, captured: move.captured } : undefined;
  return (
    <div className={`card move-comment tone-${k.tone} fade-in`} key={item.ply}>
      <div className="move-comment-head">
        <span className={`kind-badge tone-${k.tone}`}><Icon name={k.icon} size={18} /></span>
        <div>
          <b><Move san={item.san} prefix={moveNumber.trim()} ctx={ctx} /></b>
          <div className={`kind-label tone-${k.tone}`}>{k.label}</div>
        </div>
      </div>
      <p className="move-comment-text"><MoveText text={item.text} /></p>
      {item.idea && <p className="small muted"><b>Your idea:</b> <MoveText text={item.idea} /></p>}
      {item.punish && (
        <div className="comment-note punish">
          <Icon name="warning" size={16} />
          <span>
            Now your opponent can play <b>{move ? <MoveLine fen={move.after} moves={[item.punish.san]} numbered={false} /> : <Move san={item.punish.san} />}</b>.{' '}
            <MoveText text={item.punish.why} />
          </span>
        </div>
      )}
      {item.better && (
        <div className="comment-note better">
          <Icon name="sparkle" size={16} />
          <span>
            Better was <b>{move ? <MoveLine fen={move.before} moves={[item.better.san]} numbered={false} /> : <Move san={item.better.san} />}</b>.{' '}
            <MoveText text={item.better.why} />
            {item.bestLine?.length > 1 && (
              <span className="muted small"> Line: {move ? <MoveLine fen={move.before} moves={item.bestLine} /> : <MoveText text={item.bestLine.join(' ')} loose />}</span>
            )}
          </span>
        </div>
      )}
      {item.best && (
        <button className="btn small icon-text" onClick={onToggleBetter}>
          <Icon name={showBetter ? 'eye' : 'sparkle'} size={16} /> {showBetter ? 'Back to the game' : showLabel}
        </button>
      )}
      <LessonReminder lesson={lesson} />
    </div>
  );
}
