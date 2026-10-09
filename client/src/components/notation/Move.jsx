import { parseSan } from '../../chess/notation/parseSan.js';
import { describeMove } from '../../chess/notation/describe.js';
import './notation.css';

const ANNOTATION_TONE = { '!': 'good', '!!': 'good', '?': 'bad', '??': 'bad', '!?': 'mixed', '?!': 'mixed' };

/*
 * One move in colour-coded notation with a plain-English tooltip (see MoveTooltip).
 * `ctx` adds detail from the game ({ color, from, captured }); `prefix` is a move number like "12." or "12...".
 */
export default function Move({ san, ctx, prefix = '', tip, className = '' }) {
  const parsed = parseSan(san);
  if (!parsed) return <span className={className}>{prefix}{san}</span>;
  return (
    <span className={`san ${className}`} data-move-tip={tip || describeMove(san, ctx)}>
      {prefix && <span className="san-num">{prefix}</span>}
      {parsed.parts.map((p, i) => (
        <span key={i} className={`san-${p.kind}${p.kind === 'annotation' ? ` ${ANNOTATION_TONE[p.text] || ''}` : ''}`}>{p.text}</span>
      ))}
    </span>
  );
}
