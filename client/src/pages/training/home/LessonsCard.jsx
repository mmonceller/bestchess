import CoachGroup from './CoachGroup.jsx';

/* Opens the worlds. Start until the player has finished a lesson, then Continue. */
export default function LessonsCard({ started, ready }) {
  const label = ready ? (started ? 'Continue' : 'Start') : '\u00a0';
  return (
    <section className="learn-card card">
      <div className="learn-copy">
        <h2>LESSONS</h2>
        <p>Learn chess basics, fundamentals, techniques from your AI Coaches</p>
        <a className="btn primary learn-go" href="#/training/lessons">{label}</a>
      </div>
      <CoachGroup />
    </section>
  );
}
