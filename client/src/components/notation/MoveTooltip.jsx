import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './notation.css';

/*
 * One tooltip for every move on the page: anything with `data-move-tip` shows its description
 * on hover, tap or keyboard focus. It lives in <body>, so scrolling move lists can't clip it.
 */
export default function MoveTooltip() {
  const [tip, setTip] = useState(null);
  const current = useRef(null);

  useEffect(() => {
    const show = (el) => {
      if (current.current === el) return;
      current.current = el;
      if (!el) { setTip(null); return; }
      const r = el.getBoundingClientRect();
      setTip({ text: el.dataset.moveTip, x: r.left + r.width / 2, top: r.top, bottom: r.bottom });
    };
    const fromEvent = (e) => show(e.target.closest?.('[data-move-tip]') || null);
    const hide = () => show(null);
    document.addEventListener('pointerover', fromEvent);
    document.addEventListener('pointerdown', fromEvent);
    document.addEventListener('focusin', fromEvent);
    document.addEventListener('focusout', hide);
    window.addEventListener('scroll', hide, true);
    window.addEventListener('resize', hide);
    return () => {
      document.removeEventListener('pointerover', fromEvent);
      document.removeEventListener('pointerdown', fromEvent);
      document.removeEventListener('focusin', fromEvent);
      document.removeEventListener('focusout', hide);
      window.removeEventListener('scroll', hide, true);
      window.removeEventListener('resize', hide);
    };
  }, []);

  if (!tip?.text) return null;
  const below = tip.top < 70;
  const half = Math.min(140, window.innerWidth / 2 - 8);
  const x = Math.max(half + 8, Math.min(window.innerWidth - half - 8, tip.x));
  return createPortal(
    <div
      className={`move-tooltip${below ? ' below' : ''}`}
      role="tooltip"
      style={{ left: x, top: below ? tip.bottom + 8 : tip.top - 8, maxWidth: half * 2 }}
    >
      {tip.text}
    </div>,
    document.body,
  );
}
