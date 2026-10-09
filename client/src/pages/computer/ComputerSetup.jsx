import { useState } from 'react';
import { LEVELS } from '../../engine/levels.js';
import Icon from '../../components/icons/Icon.jsx';
import ColorPicker from '../../components/game/ColorPicker.jsx';
import './computer.css';

const LEVEL_KEY = 'bc.lastLevel';

export default function ComputerSetup({ onStart, onResume, saved }) {
  const [level, setLevel] = useState(() => Number(localStorage.getItem(LEVEL_KEY)) || 3);
  const [color, setColor] = useState('w');

  function start() {
    localStorage.setItem(LEVEL_KEY, String(level));
    const c = color === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : color;
    onStart({ color: c, level });
  }

  return (
    <div className="setup card fade-in">
      <h1>Play with a Bot</h1>
      <p className="muted">Pick how strong your opponent should be. The bot runs right in your browser, so there's no waiting.</p>

      {saved && (
        <div className="resume-banner">
          <span>You have an unfinished game against level {saved.level}.</span>
          <button className="btn small primary" onClick={onResume}><Icon name="play" size={14} /> Resume</button>
        </div>
      )}

      <span className="label">Difficulty</span>
      <div className="level-grid">
        {LEVELS.map((l) => (
          <button key={l.id} className={`level-card${level === l.id ? ' active' : ''}`} style={{ '--tint': l.tint }} onClick={() => setLevel(l.id)}>
            <span className="level-icon"><Icon name={l.icon} size={22} /></span>
            <b>{l.name}</b>
            <span className="muted small">Level {l.id} · {l.elo}</span>
          </button>
        ))}
      </div>

      <span className="label">Play as</span>
      <ColorPicker value={color} onChange={setColor} />

      <button className="btn primary block" style={{ marginTop: 18 }} onClick={start}><Icon name="play" size={16} /> Start game</button>
    </div>
  );
}
