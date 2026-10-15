import Icon from '../../../components/icons/Icon.jsx';

export default function PuzzleTraining() {
  return (
    <section className="puzzle-training">
      <h2>PUZZLE TRAINING</h2>
      <p>Recognize familiar scenarios and train your brain to combat</p>
      <div className="puzzle-pair">
        <a className="pair-card card" href="#/puzzles">
          <span className="pair-icon pair-pattern"><Icon name="puzzle" size={28} /></span>
          <span className="pair-copy">
            <b>Pattern Trainer</b>
            <span className="muted small">Puzzles picked for your level.</span>
          </span>
          <Icon name="arrowRight" size={20} />
        </a>
        <a className="pair-card card" href="#/puzzles/woodpecker">
          <span className="pair-icon pair-wood"><Icon name="retry" size={28} /></span>
          <span className="pair-copy">
            <b>Woodpecker Method</b>
            <span className="muted small">How the method works, then the sets.</span>
          </span>
          <Icon name="arrowRight" size={20} />
        </a>
      </div>
    </section>
  );
}
