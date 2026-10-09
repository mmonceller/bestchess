import { createPortal } from 'react-dom';

/* Rendered into <body> so animated (transformed) ancestors can't trap the fixed backdrop. */
export default function Modal({ children, onClose }) {
  return createPortal(
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal card" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        {children}
      </div>
    </div>,
    document.body,
  );
}
