import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useDaily } from '../../daily/DailyContext.jsx';
import { adminApi } from '../../api/endpoints.js';
import UserTable from './users/UserTable.jsx';
import HistoryDialog from './history/HistoryDialog.jsx';
import './admin.css';

export default function AdminPage() {
  const { user, ready } = useAuth();
  const daily = useDaily();
  const [users, setUsers] = useState(null);
  const [log, setLog] = useState([]);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (!user) { setUsers(null); setLog([]); return undefined; }
    let live = true;
    adminApi.users()
      .then((data) => { if (live) { setUsers(data.users); setLog(data.log || []); } })
      .catch((err) => { if (live) setError(err.message); });
    return () => { live = false; };
  }, [user]);

  const shown = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return users || [];
    return (users || []).filter((row) => row.username.toLowerCase().includes(needle));
  }, [users, query]);

  const openUser = users?.find((row) => row.id === openId) || null;
  const openLog = useMemo(
    () => log.filter((row) => row.userId === openId),
    [log, openId],
  );

  async function saveGoalPoints(id, points) {
    await adminApi.setGoalPoints(id, points);
    const data = await adminApi.users();
    setUsers(data.users);
    setLog(data.log || []);
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
          <p className="muted">Totals for each account. The eye opens that player’s point history.</p>
        </div>
        <label className="admin-search">
          <span className="muted small">Find a user</span>
          <input className="input" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Username" />
        </label>
      </header>
      <UserTable key={query} users={shown} onOpen={setOpenId} />
      {openUser && (
        <HistoryDialog
          user={openUser}
          rows={openLog}
          onClose={() => setOpenId(null)}
          onGoalPoints={saveGoalPoints}
        />
      )}
    </div>
  );
}
