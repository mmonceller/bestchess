import { lazy, Suspense, useState } from 'react';
import Icon from '../icons/Icon.jsx';
import './notation.css';

const NotationGuide = lazy(() => import('./NotationGuide.jsx'));

/* Small "How to read moves" link that opens the notation guide. */
export default function NotationGuideButton({ label = 'How to read moves', className = '' }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className={`notation-guide-btn ${className}`} onClick={() => setOpen(true)}>
        <Icon name="info" size={14} /> {label}
      </button>
      {open && (
        <Suspense fallback={null}>
          <NotationGuide onClose={() => setOpen(false)} />
        </Suspense>
      )}
    </>
  );
}
