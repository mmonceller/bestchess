/*
 * Scrolls `container` just enough to show `el`, without scrolling the page
 * (unlike scrollIntoView, which also moves every scrollable ancestor).
 */
export function scrollWithin(container, el, margin = 4) {
  if (!container || !el) return;
  const box = container.getBoundingClientRect();
  const item = el.getBoundingClientRect();
  if (item.top < box.top) container.scrollTop -= box.top - item.top + margin;
  else if (item.bottom > box.bottom) container.scrollTop += item.bottom - box.bottom + margin;
}
