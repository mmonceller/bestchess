import DictionaryIcon from './DictionaryIcon.jsx';

export default function TermsSection() {
  return (
    <section className="learn-card card terms-section">
      <div className="learn-copy">
        <h2>CHESS TERMS</h2>
        <p>Understand words and terminology like a real chess player</p>
        <a className="btn primary learn-go" href="#/terms">Browse</a>
      </div>
      <DictionaryIcon />
    </section>
  );
}
