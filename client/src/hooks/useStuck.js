import { useEffect, useRef, useState } from 'react';

/*
 * True while a sticky element is pinned. Put the returned ref on an empty marker placed
 * right before the sticky element: once the marker scrolls above the sticky line, it's stuck.
 * The sticky line defaults to the floating top bar's height (`--nav-h`).
 */
export function useStuck() {
  const marker = useRef(null);
  const [stuck, setStuck] = useState(false);
  useEffect(() => {
    const el = marker.current;
    if (!el) return undefined;
    const offset = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) || 0;
    const observer = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting && entry.boundingClientRect.top < offset),
      { rootMargin: `-${offset}px 0px 0px 0px`, threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [marker, stuck];
}
