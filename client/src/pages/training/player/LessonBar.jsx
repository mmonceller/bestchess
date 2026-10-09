import Icon from '../../../components/icons/Icon.jsx';

/*
 * Top bar of the lesson player. `segments` is one entry per step:
 * { state: 'done' | 'current' | '', kind: 'review' | 'bonus' | undefined }.
 */
export default function LessonBar({ title, subtitle, segments, mistakes, hints, showScore, onBack }) {
  return (
    <>
      <div className="lesson-bar">
        <a href="#/training" className="orb small" aria-label="Back to training"><Icon name="close" size={18} /></a>
        {onBack && <button className="orb small" onClick={onBack} aria-label="Previous step"><Icon name="arrowLeft" size={18} /></button>}
        <div className="lesson-title">
          <b>{title}</b>
          <span className="muted small">{subtitle}</span>
        </div>
        {showScore && (
          <div className="mistake-count" title="Mistakes and hints used">
            <span className="icon-text"><Icon name="xCircle" size={15} /> {mistakes}</span>
            <span className="icon-text"><Icon name="hint" size={15} /> {hints}</span>
          </div>
        )}
      </div>
      <div className="step-progress">
        {segments.map((s, i) => <span key={i} className={[s.state, s.kind].filter(Boolean).join(' ')} />)}
      </div>
    </>
  );
}
