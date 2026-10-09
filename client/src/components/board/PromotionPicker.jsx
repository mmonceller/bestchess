import { GLYPH } from './pieces.js';

export default function PromotionPicker({ color, onPick, onCancel }) {
  return (
    <div className="promo-backdrop" onClick={onCancel}>
      <div className="promo-picker" onClick={(e) => e.stopPropagation()}>
        {['q', 'r', 'b', 'n'].map((t) => (
          <button key={t} className={`promo-btn piece ${color === 'w' ? 'white' : 'black'}`} onClick={() => onPick(t)} aria-label={`Promote to ${t}`}>
            {GLYPH[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
