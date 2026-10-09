import { useCallback, useEffect, useRef, useState } from 'react';
import { getLesson, LESSONS, TRACKS } from '../../training/lessons/index.js';
import { getCoach } from '../../training/coaches.js';
import { useProgress } from '../../training/progressStore.js';
import { touchDay, useTrainer } from '../../training/trainerStore.js';
import { useMastery } from '../../training/mastery/useMastery.js';
import { bonusXp, lessonXp } from '../../training/xp.js';
import { engine } from '../../engine/engineClient.js';
import { STEP_COMPONENTS, STEP_LABEL } from './steps/registry.js';
import LessonBar from './player/LessonBar.jsx';
import LessonComplete from './LessonComplete.jsx';
import LockedLesson from './player/LockedLesson.jsx';
import RevisitIntro from './revisit/RevisitIntro.jsx';
import ReviewStep from './revisit/ReviewStep.jsx';
import BonusComplete from './revisit/BonusComplete.jsx';
import { starsFor } from './stepUtils.js';
import '../../components/game/game.css';
import './training.css';
import './revisit/revisit.css';

/*
 * Modes: `learn` plays the lesson and saves stars + answers; a finished lesson opens on
 * `intro`, from where the player can `review` their saved answers (nothing is replaced)
 * or play the `bonus` round of extra steps, which is scored and saved separately.
 */
function initialMode(start, record) {
  if (start === 'fresh' || !record) return 'learn';
  if (start === 'bonus') return 'bonus';
  return 'intro';
}

export default function LessonPlayer({ lessonId, start }) {
  const lesson = getLesson(lessonId);
  const { progress, loading, complete, completeBonus } = useProgress();
  const { trainer, update: updateTrainer } = useTrainer();
  const gated = Boolean(lesson && TRACKS.find((t) => t.id === lesson.track)?.gated);
  const mastery = useMastery(progress, trainer, gated);
  const [mode, setMode] = useState(null);
  const [index, setIndex] = useState(0);
  const [attempt, setAttempt] = useState(0);
  const [retrying, setRetrying] = useState(false);
  const [mistakes, setMistakes] = useState(0);
  const [hints, setHints] = useState(0);
  const [result, setResult] = useState(null);
  const answers = useRef([]);
  const savedRef = useRef(false);

  useEffect(() => () => engine.cancel(), []);
  useEffect(() => {
    if (!loading && lesson && mode === null) setMode(initialMode(start, progress[lesson.id]));
  }, [loading, lesson, mode, start, progress]);

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
  if (mode === null || (gated && mastery.loading)) {
    return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;
  }
  if (gated && !mastery.unlocked) return <LockedLesson mastery={mastery} />;

  const coach = getCoach(lesson.coach);
  const record = progress[lesson.id];
  const bonusDone = Boolean(record?.bonusStars);
  const reviewItems = [
    ...lesson.steps.map((step, i) => ({ step, answer: record?.answers?.[i], kind: 'review' })),
    ...(bonusDone ? lesson.bonus.map((step, i) => ({ step, answer: record?.bonusAnswers?.[i], kind: 'bonus' })) : []),
  ];

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  function begin(nextMode) {
    savedRef.current = false;
    answers.current = [];
    setMode(nextMode);
    setIndex(0);
    setMistakes(0);
    setHints(0);
    setResult(null);
    setRetrying(false);
    setAttempt((a) => a + 1);
    scrollTop();
  }

  function finishRun(steps) {
    const stars = starsFor(mistakes, hints);
    const run = steps.map((_, i) => answers.current[i] || null);
    const isBonus = mode === 'bonus';
    const prevStars = (isBonus ? record?.bonusStars : record?.stars) || 0;
    const toXp = isBonus ? bonusXp : lessonXp;
    setResult({ stars, mistakes, hints, xp: Math.max(0, toXp(stars) - toXp(prevStars)), repeat: prevStars > 0 });
    if (savedRef.current) return;
    savedRef.current = true;
    if (isBonus) completeBonus(lesson.id, stars, run);
    else complete(lesson.id, stars, run);
    updateTrainer(touchDay);
  }

  function nextPlayed(steps) {
    if (index + 1 < steps.length) { setIndex(index + 1); scrollTop(); return; }
    finishRun(steps);
  }

  function nextReview() {
    setRetrying(false);
    if (index + 1 < reviewItems.length) { setIndex(index + 1); scrollTop(); return; }
    if (!bonusDone && lesson.bonus.length) begin('bonus');
    else begin('intro');
  }

  const nextLesson = LESSONS.filter((l) => l.track === lesson.track)
    .find((l, i, arr) => arr[i - 1]?.id === lesson.id);

  if (mode === 'intro') {
    return <RevisitIntro lesson={lesson} coach={coach} record={record} onReview={() => begin('review')} onBonus={() => begin('bonus')} onFresh={() => begin('learn')} />;
  }

  if (result && mode === 'bonus') {
    return <BonusComplete lesson={lesson} coach={coach} result={result} onReview={() => begin('review')} onRetry={() => begin('bonus')} />;
  }
  if (result) {
    return (
      <LessonComplete
        lesson={lesson}
        coach={coach}
        result={result}
        nextLesson={nextLesson}
        onRetry={() => begin('learn')}
        onBonus={lesson.bonus.length ? () => begin('bonus') : null}
      />
    );
  }

  if (mode === 'review') {
    const item = reviewItems[index];
    const last = index + 1 >= reviewItems.length;
    const nextLabel = !last ? 'Next' : !bonusDone && lesson.bonus.length ? 'Start the bonus round' : 'Finish review';
    return (
      <div className="lesson-player reviewing" style={{ '--coach': coach.color }}>
        <LessonBar
          title={lesson.title}
          subtitle={`${item.kind === 'bonus' ? 'Bonus review' : 'Reviewing'} · ${STEP_LABEL[item.step.type]} · ${index + 1} of ${reviewItems.length}`}
          segments={reviewItems.map((it, i) => ({ state: i < index ? 'done' : i === index ? 'current' : '', kind: it.kind }))}
          onBack={index > 0 ? () => { setRetrying(false); setIndex(index - 1); } : () => begin('intro')}
        />
        <ReviewStep
          key={`${attempt}-${index}-${retrying}`}
          step={item.step}
          answer={item.answer}
          coach={coach}
          retrying={retrying}
          onRetry={() => setRetrying(true)}
          onNext={nextReview}
          nextLabel={nextLabel}
        />
      </div>
    );
  }

  const steps = mode === 'bonus' ? lesson.bonus : lesson.steps;
  const step = steps[index];
  const Step = STEP_COMPONENTS[step.type];
  const label = `${mode === 'bonus' ? 'Bonus round · ' : ''}${STEP_LABEL[step.type]} · ${index + 1} of ${steps.length}`;
  return (
    <div className={`lesson-player${mode === 'bonus' ? ' bonus-run' : ''}`} style={{ '--coach': coach.color }}>
      <LessonBar
        title={lesson.title}
        subtitle={label}
        segments={steps.map((_, i) => ({ state: i < index ? 'done' : i === index ? 'current' : '', kind: mode === 'bonus' ? 'bonus' : undefined }))}
        mistakes={mistakes}
        hints={hints}
        showScore
      />
      <Step
        key={`${attempt}-${index}`}
        step={step}
        coach={coach}
        onNext={() => nextPlayed(steps)}
        onMistake={onMistake}
        onHint={onHint}
        onAnswer={(a) => { answers.current[index] = a; }}
      />
    </div>
  );
}
