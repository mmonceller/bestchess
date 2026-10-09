import Modal from '../ui/Modal.jsx';
import { BOARD_THEMES, useSettings } from '../../context/SettingsContext.jsx';
import './layout.css';

export default function SettingsModal({ onClose }) {
  const { settings, update } = useSettings();
  return (
    <Modal onClose={onClose}>
      <h2>Settings</h2>
      <span className="label">Board theme</span>
      <div className="theme-grid">
        {Object.entries(BOARD_THEMES).map(([id, t]) => (
          <button
            key={id}
            className={`theme-swatch${settings.boardTheme === id ? ' active' : ''}`}
            onClick={() => update({ boardTheme: id })}
          >
            <span style={{ background: `linear-gradient(135deg, ${t.light} 50%, ${t.dark} 50%)` }} />
            {t.name}
          </button>
        ))}
      </div>
      <label className="toggle-row">
        <input type="checkbox" checked={settings.sound} onChange={(e) => update({ sound: e.target.checked })} />
        Move sounds
      </label>
      <label className="toggle-row">
        <input type="checkbox" checked={settings.showCoords} onChange={(e) => update({ showCoords: e.target.checked })} />
        Board coordinates
      </label>
      <div className="row" style={{ marginTop: 16 }}>
        <span className="spacer" />
        <button className="btn primary" onClick={onClose}>Done</button>
      </div>
    </Modal>
  );
}
