/* The live goal list, kept above the inbox. Each line is one of today's goals. */
export default function PinnedGoals({ goals, at, when }) {
  if (!goals?.length) return null;
  return (
    <article className="card message pinned">
      <div className="message-top">
        <h2><a href="#/goals">Today's goals</a></h2>
        {at ? <time className="message-when" dateTime={new Date(at).toISOString()}>{when(at)}</time> : null}
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
