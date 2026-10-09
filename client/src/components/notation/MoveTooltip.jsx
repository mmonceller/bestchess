import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import './notation.css';

const GAP = 8;
const EDGE = 8;

/* The outermost element carrying the tip, so a move inside a move-list button anchors to the button. */
function anchorOf(target) {
  let el = target.closest?.('[data-move-tip]') || null;
  while (el?.parentElement?.closest('[data-move-tip]')) el = el.parentElement.closest('[data-move-tip]');
  return el;
}

/*
 * Above the anchor if it fits, otherwise below; never on top of it. Horizontally centred on
 * the anchor and kept inside the window.
 */
function place(anchor, tipBox) {
  const fitsAbove = anchor.top - GAP - tipBox.height >= EDGE;
  const top = fitsAbove ? anchor.top - GAP - tipBox.height : anchor.bottom + GAP;
  const centre = anchor.left + anchor.width / 2;
  const left = Math.max(EDGE, Math.min(window.innerWidth - EDGE - tipBox.width, centre - tipBox.width / 2));
  return { top, left };
}

/*
 * One tooltip for every move on the page: anything with `data-move-tip` shows its description
 * on hover, tap or keyboard focus. It lives in <body>, so scrolling move lists can't clip it.
 */
export default function MoveTooltip() {
  const [tip, setTip] = useState(null);
  const [pos, setPos] = useState(null);
  const current = useRef(null);
  const box = useRef(null);

  useEffect(() => {
    const show = (el) => {
      if (current.current === el) return;
      current.current = el;
      setPos(null);
      setTip(el ? { text: el.dataset.moveTip, rect: el.getBoundingClientRect() } : null);
    };
    const fromEvent = (e) => show(anchorOf(e.target));
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

  useLayoutEffect(() => {
    if (tip && box.current) setPos(place(tip.rect, box.current.getBoundingClientRect()));
  }, [tip]);

  if (!tip?.text) return null;
  return createPortal(
    <div
      ref={box}
      className="move-tooltip"
      role="tooltip"
      style={{
        left: pos?.left ?? 0,
        top: pos?.top ?? 0,
        maxWidth: Math.min(280, window.innerWidth - EDGE * 2),
        visibility: pos ? 'visible' : 'hidden',
      }}
    >
      {tip.text}
    </div>,
    document.body,
  );
}
