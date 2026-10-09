import { useMemo, useState } from 'react';
import CoachAvatar from '../../../components/icons/CoachAvatar.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import { COACHES } from '../../../training/coaches.js';
import { lessonsByCoach } from '../../../training/coachLessons.js';
import './coachRoster.css';

/* Pick a coach from the row of faces to see how they teach and where you'll meet them. */
export default function CoachRoster() {
  const coaches = Object.values(COACHES);
  const [activeId, setActiveId] = useState(coaches[0].id);
  const lessons = useMemo(lessonsByCoach, []);
  const coach = COACHES[activeId];
  const info = lessons[coach.id] || { count: 0, tracks: [] };

  return (
    <section className="coach-roster">
      <h2>Meet your coaches</h2>
      <p className="muted small">Every coach teaches in a different way. Tap a coach to get to know them.</p>

      <div className="roster-picker" role="tablist" aria-label="Coaches">
        {coaches.map((c) => (
          <button
            key={c.id}
            type="button"
            role="tab"
            aria-selected={c.id === activeId}
            className={`roster-pick${c.id === activeId ? ' active' : ''}`}
            style={{ '--coach': c.color }}
            onClick={() => setActiveId(c.id)}
          >
            <CoachAvatar coach={c} size={46} />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      <article className="roster-detail pop-in" role="tabpanel" key={coach.id} style={{ '--coach': coach.color }}>
        <CoachAvatar coach={coach} size={88} className="roster-detail-avatar" />
        <div className="roster-detail-body">
          <span className="roster-title">{coach.title}</span>
          <h3>{coach.name}</h3>
          <p className="roster-style">{coach.style}</p>
          <blockquote className="roster-quote">“{coach.intro}”</blockquote>
          {info.count > 0 && (
            <div className="roster-tracks">
              <span className="muted small"><Icon name="book" size={14} /> Teaches {info.count} lesson{info.count > 1 ? 's' : ''} in</span>
              {info.tracks.map((t) => (
                <span key={t.id} className="roster-track" style={{ '--c': t.color }}>
                  <Icon name={t.icon} size={13} /> {t.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </section>
  );
}
