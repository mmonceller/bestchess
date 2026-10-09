import Icon from '../../../components/icons/Icon.jsx';
import LessonReminder from '../../../components/game/LessonReminder.jsx';
import { KINDS } from '../../../review/classify.js';

/* Coach commentary for one of the player's moves, with the better move and the punishing reply. */
export default function MoveComment({ item, moveNumber, showBetter, onToggleBetter, lesson }) {
  const k = KINDS[item.kind];
  const fine = item.kind === 'excellent' || item.kind === 'good';
  const showLabel = fine ? 'Show the engine\'s top choice' : 'Show the better move on the board';
  return (
    <div className={`card move-comment tone-${k.tone} fade-in`} key={item.ply}>
      <div className="move-comment-head">
        <span className={`kind-badge tone-${k.tone}`}><Icon name={k.icon} size={18} /></span>
        <div>
          <b>{moveNumber}{item.san}</b>
          <div className={`kind-label tone-${k.tone}`}>{k.label}</div>
        </div>
      </div>
      <p className="move-comment-text">{item.text}</p>
      {item.idea && <p className="small muted"><b>Your idea:</b> {item.idea}</p>}
      {item.punish && (
        <div className="comment-note punish">
          <Icon name="warning" size={16} />
          <span>Now your opponent can play <b>{item.punish.san}</b>. {item.punish.why}</span>
        </div>
      )}
      {item.better && (
        <div className="comment-note better">
          <Icon name="sparkle" size={16} />
          <span>
            Better was <b>{item.better.san}</b>. {item.better.why}
            {item.bestLine?.length > 1 && <span className="muted small"> Line: {item.bestLine.join(' ')}</span>}
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
