import { useRef } from 'react';
import { GLYPH } from './pieces.js';

/*
 * The picker opens on the pointerdown of the move, so the browser's click for that same tap lands
 * on it afterwards (late on touch screens). Clicks only count when their press started on the picker;
 * keyboard clicks (detail 0) have no press and always count.
 */
export default function PromotionPicker({ color, onPick, onCancel }) {
  const pressed = useRef(false);
  const counts = (e) => pressed.current || e.detail === 0;

  return (
    <div
      className="promo-backdrop"
      onPointerDownCapture={() => { pressed.current = true; }}
      onClick={(e) => { if (counts(e)) onCancel(); }}
    >
      <div className="promo-picker" onClick={(e) => e.stopPropagation()}>
        {['q', 'r', 'b', 'n'].map((t) => (
          <button
            key={t}
            type="button"
            className={`promo-btn piece ${color === 'w' ? 'white' : 'black'}`}
            onClick={(e) => { if (counts(e)) onPick(t); }}
            aria-label={`Promote to ${t}`}
          >
            {GLYPH[t]}
          </button>
        ))}
      </div>
    </div>
  );
}
