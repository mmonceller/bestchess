import { useState } from 'react';
import Icon from '../../components/icons/Icon.jsx';

function ReadFlag({ read }) {
  return <span className={`read-flag${read ? ' is-read' : ''}`}>{read ? 'Read' : 'Unread'}</span>;
}

/* Collapsed to the title. Opening the row is what marks it read. */
export default function MessageRow({ title, read, onRead, children }) {
  const [open, setOpen] = useState(false);
  const seen = read || open;

  function toggle() {
    setOpen((value) => {
      const next = !value;
      if (next && !read) onRead?.();
      return next;
    });
  }

  return (
    <article className={`card message${seen ? '' : ' fresh'}${open ? ' open' : ''}`}>
      <button type="button" className="message-toggle" aria-expanded={open} onClick={toggle}>
        <h2>
          <Icon className="message-chevron" name="chevron" size={16} />
          <span>{title}</span>
        </h2>
        <ReadFlag read={seen} />
      </button>
      {open && <div className="message-body">{children}</div>}
    </article>
  );
}
