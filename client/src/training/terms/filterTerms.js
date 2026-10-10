import { CATEGORIES, CATEGORY, LEVEL } from './categories.js';

/* Accents and case don't matter when searching or sorting ("Réti" sorts and matches as "reti"). */
const plain = (s) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const byName = (a, b) => plain(a.name).localeCompare(plain(b.name));
const categoryRank = Object.fromEntries(CATEGORIES.map((c, i) => [c.id, i]));

/* Each sort also decides how the list is split into headed sections. */
export const SORTS = [
  { id: 'az', label: 'A – Z', icon: 'arrowRight' },
  { id: 'category', label: 'Category', icon: 'grid' },
  { id: 'level', label: 'Level', icon: 'seedling' },
];

const ORDER = {
  az: byName,
  category: (a, b) => categoryRank[a.category] - categoryRank[b.category] || byName(a, b),
  level: (a, b) => LEVEL[a.level].rank - LEVEL[b.level].rank || byName(a, b),
};

const SECTION = {
  az: (t) => {
    const letter = plain(t.name).replace(/[^a-z]/g, '')[0].toUpperCase();
    return { id: letter, label: letter };
  },
  category: (t) => ({ id: t.category, label: CATEGORY[t.category].label, icon: CATEGORY[t.category].icon, color: CATEGORY[t.category].color }),
  level: (t) => ({ id: t.level, label: LEVEL[t.level].label, icon: LEVEL[t.level].icon }),
};

/* Best matches first while searching: name starts with the query, then name contains it, then anything else. */
function searchRank(term, q) {
  const name = plain(term.name);
  if (name.startsWith(q)) return 0;
  if (name.includes(q)) return 1;
  if (term.aka.some((a) => plain(a).includes(q))) return 2;
  return 3;
}

export function matchesQuery(term, q) {
  if (!q) return true;
  return [term.name, ...term.aka, term.def].some((s) => plain(s).includes(q));
}

/*
 * Filters by category, level and search text, then sorts and groups:
 * returns [{ id, label, icon?, color?, terms }]. While searching, results come in one
 * "best match" section so the closest names are on top.
 */
export function groupTerms(terms, { category = null, level = null, query = '', sort = 'az' }) {
  const q = plain(query.trim());
  const list = terms.filter((t) => (!category || t.category === category) && (!level || t.level === level) && matchesQuery(t, q));
  if (q) {
    const ranked = [...list].sort((a, b) => searchRank(a, q) - searchRank(b, q) || byName(a, b));
    return ranked.length ? [{ id: 'results', label: 'Best matches', icon: 'search', terms: ranked }] : [];
  }
  const sections = [];
  for (const term of [...list].sort(ORDER[sort])) {
    const head = SECTION[sort](term);
    const last = sections[sections.length - 1];
    if (last?.id === head.id) last.terms.push(term);
    else sections.push({ ...head, terms: [term] });
  }
  return sections;
}

/* How many terms each category and level chip would show, given the other filters. */
export function countBy(terms, key, filters) {
  const q = plain((filters.query || '').trim());
  const other = key === 'category' ? 'level' : 'category';
  const counts = {};
  for (const t of terms) {
    if (filters[other] && t[other] !== filters[other]) continue;
    if (!matchesQuery(t, q)) continue;
    counts[t[key]] = (counts[t[key]] || 0) + 1;
  }
  return counts;
}
