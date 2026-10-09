import { useEffect, useRef } from 'react';

/*
 * SAN move list in numbered pairs. `current` highlights a ply (0-based); onSelect makes it clickable.
 * `marks` optionally maps a ply to a review grade, shown as a coloured dot.
 */
export default function MoveList({ moves, current = moves.length - 1, onSelect, marks }) {
  const ref = useRef(null);
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
        {[i, i + 1].map((ply) => (moves[ply] ? (
          <button
            key={ply}
            type="button"
            className={`mv${ply === current ? ' current' : ''}`}
            onClick={onSelect ? () => onSelect(ply) : undefined}
            disabled={!onSelect}
          >
            {moves[ply]}
            {marks?.[ply] && <span className={`mv-mark mark-${marks[ply]}`} title={marks[ply]} />}
          </button>
        ) : <span key={ply} />))}
      </div>,
    );
  }
  return <div className="move-list" ref={ref}>{rows}</div>;
}
