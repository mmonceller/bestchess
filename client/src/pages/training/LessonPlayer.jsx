import { useCallback, useEffect, useRef, useState } from 'react';
import { getLesson, LESSONS } from '../../training/lessons/index.js';
import { getCoach } from '../../training/coaches.js';
import { useProgress } from '../../training/progressStore.js';
import { touchDay, useTrainer } from '../../training/trainerStore.js';
import { lessonXp } from '../../training/xp.js';
import { engine } from '../../engine/engineClient.js';
import Icon from '../../components/icons/Icon.jsx';
import TalkStep from './steps/TalkStep.jsx';
import QuizStep from './steps/QuizStep.jsx';
import FindStep from './steps/FindStep.jsx';
import MoveStep from './steps/MoveStep.jsx';
import BestStep from './steps/BestStep.jsx';
import DrillStep from './steps/DrillStep.jsx';
import CollectStep from './steps/CollectStep.jsx';
import SquaresStep from './steps/SquaresStep.jsx';
import RecapStep from './steps/RecapStep.jsx';
import LessonComplete from './LessonComplete.jsx';
import { starsFor } from './stepUtils.js';
import '../../components/game/game.css';
import './training.css';

const STEP_COMPONENTS = {
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
const STEP_LABEL = {
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

export default function LessonPlayer({ lessonId }) {
  const lesson = getLesson(lessonId);
  const { progress, complete } = useProgress();
  const { update: updateTrainer } = useTrainer();
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [result, setResult] = useState(null);
  const savedRef = useRef(false);

  useEffect(() => () => engine.cancel(), []);

  const onMistake = useCallback(() => setMistakes((m) => m + 1), []);
  const onHint = useCallback(() => setHints((h) => h + 1), []);

  if (!lesson) {
    return (
      <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}>
        <h2>Lesson not found</h2>
        <a className="btn primary" href="#/training">Back to training</a>
      </div>
    );
  }

  const coach = getCoach(lesson.coach);

  function next() {
    if (index + 1 < lesson.steps.length) {
      setIndex(index + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const stars = starsFor(mistakes, hints);
    const prevStars = progress[lesson.id]?.stars || 0;
    const xp = Math.max(0, lessonXp(stars) - lessonXp(prevStars));
    setResult({ stars, mistakes, hints, xp, improved: stars > prevStars, repeat: prevStars > 0 });
    if (!savedRef.current) {
      savedRef.current = true;
      complete(lesson.id, stars);
      updateTrainer(touchDay);
    }
  }

  function restart() {
    savedRef.current = false;
    setIndex(0);
    setMistakes(0);
    setHints(0);
    setResult(null);
    setAttempt((a) => a + 1);
  }

  const nextLesson = LESSONS.filter((l) => l.track === lesson.track)
    .find((l, i, arr) => arr[i - 1]?.id === lesson.id);

  if (result) {
    return <LessonComplete lesson={lesson} coach={coach} result={result} nextLesson={nextLesson} onRetry={restart} />;
  }

  const step = lesson.steps[index];
  const Step = STEP_COMPONENTS[step.type];

  return (
    <div className="lesson-player" style={{ '--coach': coach.color }}>
      <div className="lesson-bar">
        <a href="#/training" className="orb small" aria-label="Back to training"><Icon name="close" size={18} /></a>
        <div className="lesson-title">
          <b>{lesson.title}</b>
          <span className="muted small">{STEP_LABEL[step.type]} · {index + 1} of {lesson.steps.length}</span>
        </div>
        <div className="mistake-count" title="Mistakes and hints used">
          <span className="icon-text"><Icon name="xCircle" size={15} /> {mistakes}</span>
          <span className="icon-text"><Icon name="hint" size={15} /> {hints}</span>
        </div>
      </div>
      <div className="step-progress">
        {lesson.steps.map((s, i) => (
          <span key={i} className={i < index ? 'done' : i === index ? 'current' : ''} />
        ))}
      </div>
      <Step
        key={`${attempt}-${index}`}
        step={step}
        coach={coach}
        onNext={next}
        onMistake={onMistake}
        onHint={onHint}
      />
    </div>
  );
}
