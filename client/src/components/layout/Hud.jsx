import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../icons/Icon.jsx';
import Logo from '../icons/Logo.jsx';
import SettingsModal from './SettingsModal.jsx';
import UserEmblem from '../skill/UserEmblem.jsx';
import ResumeGameButton from '../online/ResumeGameButton.jsx';
import { MODES } from './modes.js';
import './hud.css';

const SECTION_TITLE = {
  online: 'Online Friend',
  computer: 'Play with a Bot',
  training: 'Learn Chess',
  puzzles: 'Pattern Trainer',
  profile: 'My Profile',
  review: 'Game Review',
  replay: 'Game Review',
  login: 'Account',
  terms: 'Chess Terms',
};

/* Floating game-style controls instead of a website header: a home orb with a quick-jump menu, plus settings and profile. */
export default function Hud({ section, param }) {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const isHome = !section;

  useEffect(() => { setMenuOpen(false); }, [section]);
  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  return (
    <>
      <div className="hud">
        {!isHome && (
          <div className="hud-left">
            <button className={`orb orb-logo${menuOpen ? ' open' : ''}`} onClick={() => setMenuOpen((o) => !o)} aria-label="Open menu" aria-expanded={menuOpen}>
              <Logo size={38} />
            </button>
            {SECTION_TITLE[section] && (
              <span className="hud-title">{section === 'puzzles' && param === 'woodpecker' ? 'Woodpecker Method' : SECTION_TITLE[section]}</span>
            )}
          </div>
        )}
        <div className="hud-right">
          <ResumeGameButton currentCode={section === 'online' ? param?.toUpperCase() : null} refreshKey={`${section}/${param}`} />
          <button className="orb" onClick={() => setShowSettings(true)} aria-label="Settings"><Icon name="settings" size={20} /></button>
          {user && <UserEmblem user={user} href="#/profile" />}
        </div>
      </div>

      {menuOpen && (
        <div className="quick-menu" onClick={() => setMenuOpen(false)}>
          <nav className="quick-items" onClick={(e) => e.stopPropagation()}>
            <a href="#/" className="quick-item" style={{ '--i': 0, '--tint': '#9aa3b5' }}>
              <span className="quick-icon"><Icon name="home" size={22} /></span>Home
            </a>
            {MODES.map((m, i) => (
              <a key={m.id} href={m.href} className={`quick-item${section === m.id ? ' current' : ''}`} style={{ '--i': i + 1, '--tint': m.tint }}>
                <span className="quick-icon"><Icon name={m.icon} size={22} /></span>{m.label}
              </a>
            ))}
            <a href="#/terms" className={`quick-item${section === 'terms' ? ' current' : ''}`} style={{ '--i': MODES.length + 1, '--tint': '#3ccf7a' }}>
              <span className="quick-icon"><Icon name="book" size={22} /></span>Chess terms
            </a>
            <a href={user ? '#/profile' : '#/login'} className="quick-item" style={{ '--i': MODES.length + 2, '--tint': '#7c5cff' }}>
              <span className="quick-icon"><Icon name="user" size={22} /></span>{user ? 'My profile' : 'Log in'}
            </a>
          </nav>
        </div>
      )}

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  );
}
