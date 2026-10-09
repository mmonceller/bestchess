import { GLYPH } from '../board/pieces.js';
import Icon from '../icons/Icon.jsx';
import { formatClock } from '../../utils/format.js';

export default function PlayerBar({ name, sub, icon, tint, color, captured = [], advantage = 0, clock, active, connected, thinking }) {
  const low = clock != null && clock < 20_000;
  return (
    <div className={`player-bar${active ? ' active' : ''}`}>
      {icon
        ? <span className="player-icon" style={{ '--tint': tint || 'var(--accent)' }}><Icon name={icon} size={18} /></span>
        : <span className={`player-dot ${color === 'w' ? 'white' : 'black'}`} />}
      <div className="player-info">
        <div className="player-name">
          {name}
          {connected === false && <span className="badge offline">offline</span>}
          {thinking && <span className="thinking"><i /><i /><i /></span>}
        </div>
        <div className="player-sub">
          {sub && <span>{sub}</span>}
          <span className="captured">
            {captured.map((t, i) => <span key={i} className={`piece-mini ${color === 'w' ? 'black' : 'white'}`}>{GLYPH[t]}</span>)}
            {advantage > 0 && <b className="adv">+{advantage}</b>}
          </span>
        </div>
      </div>
      {clock != null && <div className={`clock${active ? ' running' : ''}${low ? ' low' : ''}`}>{formatClock(clock)}</div>}
    </div>
  );
}
