import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import { COACHES } from '../../../training/coaches.js';

export default function CoachRoster() {
  return (
    <section className="coach-roster">
      <h2>Meet your coaches</h2>
      <p className="muted small">Every coach teaches in a different way. Find the one that clicks with you.</p>
      <div className="roster-row">
        {Object.values(COACHES).map((c) => (
          <div key={c.id} className="roster-card" style={{ '--coach': c.color }}>
            <CoachAvatar coach={c} size={54} />
            <b>{c.name}</b>
            <span className="roster-title">{c.title}</span>
            <p className="muted small">{c.style}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
