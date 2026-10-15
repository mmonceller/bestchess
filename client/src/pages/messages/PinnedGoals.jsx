import { useEffect, useState } from 'react';
import { formatDateTime } from '../../utils/format.js';

/* The live goal list, kept above the inbox. The clock is the current time, not when the note was first sent. */
export default function PinnedGoals({ goals }) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!goals?.length) return null;
  return (
    <article className="card message pinned">
      <div className="message-top">
        <h2><a href="#/goals">Today's goals</a></h2>
        <time className="message-when" dateTime={new Date(now).toISOString()}>{formatDateTime(now, { seconds: true, date: 'always' })}</time>
      </div>
      <ul className="pin-goals">
        {goals.map((goal) => {
          const width = `${Math.min(100, Math.round((goal.progress / goal.target) * 100))}%`;
          return (
            <li key={goal.id}>
              <a href={goal.href} className={goal.done ? 'done' : ''}>
                <span className="pin-title">{goal.title}</span>
                <span className="pin-count">{goal.progress}/{goal.target}</span>
                <span className="pin-bar" aria-hidden="true"><span style={{ width }} /></span>
              </a>
            </li>
          );
        })}
      </ul>
    </article>
  );
}
