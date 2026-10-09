import { FILES } from './pieces.js';

const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];
const FILE_LIST = [...FILES];

/*
 * Rank numbers beside the board and file letters under it, in the board's orientation.
 * `side` (e.g. the eval bar) sits to the right of the board, on the board's row only.
 */
export function BoardFrame({ flipped, side, children }) {
  const ranks = flipped ? [...RANKS].reverse() : RANKS;
  const files = flipped ? [...FILE_LIST].reverse() : FILE_LIST;
  return (
    <div className={`board-frame${side ? ' with-side' : ''}`}>
      <div className="coord-ranks" aria-hidden="true">{ranks.map((r) => <span key={r}>{r}</span>)}</div>
      {children}
      {side && <div className="board-side">{side}</div>}
      <div className="coord-files" aria-hidden="true">{files.map((f) => <span key={f}>{f}</span>)}</div>
    </div>
  );
}
