import { useEffect, useMemo, useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';
import { TERMS } from '../../training/terms/index.js';
import { countBy, groupTerms } from '../../training/terms/filterTerms.js';
import TermFilters from './components/TermFilters.jsx';
import TermSection from './components/TermSection.jsx';
import './terms.css';

const SORT_KEY = 'bc.termsSort';

/*
 * Chess terms dictionary: every word from the lessons plus openings, famous endgames and
 * checkmates the lessons don't cover. `termId` (from #/terms/<id>) jumps to one term.
 */
export default function TermsPage({ termId = null, query = '' }) {
  const [filters, setFilters] = useState(() => ({
    query,
    category: null,
    level: null,
    sort: localStorage.getItem(SORT_KEY) || 'az',
  }));

  useEffect(() => { localStorage.setItem(SORT_KEY, filters.sort); }, [filters.sort]);

  useEffect(() => {
    if (!termId) return;
    document.getElementById(`term-${termId}`)?.scrollIntoView({ block: 'center' });
  }, [termId]);

  const sections = useMemo(() => groupTerms(TERMS, filters), [filters]);
  const categoryCounts = useMemo(() => countBy(TERMS, 'category', filters), [filters]);
  const levelCounts = useMemo(() => countBy(TERMS, 'level', filters), [filters]);
  const showCategory = filters.sort !== 'category' && !filters.category;

  return (
    <div className="terms-page fade-in">
      <header className="terms-intro">
        <span className="terms-intro-icon"><Icon name="book" size={26} /></span>
        <div>
          <h1>Chess Terms</h1>
          <p className="muted">{TERMS.length} chess words in plain English — from "check" to the Queen's Gambit, the Lucena and the Philidor.</p>
        </div>
      </header>

      <TermFilters filters={filters} onChange={setFilters} categoryCounts={categoryCounts} levelCounts={levelCounts} />

      {sections.length ? (
        sections.map((s) => <TermSection key={s.id} section={s} showCategory={showCategory} highlight={termId} />)
      ) : (
        <div className="card terms-empty">
          <b>No terms found.</b>
          <p className="muted small">Try another word, or clear the filters.</p>
          <button type="button" className="btn" onClick={() => setFilters((f) => ({ ...f, query: '', category: null, level: null }))}>
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
