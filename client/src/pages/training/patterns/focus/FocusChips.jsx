import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '../../../../components/icons/Icon.jsx';
import { PATTERNS } from '../../../../training/patterns/patterns.js';
import './focusChips.css';

const EDGE = 2;

/*
 * One scrollable row of pattern chips ("Mixed" first). Arrows and edge fades appear only
 * when there are more chips that way, the mouse wheel scrolls sideways, and the active
 * chip is kept in view.
 */
export default function FocusChips({ patterns, focus, onChoose }) {
  const row = useRef(null);
  const [more, setMore] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setMore({ left: el.scrollLeft > EDGE, right: el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE });
  }, []);

  useLayoutEffect(measure, [measure, patterns.length]);
  useEffect(() => {
    const el = row.current;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    const onWheel = (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX) || el.scrollWidth <= el.clientWidth) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => { observer.disconnect(); el.removeEventListener('wheel', onWheel); };
  }, [measure]);

  useEffect(() => {
    const el = row.current;
    const chip = el?.querySelector('.active');
    if (!chip) return;
    const box = el.getBoundingClientRect();
    const c = chip.getBoundingClientRect();
    if (c.left < box.left + 32) el.scrollBy({ left: c.left - box.left - 32, behavior: 'smooth' });
    else if (c.right > box.right - 32) el.scrollBy({ left: c.right - box.right + 32, behavior: 'smooth' });
  }, [focus]);

  const page = (dir) => row.current.scrollBy({ left: dir * row.current.clientWidth * 0.7, behavior: 'smooth' });

  return (
    <div className={`focus-bar${more.left ? ' more-left' : ''}${more.right ? ' more-right' : ''}`}>
      <button type="button" className="focus-arrow left" onClick={() => page(-1)} aria-label="Show earlier patterns" tabIndex={more.left ? 0 : -1}>
        <Icon name="chevron" size={16} />
      </button>
      <div className="focus-chips" ref={row} onScroll={measure} role="tablist" aria-label="Choose what to practice">
        <button role="tab" aria-selected={!focus} className={!focus ? 'active' : ''} onClick={() => onChoose(null)}>
          <Icon name="random" size={14} /> Mixed
        </button>
        {patterns.map((id) => (
          <button
            key={id}
            role="tab"
            aria-selected={focus === id}
            className={focus === id ? 'active' : ''}
            style={{ '--c': PATTERNS[id].color }}
            onClick={() => onChoose(id)}
          >
            <Icon name={PATTERNS[id].icon} size={14} /> {PATTERNS[id].name}
          </button>
        ))}
      </div>
      <button type="button" className="focus-arrow right" onClick={() => page(1)} aria-label="Show more patterns" tabIndex={more.right ? 0 : -1}>
        <Icon name="chevron" size={16} />
      </button>
    </div>
  );
}
