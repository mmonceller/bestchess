import { useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import Pager from '../pager/Pager.jsx';
import { pageCount, pageSlice } from '../paging.js';

const COLUMNS = [
  { key: 'skill', short: 'Skill', title: 'Skill points', value: (user) => user.skill ?? '–' },
  { key: 'online', short: 'Online', title: 'Online rating', value: (user) => user.onlineRating },
  { key: 'stars', short: 'Stars', title: 'Training stars', value: (user) => user.stars },
  { key: 'goal', short: 'Goals', title: 'Goal points', value: (user) => user.goalPoints },
  { key: 'puzzles', short: 'Puzzles', title: 'Puzzles solved', value: (user) => user.puzzlesSolved },
  { key: 'lessons', short: 'Lessons', title: 'Lessons done', value: (user) => user.lessonsDone },
  { key: 'progress', short: 'Progress', title: 'Progress points', value: (user) => user.progressPoints },
  { key: 'training', short: 'Training', title: 'Training points', value: (user) => user.trainingPoints },
  { key: 'rating', short: 'Rating', title: 'Puzzle rating', value: (user) => user.puzzleRating ?? '–' },
];

export default function UserTable({ users, onOpen }) {
  const [page, setPage] = useState(0);
  const pages = pageCount(users.length);
  const safePage = Math.min(page, pages - 1);
  const rows = pageSlice(users, safePage);

  return (
    <section className="card admin-users">
      {!users.length && <p className="muted">No account matches that name.</p>}
      {users.length > 0 && (
        <table className="admin-table">
          <thead>
            <tr>
              <th scope="col">Username</th>
              {COLUMNS.map((column) => (
                <th key={column.key} scope="col" title={column.title}>{column.short}</th>
              ))}
              <th scope="col" className="admin-act"><span className="admin-act-label">History</span></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((user) => (
              <tr key={user.id}>
                <th scope="row">{user.username}</th>
                {COLUMNS.map((column) => (
                  <td key={column.key} data-label={column.title}>{column.value(user)}</td>
                ))}
                <td className="admin-act" data-label="History">
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label={`View history for ${user.username}`}
                    onClick={() => onOpen(user.id)}
                  >
                    <Icon name="eye" size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <Pager page={safePage} pages={pages} total={users.length} onPage={setPage} />
    </section>
  );
}
