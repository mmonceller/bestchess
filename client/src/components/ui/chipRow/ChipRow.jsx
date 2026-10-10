import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Icon from '../../icons/Icon.jsx';
import './chipRow.css';

const EDGE = 2;

/*
 * One scrollable row of choice chips. Arrows and edge fades appear only when there are
 * more chips that way, the mouse wheel scrolls sideways, and the active chip is kept in view.
 * Items: { id, label, icon?, color?, count? }; an id of null is a valid choice (e.g. "All").
 */
export default function ChipRow({ items, value, onChange, label, moreLabel = 'Show more' }) {
  const row = useRef(null);
  const [more, setMore] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = row.current;
    if (!el) return;
    setMore({ left: el.scrollLeft > EDGE, right: el.scrollLeft + el.clientWidth < el.scrollWidth - EDGE });
  }, []);

  useLayoutEffect(measure, [measure, items.length]);
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
  }, [value]);

  const page = (dir) => row.current.scrollBy({ left: dir * row.current.clientWidth * 0.7, behavior: 'smooth' });

  return (
    <div className={`chip-row-bar${more.left ? ' more-left' : ''}${more.right ? ' more-right' : ''}`}>
      <button type="button" className="chip-row-arrow left" onClick={() => page(-1)} aria-label="Scroll back" tabIndex={more.left ? 0 : -1}>
        <Icon name="chevron" size={16} />
      </button>
      <div className="chip-row" ref={row} onScroll={measure} role="tablist" aria-label={label}>
        {items.map((item) => (
          <button
            key={item.id ?? 'all'}
            type="button"
            role="tab"
            aria-selected={value === item.id}
            className={value === item.id ? 'active' : ''}
            style={item.color ? { '--c': item.color } : undefined}
            onClick={() => onChange(item.id)}
          >
            {item.icon && <Icon name={item.icon} size={14} />} {item.label}
            {item.count != null && <span className="chip-row-count">{item.count}</span>}
          </button>
        ))}
      </div>
      <button type="button" className="chip-row-arrow right" onClick={() => page(1)} aria-label={moreLabel} tabIndex={more.right ? 0 : -1}>
        <Icon name="chevron" size={16} />
      </button>
    </div>
  );
}
