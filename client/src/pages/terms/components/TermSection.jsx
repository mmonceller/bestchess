import Icon from '../../../components/icons/Icon.jsx';
import TermCard from './TermCard.jsx';

/* A headed group of terms (a letter, a category or a level, depending on the sort). */
export default function TermSection({ section, showCategory, highlight }) {
  return (
    <section className="term-section" style={section.color ? { '--c': section.color } : undefined}>
      <h2 className="term-section-head">
        {section.icon && <Icon name={section.icon} size={18} />}
        {section.label}
        <span className="muted small">{section.terms.length}</span>
      </h2>
      <div className="term-grid">
        {section.terms.map((t) => (
          <TermCard key={t.id} term={t} showCategory={showCategory} highlight={t.id === highlight} />
        ))}
      </div>
    </section>
  );
}
