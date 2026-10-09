import { Fragment } from 'react';
import { splitMoves } from '../../chess/notation/splitMoves.js';
import Move from './Move.jsx';

/*
 * Text with any chess moves in it coloured and explained on hover. Non-string children pass through.
 * `loose` is for text that is only a line of moves ("e4 e5 Nf3"), so bare pawn moves count too.
 */
export default function MoveText({ text, children, loose = false, firstColor = null }) {
  const value = text ?? children;
  if (typeof value !== 'string') return value ?? null;
  return splitMoves(value, { loose, firstColor }).map((seg, i) => (
    seg.type === 'text'
      ? <Fragment key={i}>{seg.text}</Fragment>
      : <Move key={i} san={seg.san} prefix={seg.prefix} ctx={{ color: seg.color }} />
  ));
}
