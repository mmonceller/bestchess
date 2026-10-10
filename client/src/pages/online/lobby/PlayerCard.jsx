import Icon from '../../../components/icons/Icon.jsx';

/* Who you play as: your account, or an editable display name for guests. */
export default function PlayerCard({ user, name, onNameChange }) {
  if (user) {
    return (
      <section className="card lobby-player">
        <span className="lobby-player-icon"><Icon name="user" size={18} /></span>
        <div>
          <div className="small muted">Playing as</div>
          <b>{user.username}</b>{user.rating ? <span className="muted small"> · {user.rating}</span> : null}
        </div>
      </section>
    );
  }
  return (
    <section className="card lobby-guest">
      <label className="small muted" htmlFor="gn">Your display name</label>
      <input id="gn" className="input" value={name} maxLength={20} onChange={(e) => onNameChange(e.target.value)} />
      <p className="small muted">
        Playing as a guest. <a href="#/login?next=/online" className="link">Log in</a> to save games and earn a rating.
      </p>
    </section>
  );
}
