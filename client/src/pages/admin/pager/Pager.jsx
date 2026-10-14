import { PAGE_SIZE } from '../paging.js';

export default function Pager({ page, pages, total, onPage }) {
  const from = total ? page * PAGE_SIZE + 1 : 0;
  const to = Math.min(total, (page + 1) * PAGE_SIZE);
  return (
    <div className="admin-pager">
      <span className="muted small">{total ? `${from}–${to} of ${total}` : '0'}</span>
      <button className="btn small" type="button" disabled={page <= 0} onClick={() => onPage(page - 1)}>Previous</button>
      <span className="muted small">Page {page + 1} of {pages}</span>
      <button className="btn small" type="button" disabled={page >= pages - 1} onClick={() => onPage(page + 1)}>Next</button>
    </div>
  );
}
