import Icon from '../../../components/icons/Icon.jsx';
import { STEP_COMPONENTS } from '../steps/registry.js';
import QuizReview from './cards/QuizReview.jsx';
import FindReview from './cards/FindReview.jsx';
import MoveReview from './cards/MoveReview.jsx';
import BestReview from './cards/BestReview.jsx';
import DrillReview from './cards/DrillReview.jsx';
import CollectReview from './cards/CollectReview.jsx';
import SquaresReview from './cards/SquaresReview.jsx';

const REVIEW_CARDS = {
  quiz: QuizReview,
  find: FindReview,
  move: MoveReview,
  best: BestReview,
  drill: DrillReview,
  collect: CollectReview,
  squares: SquaresReview,
};

const noop = () => {};

/*
 * A finished step shown with the player's saved answer. Info steps are shown as they were;
 * "Try it again" replays the step without touching stars or saved answers.
 */
export default function ReviewStep({ step, answer, coach, retrying, onRetry, onNext, nextLabel }) {
  const Card = REVIEW_CARDS[step.type];
  if (!Card || retrying) {
    const Step = STEP_COMPONENTS[step.type];
    return <Step step={step} coach={coach} onNext={onNext} onMistake={noop} onHint={noop} />;
  }
  const actions = (
    <div className="controls">
      <button className="btn icon-text" onClick={onRetry}><Icon name="retry" size={18} /> Try it again</button>
      <button className="btn primary icon-text" onClick={onNext} autoFocus>{nextLabel} <Icon name="arrowRight" size={18} /></button>
    </div>
  );
  return <Card step={step} answer={answer} coach={coach} actions={actions} />;
}
