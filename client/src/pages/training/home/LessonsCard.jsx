import CoachGroup from './CoachGroup.jsx';

/* Opens the worlds. Start asks where to begin. Continue goes straight to the lessons. */
export default function LessonsCard({ started, ready, onStart }) {
  const label = ready ? (started ? 'Continue' : 'Start') : '\u00a0';
  const go = started
    ? <a className="btn primary learn-go" href="#/training/lessons">{label}</a>
    : <button type="button" className="btn primary learn-go" onClick={onStart} disabled={!ready}>{label}</button>;
  return (
    <section className="learn-card card">
      <div className="learn-copy">
        <h2>LESSONS</h2>
        <p>Learn chess basics, fundamentals, techniques from your AI Coaches</p>
        {go}
      </div>
      <CoachGroup />
    </section>
  );
}
