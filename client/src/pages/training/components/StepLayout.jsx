import CoachBubble from './CoachBubble.jsx';
import Notice from '../../../components/game/Notice.jsx';
import { DefinitionCard, GlossaryProvider, GlossText } from './Glossary.jsx';

/* Shared lesson-step layout: board on one side, coach + interaction panel on the other. */
export default function StepLayout({ coach, message, board, children, feedback, actions }) {
  if (!board) {
    return (
      <GlossaryProvider>
        <div className="step-solo fade-in">
          <CoachBubble coach={coach} large>{message}</CoachBubble>
          <DefinitionCard />
          {children}
          {feedback}
          <div className="step-actions">{actions}</div>
        </div>
      </GlossaryProvider>
    );
  }
  return (
    <GlossaryProvider>
      <div className="game-layout step fade-in">
        <div className="board-column">{board}</div>
        <aside className="side-panel">
          <CoachBubble coach={coach}>{message}</CoachBubble>
          <DefinitionCard />
          {children}
          {feedback}
          <div className="step-actions">{actions}</div>
        </aside>
      </div>
    </GlossaryProvider>
  );
}

export function Feedback({ fb }) {
  if (!fb) return null;
  return (
    <Notice tone={fb.tone} className="fade-in" key={fb.id}>
      <GlossText>{fb.text}</GlossText>
    </Notice>
  );
}
