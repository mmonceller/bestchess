import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';
import { adminApi } from '../../api/endpoints.js';
import UserCard from './users/UserCard.jsx';
import './admin.css';

export default function AdminPage() {
  const { user, ready } = useAuth();
  const daily = useDaily();
  const [users, setUsers] = useState(null);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  useEffect(() => {
    if (!user) { setUsers(null); return undefined; }
    let live = true;
    adminApi.users()
      .then((data) => { if (live) setUsers(data.users); })
      .catch((err) => { if (live) setError(err.message); });
    return () => { live = false; };
  }, [user]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users || [];
    return (users || []).filter((row) => row.username.toLowerCase().includes(needle));
  }, [users, query]);

  async function saveGoalPoints(id, points) {
    const saved = await adminApi.setGoalPoints(id, points);
    setUsers((list) => list.map((row) => (row.id === id ? { ...row, goalPoints: saved.points } : row)));
    if (id === user.id) daily?.refresh();
  }

  if (!ready) return null;
  if (!user) {
    return (
      <div className="card center admin-gate">
        <h1>Admin</h1>
        <p className="muted">Log in with the admin account to manage users.</p>
        <a className="btn primary" href="#/login?next=/admin">Log in</a>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card center admin-gate">
        <h1>Admin</h1>
        <p>{error}</p>
      </div>
    );
  }
  if (!users) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  return (
    <div className="admin fade-in">
      <header className="admin-head">
        <div>
          <h1>Users</h1>
          <p className="muted">Progress points come from lessons. Training points come from the Pattern Trainer. Goal points can be edited for now.</p>
        </div>
        <label className="admin-search">
          <span className="muted small">Find a user</span>
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Username" />
        </label>
      </header>
      <p className="muted small">{shown.length} {shown.length === 1 ? 'account' : 'accounts'}</p>
      {shown.map((row) => <UserCard key={row.id} user={row} onGoalPoints={saveGoalPoints} />)}
      {!shown.length && <p className="muted">No account matches that name.</p>}
    </div>
  );
}
