import Icon from '../../../components/icons/Icon.jsx';
import ReviewStep from '../revisit/ReviewStep.jsx';

/*
 * An earlier step of the current run, shown read-only with the answer the player just gave.
 * Nothing here can be replayed or scored; the step in progress waits until they return.
 */
export default function LookBack({ step, answer, coach, isLast, currentNumber, onNext }) {
  return (
    <>
      <div className="look-back-note small">
        <Icon name="eye" size={15} />
        <span>Looking back — review only. Your step {currentNumber} is waiting where you left it.</span>
      </div>
      <ReviewStep
        step={step}
        answer={answer}
        coach={coach}
        onNext={onNext}
        nextLabel={isLast ? `Back to step ${currentNumber}` : 'Next'}
      />
    </>
  );
}
