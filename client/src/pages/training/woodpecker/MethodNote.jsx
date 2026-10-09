import Icon from '../../../components/icons/Icon.jsx';

/* The idea behind the method, in our own words. */
export default function MethodNote() {
  return (
    <section className="wp-method card">
      <Icon name="retry" size={22} />
      <div>
        <b>How it works</b>
        <ol>
          <li>Solve every exercise in the set, in order. In the first cycle, take your time — getting them right matters more than speed.</li>
          <li>When you finish, start again with the same set. Try to finish each new cycle in about half the time of the last one.</li>
          <li>Seeing the same ideas again and again makes them automatic, so in your own games the winning idea jumps out quickly.</li>
        </ol>
        <p className="muted small">Your clock only runs while an exercise is on the board. Every line was checked with our engine.</p>
      </div>
    </section>
  );
}
