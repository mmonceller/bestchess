import { Fragment } from 'react';
import { replayLine } from '../../chess/notation/line.js';
import Move from './Move.jsx';

/* A sequence of moves (SAN or UCI) played from `fen`, numbered like "30...Rxh2+ 31.Kxh2 Rh8#". */
export default function MoveLine({ fen, moves, numbered = true, className = '' }) {
  const line = replayLine(fen, moves);
  return (
    <span className={`move-line ${className}`}>
      {line.map((m, i) => {
        let prefix = '';
        if (numbered && m.number) {
          if (m.color === 'w') prefix = `${m.number}.`;
          else if (i === 0) prefix = `${m.number}...`;
        }
        return (
          <Fragment key={i}>
            {i > 0 && ' '}
            <Move san={m.san} ctx={m.ctx} prefix={prefix} />
          </Fragment>
        );
      })}
    </span>
  );
}
