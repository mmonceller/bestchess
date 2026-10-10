import Icon from '../../../components/icons/Icon.jsx';
import { TERMS } from '../../../training/terms/index.js';

/* Entry point to the chess terms dictionary. */
export default function TermsCard() {
  return (
    <a className="puzzle-card card terms-card" href="#/terms">
      <span className="puzzle-card-icon"><Icon name="book" size={30} /></span>
      <div className="puzzle-card-body">
        <h3>Chess Terms</h3>
        <p className="muted small">
          {TERMS.length} chess words explained in plain English — tactics, openings like the Queen's Gambit, and famous endgames like the Lucena.
        </p>
      </div>
      <span className="puzzle-card-cta">
        <b>Browse</b>
        <Icon name="arrowRight" size={20} />
      </span>
    </a>
  );
}
