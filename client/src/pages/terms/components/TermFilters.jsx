import Icon from '../../../components/icons/Icon.jsx';
import ChipRow from '../../../components/ui/chipRow/ChipRow.jsx';
import { CATEGORIES, LEVELS } from '../../../training/terms/index.js';
import { SORTS } from '../../../training/terms/filterTerms.js';
import { useStuck } from '../../../hooks/useStuck.js';

/* Search, category chips, and the level and sort pickers. Counts follow the other active filters. */
export default function TermFilters({ filters, onChange, categoryCounts, levelCounts }) {
  const [marker, stuck] = useStuck();
  const set = (key) => (value) => onChange({ ...filters, [key]: value });
  const total = Object.values(categoryCounts).reduce((a, b) => a + b, 0);
  const categories = [
    { id: null, label: 'All', icon: 'grid', count: total },
    ...CATEGORIES.map((c) => ({ id: c.id, label: c.label, icon: c.icon, color: c.color, count: categoryCounts[c.id] || 0 })),
  ];
  return (
    <>
      <div ref={marker} className="term-filters-marker" aria-hidden="true" />
      <div className={`term-filters${stuck ? ' stuck' : ''}`}>
        <label className="term-search">
          <Icon name="search" size={18} />
          <input
            type="search"
            className="input"
            placeholder="Search terms, like pin or Sicilian…"
            value={filters.query}
            onChange={(e) => set('query')(e.target.value)}
            aria-label="Search chess terms"
          />
          {filters.query && (
            <button type="button" className="icon-btn" aria-label="Clear search" onClick={() => set('query')('')}>
              <Icon name="close" size={14} />
            </button>
          )}
        </label>
        <ChipRow items={categories} value={filters.category} onChange={set('category')} label="Category" moreLabel="Show more categories" />
        <div className="term-pickers">
          <div className="term-picker" role="group" aria-label="Level">
            <span className="muted small">Level</span>
            <div className="segmented">
              <button type="button" className={!filters.level ? 'active' : ''} onClick={() => set('level')(null)}>Any</button>
              {LEVELS.map((l) => (
                <button key={l.id} type="button" className={filters.level === l.id ? 'active' : ''} onClick={() => set('level')(l.id)} title={`${levelCounts[l.id] || 0} terms`}>
                  <Icon name={l.icon} size={14} /> {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="term-picker" role="group" aria-label="Sort by">
            <span className="muted small">Sort</span>
            <div className="segmented">
              {SORTS.map((s) => (
                <button key={s.id} type="button" className={filters.sort === s.id ? 'active' : ''} onClick={() => set('sort')(s.id)} disabled={Boolean(filters.query.trim())}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
