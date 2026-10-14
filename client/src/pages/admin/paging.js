export const PAGE_SIZE = 8;

export function pageCount(total) {
  return Math.max(1, Math.ceil(total / PAGE_SIZE));
}

export function pageSlice(list, page) {
  const start = page * PAGE_SIZE;
  return list.slice(start, start + PAGE_SIZE);
}
