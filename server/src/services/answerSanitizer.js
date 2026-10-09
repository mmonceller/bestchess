/*
 * Lesson answers are an array with one small record per step (or null), e.g.
 * { picks: [2, 0] }, { tries: ['e2e4'] }, { moves: 5, path: ['a1', 'a8'] }.
 * Only short tokens, integers and flat arrays of those are kept.
 */
const KEY = /^[a-z]{1,10}$/i;
const TOKEN = /^[a-zA-Z0-9+#=-]{1,12}$/;
const MAX_STEPS = 40;
const MAX_LIST = 80;
const MAX_KEYS = 6;

function cleanValue(v, nested) {
  if (typeof v === 'number') return Number.isFinite(v) ? Math.round(v) : null;
  if (typeof v === 'string') return TOKEN.test(v) ? v : null;
  if (!nested && Array.isArray(v)) {
    return v.slice(0, MAX_LIST).map((x) => cleanValue(x, true)).filter((x) => x !== null);
  }
  return null;
}

function cleanRecord(entry) {
  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) return null;
  const rec = {};
  for (const [k, v] of Object.entries(entry).slice(0, MAX_KEYS)) {
    if (!KEY.test(k)) continue;
    const c = cleanValue(v, false);
    if (c !== null) rec[k] = c;
  }
  return Object.keys(rec).length ? rec : null;
}

/* Returns a cleaned answers array, or undefined when nothing usable was sent. */
export function sanitizeAnswers(raw) {
  if (!Array.isArray(raw)) return undefined;
  const out = raw.slice(0, MAX_STEPS).map(cleanRecord);
  return out.some(Boolean) ? out : undefined;
}
