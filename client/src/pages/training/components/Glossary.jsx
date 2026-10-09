import { createContext, useContext, useMemo, useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import { GLOSSARY, splitGlossary } from '../../../training/glossary.js';

/*
 * Tappable chess words. Any text wrapped in <GlossText> turns known terms
 * (fork, pin, castling…) into buttons that open a plain-English definition.
 */
const GlossaryContext = createContext(null);

export function GlossaryProvider({ children }) {
  const [term, setTerm] = useState(null);
  const value = useMemo(() => ({ term, setTerm }), [term]);
  return <GlossaryContext.Provider value={value}>{children}</GlossaryContext.Provider>;
}

export function GlossText({ children }) {
  const ctx = useContext(GlossaryContext);
  if (typeof children !== 'string' || !ctx) return children ?? null;
  return splitGlossary(children).map((part, i) => (part.term ? (
    <button
      key={i}
      type="button"
      className={`gloss${ctx.term === part.term ? ' active' : ''}`}
      onClick={() => ctx.setTerm((t) => (t === part.term ? null : part.term))}
    >
      {part.text}
    </button>
  ) : part.text));
}

export function DefinitionCard() {
  const ctx = useContext(GlossaryContext);
  if (!ctx?.term) return null;
  return (
    <div className="definition-card pop-in" role="note">
      <Icon name="book" size={20} className="definition-icon" />
      <div>
        <b>{ctx.term[0].toUpperCase() + ctx.term.slice(1)}</b>
        <p>{GLOSSARY[ctx.term]}</p>
      </div>
      <button type="button" className="icon-btn" aria-label="Close definition" onClick={() => ctx.setTerm(null)}>
        <Icon name="close" size={16} />
      </button>
    </div>
  );
}
