import { useEffect, useMemo, useRef } from 'react';
import Move from '../notation/Move.jsx';
import NotationGuideButton from '../notation/NotationGuideButton.jsx';
import { describeMove } from '../../chess/notation/describe.js';
import { replayLine, START_FEN } from '../../chess/notation/line.js';
import { scrollWithin } from '../../utils/scrollWithin.js';

/*
 * SAN move list in numbered pairs. When there's room, pairs fill down the left column
 * then the right (1 over 2 over 3, then 4 over 5 over 6), not left-to-right.
 * `current` highlights a ply (0-based); onSelect makes it clickable.
 * `marks` optionally maps a ply to a notation mark (!, !!, !?, ?!, ?, ??), drawn in the guide colours.
 */
const ANNOTATION = /^[!?]{1,2}$/;

export default function MoveList({ moves, current = moves.length - 1, onSelect, marks, startFen = START_FEN }) {
  const ref = useRef(null);
  const line = useMemo(() => replayLine(startFen, moves), [startFen, moves]);
  useEffect(() => {
    scrollWithin(ref.current, ref.current?.querySelector('.mv.current'));
  }, [current, moves.length]);

  if (!moves.length) return <div className="move-list empty muted">No moves yet.</div>;

  const pairs = Math.ceil(moves.length / 2);
  const colRows = Math.ceil(pairs / 2);
  const rows = [];
  for (let i = 0, p = 0; i < moves.length; i += 2, p++) {
    rows.push(
      <div className={`mv-row${p % colRows % 2 === 1 ? ' alt' : ''}`} key={i}>
        <span className="mv-num">{i / 2 + 1}.</span>
        {[i, i + 1].map((ply) => {
          const m = line[ply];
          if (!m) return <span key={ply} />;
          const mark = ANNOTATION.test(marks?.[ply] || '') ? marks[ply] : '';
          const san = mark ? `${m.san}${mark}` : m.san;
          const tip = describeMove(san, m.ctx) || san;
          const props = {
            className: `mv${ply === current ? ' current' : ''}`,
            'data-move-tip': tip,
            'aria-label': tip,
          };
          const body = <Move san={san} tip={tip} />;
          return onSelect
            ? <button key={ply} type="button" {...props} onClick={() => onSelect(ply)}>{body}</button>
            : <span key={ply} tabIndex={0} {...props}>{body}</span>;
        })}
      </div>,
    );
  }
  return (
    <div className="move-list-wrap">
      <div
        className={`move-list${pairs > 1 ? ' two-col' : ''}`}
        style={pairs > 1 ? { '--move-rows': colRows } : undefined}
        ref={ref}
      >
        {rows}
      </div>
      <NotationGuideButton className="move-list-guide" />
    </div>
  );
}
