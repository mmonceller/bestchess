import { useEffect, useState } from 'react';
import { LEVELS, getLevel } from '../../engine/levels.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { levelsBelowSkill, recommendedLevel, winWontRaiseSkill } from '../../training/skill/tiers.js';
import Icon from '../../components/icons/Icon.jsx';
import SkillGapNote from '../../components/skill/SkillGapNote.jsx';
import ColorPicker from '../../components/game/ColorPicker.jsx';
import ResumeList from '../../components/resume/ResumeList.jsx';
import { useNow } from '../../hooks/useNow.js';
import SkillNote from './SkillNote.jsx';
import { expiryClock } from './expiry/inactivity.js';
import { MAX_BOT_GAMES } from './savedGame.js';
import './computer.css';

const LEVEL_KEY = 'bc.lastLevel';

export default function ComputerSetup({ onStart, onResume, onResign, saved = [], notice, preferredLevel = null }) {
  const { user } = useAuth();
  const recommended = user ? recommendedLevel(user.skill) : null;
  const [level, setLevel] = useState(() => preferredLevel || recommended || Number(localStorage.getItem(LEVEL_KEY)) || 3);
  const [picked, setPicked] = useState(() => preferredLevel != null);
  const [color, setColor] = useState('w');
  const now = useNow(1000);

  useEffect(() => { if (recommended && !picked) setLevel(recommended); }, [recommended, picked]);

  function choose(id) {
    setPicked(true);
    setLevel(id);
  }

  const atLimit = saved.length >= MAX_BOT_GAMES;

  function start() {
    if (atLimit) return;
    localStorage.setItem(LEVEL_KEY, String(level));
    const c = color === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : color;
    onStart({ color: c, level });
  }

  const items = saved.map((g) => {
    const bot = getLevel(g.level);
    const clock = expiryClock(g, now);
    return {
      id: g.id,
      name: bot.name,
      detail: `Lv ${g.level} · ${clock}`,
      blurb: <>You have an unfinished game against <b>{bot.name}</b> (level {g.level}). Expires in {clock}.</>,
      onClick: () => onResume(g),
      onResign: () => onResign(g),
      resignConfirm: `This counts as a loss against ${bot.name}.`,
    };
  });

  return (
    <div className="setup card fade-in">
      <h1>Play with a Bot</h1>
      <p className="muted">Pick how strong your opponent should be. The bot runs right in your browser, so there's no waiting.</p>

      {notice}
      <ResumeList items={items} label={`Unfinished games (${saved.length}/${MAX_BOT_GAMES})`} />
      {atLimit && (
        <p className="muted small">You already have {MAX_BOT_GAMES} unfinished bot games. Resume or resign one to start another.</p>
      )}

      {user && <SkillNote skill={user.skill} recommended={recommended} chosen={level} />}
      {user && winWontRaiseSkill(user.skill, level) && (
        <SkillGapNote>
          {getLevel(level).name} is {levelsBelowSkill(user.skill, level)} levels below your skill. A win will not add skill points. A loss may lower them.
        </SkillGapNote>
      )}

      <span className="label">Difficulty</span>
      <div className="level-grid">
        {LEVELS.map((l) => (
          <button key={l.id} className={`level-card${level === l.id ? ' active' : ''}`} style={{ '--tint': l.tint }} onClick={() => choose(l.id)}>
            {l.id === recommended && <span className="level-rec">Recommended</span>}
            <span className="level-icon"><Icon name={l.icon} size={22} /></span>
            <b>{l.name}</b>
            <span className="muted small">Level {l.id} · {l.elo}</span>
          </button>
        ))}
      </div>

      <span className="label">Play as</span>
      <ColorPicker value={color} onChange={setColor} />

      <button className="btn primary block" style={{ marginTop: 18 }} onClick={start} disabled={atLimit}>
        <Icon name="play" size={16} /> Start game
      </button>
    </div>
  );
}
