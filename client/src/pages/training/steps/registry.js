import TalkStep from './TalkStep.jsx';
import QuizStep from './QuizStep.jsx';
import FindStep from './FindStep.jsx';
import MoveStep from './MoveStep.jsx';
import BestStep from './BestStep.jsx';
import DrillStep from './DrillStep.jsx';
import CollectStep from './CollectStep.jsx';
import SquaresStep from './SquaresStep.jsx';
import RecapStep from './RecapStep.jsx';

export const STEP_COMPONENTS = {
  talk: TalkStep,
  quiz: QuizStep,
  find: FindStep,
  move: MoveStep,
  best: BestStep,
  drill: DrillStep,
  collect: CollectStep,
  squares: SquaresStep,
  recap: RecapStep,
};

export const STEP_LABEL = {
  talk: 'Learn',
  quiz: 'Question',
  find: 'Spot it',
  move: 'Your move',
  best: 'Find a good move',
  drill: 'Play it out',
  collect: 'Star hunt',
  squares: 'Square game',
  recap: 'Remember this',
};

/* Steps that only show information — there is no answer to record or review. */
export const isReadOnly = (step) => step.type === 'talk' || step.type === 'recap';
