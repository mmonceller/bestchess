import { useEffect, useMemo, useRef } from 'react';
import Move from '../notation/Move.jsx';
import NotationGuideButton from '../notation/NotationGuideButton.jsx';
import { describeMove } from '../../chess/notation/describe.js';
import { replayLine, START_FEN } from '../../chess/notation/line.js';

/*
 * SAN move list in numbered pairs, colour-coded with a plain-English tooltip per move.
 * `current` highlights a ply (0-based); onSelect makes it clickable.
 * `marks` optionally maps a ply to a review grade, shown as a coloured dot.
 */
export default function MoveList({ moves, current = moves.length - 1, onSelect, marks, startFen = START_FEN }) {
  const ref = useRef(null);
  const line = useMemo(() => replayLine(startFen, moves), [startFen, moves]);
  useEffect(() => {
    const el = ref.current?.querySelector('.mv.current');
    if (el) el.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }, [current, moves.length]);

  if (!moves.length) return <div className="move-list empty muted">No moves yet.</div>;

  const rows = [];
  for (let i = 0; i < moves.length; i += 2) {
    rows.push(
      <div className="mv-row" key={i}>
        <span className="mv-num">{i / 2 + 1}.</span>
        {[i, i + 1].map((ply) => {
          const m = line[ply];
          if (!m) return <span key={ply} />;
          const tip = describeMove(m.san, m.ctx) || m.san;
          const mark = marks?.[ply];
          const props = {
            className: `mv${ply === current ? ' current' : ''}`,
            'data-move-tip': mark ? `${tip} (${mark})` : tip,
            'aria-label': tip,
          };
          const body = (
            <>
              <Move san={m.san} tip={props['data-move-tip']} />
              {mark && <span className={`mv-mark mark-${mark}`} />}
            </>
          );
          return onSelect
            ? <button key={ply} type="button" {...props} onClick={() => onSelect(ply)}>{body}</button>
            : <span key={ply} tabIndex={0} {...props}>{body}</span>;
        })}
      </div>,
    );
  }
  return (
    <div className="move-list-wrap">
      <div className="move-list" ref={ref}>{rows}</div>
      <NotationGuideButton className="move-list-guide" />
    </div>
  );
}
