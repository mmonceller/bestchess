import { useEffect, useState } from 'react';
import Modal from '../../../components/ui/Modal.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import { formatDateTime } from '../../../utils/format.js';
import GoalPointsEditor from '../goalPoints/GoalPointsEditor.jsx';
import Pager from '../pager/Pager.jsx';
import { pageCount, pageSlice } from '../paging.js';

function signed(n) {
  if (n > 0) return `+${n}`;
  if (n < 0) return String(n);
  return '0';
}

export default function HistoryDialog({ user, rows, onClose, onGoalPoints }) {
  const [page, setPage] = useState(0);

  useEffect(() => { setPage(0); }, [user.id]);

  useEffect(() => {
    const onKey = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const pages = pageCount(rows.length);
  const safePage = Math.min(page, pages - 1);
  const shown = pageSlice(rows, safePage);

  return (
    <Modal onClose={onClose} className="admin-history-modal">
      <header className="admin-history-head">
        <div>
          <h2>{user.username}</h2>
          <p className="muted small">Increases and decreases, newest first.</p>
        </div>
        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close history">
          <Icon name="close" size={16} />
        </button>
      </header>
      <GoalPointsEditor
        username={user.username}
        points={user.goalPoints}
        onSave={(points) => onGoalPoints(user.id, points)}
      />
      <h3>History</h3>
      {!rows.length && <p className="muted">No point history yet.</p>}
      {rows.length > 0 && (
        <div className="history-table">
          <div className="history-head">
            <span>When</span>
            <span>Points</span>
            <span>Change</span>
            <span>After</span>
            <span>What happened</span>
          </div>
          {shown.map((row) => (
            <article key={row.id} className={`history-row${row.opening ? ' is-opening' : ''}`}>
              <time dateTime={new Date(row.at).toISOString()} data-label="When">{formatDateTime(row.at, { date: 'always' })}</time>
              <span data-label="Points">{row.label}</span>
              <span data-label="Change" className={row.delta > 0 ? 'point-up' : row.delta < 0 ? 'point-down' : ''}>{signed(row.delta)}</span>
              <span data-label="After">{row.balance == null ? '–' : row.balance}</span>
              <p className="point-note" data-label="What happened">{row.note}</p>
            </article>
          ))}
        </div>
      )}
      <Pager page={safePage} pages={pages} total={rows.length} onPage={setPage} />
    </Modal>
  );
}
