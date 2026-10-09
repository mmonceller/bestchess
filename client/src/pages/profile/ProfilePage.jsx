import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { gamesApi } from '../../api/endpoints.js';
import { useProgress } from '../../training/progressStore.js';
import { LESSONS, TRACKS } from '../../training/lessons/index.js';
import { getCoach } from '../../training/coaches.js';
import Stars from '../training/components/Stars.jsx';
import Icon from '../../components/icons/Icon.jsx';
import CoachAvatar from '../../components/icons/CoachAvatar.jsx';
import { useTrainer } from '../../training/trainerStore.js';
import { evaluateMastery } from '../../training/mastery/criteria.js';
import { levelInfo, totalXp } from '../../training/xp.js';
import { formatDate } from '../../utils/format.js';
import { navigate } from '../../router/router.js';
import UserEmblem from '../../components/skill/UserEmblem.jsx';
import SkillCard from './SkillCard.jsx';
import ActiveGamesCard from '../../components/online/ActiveGamesCard.jsx';
import '../../components/game/game.css';
import './profile.css';

const RESULT_LABEL = { win: 'Win', loss: 'Loss', draw: 'Draw' };

export default function ProfilePage() {
  const { user, ready, logout, refresh } = useAuth();
  const { progress } = useProgress();
  const { trainer } = useTrainer();
  const [games, setGames] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) return;
    refresh();
    gamesApi.list().then((d) => setGames(d.games)).catch(() => setGames([]));
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!ready) return null;
  if (!user) {
    return (
      <div className="card center" style={{ maxWidth: 420, margin: '30px auto' }}>
        <h2>Your profile</h2>
        <p className="muted">Log in to record your games and training lessons.</p>
        <a className="btn primary" href="#/login?next=/profile">Log in or sign up</a>
      </div>
    );
  }

  const { wins, losses, draws } = user.stats;
  const total = wins + losses + draws;
  const winRate = total ? Math.round((wins / total) * 100) : 0;
  const stars = Object.values(progress).reduce((n, p) => n + (p.stars || 0), 0);
  const { unlocked: masterUnlocked } = evaluateMastery({ progress, trainer, games });
  const tracks = TRACKS.filter((t) => !t.gated || masterUnlocked);
  const lessons = LESSONS.filter((l) => tracks.some((t) => t.id === l.track));
  const done = lessons.filter((l) => progress[l.id]).length;
  const level = levelInfo(totalXp(progress, trainer));
  const shown = (games || []).filter((g) => filter === 'all' || g.mode === filter);

  return (
    <div className="profile fade-in">
      <div className="profile-head card">
        <UserEmblem user={user} size={72} />
        <div className="spacer-col">
          <h1>{user.username}</h1>
          <div className="muted">Member since {formatDate(user.createdAt)}</div>
          <div className="profile-level icon-text"><Icon name="bolt" size={15} /> Level {level.level} · {level.title}</div>
        </div>
        <button className="btn ghost icon-text" onClick={async () => { await logout(); navigate('/'); }}><Icon name="logout" size={18} /> Log out</button>
      </div>

      <ActiveGamesCard />
      <SkillCard skill={user.skill} />

      <div className="stat-grid">
        <div className="stat card"><b>{user.rating}</b><span>Online rating</span></div>
        <div className="stat card"><b>{total}</b><span>Games played</span></div>
        <div className="stat card"><b>{winRate}%</b><span>Win rate</span></div>
        <div className="stat card"><b>{wins}/{draws}/{losses}</b><span>W / D / L</span></div>
        <div className="stat card"><b>{done}/{lessons.length}</b><span>Lessons done</span></div>
        <div className="stat card"><b className="icon-text">{stars} <Icon name="star" size={18} className="star-gold" /></b><span>Training stars</span></div>
        <div className="stat card"><b>{trainer?.rating ?? '–'}</b><span>Puzzle rating</span></div>
        <div className="stat card"><b>{trainer?.solved ?? 0}</b><span>Puzzles solved</span></div>
        <div className="stat card"><b>{trainer?.bestStreak ?? 0}</b><span>Best puzzle streak</span></div>
      </div>

      <div className="profile-grid">
        <section className="card">
          <div className="row">
            <h2 style={{ margin: 0 }}>Game history</h2>
            <span className="spacer" />
            <div className="segmented small-seg">
              {['all', 'computer', 'online'].map((f) => (
                <button key={f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>{f[0].toUpperCase() + f.slice(1)}</button>
              ))}
            </div>
          </div>
          {games === null && <div className="muted" style={{ padding: 16 }}><span className="spinner" /></div>}
          {games && !shown.length && <p className="muted" style={{ marginTop: 12 }}>No games yet. <a className="link" href="#/computer">Play one now</a></p>}
          <div className="game-list">
            {shown.map((g) => (
              <a key={g.id} href={`#/review/${g.id}`} className="game-row">
                <span className="game-mode"><Icon name={g.mode === 'online' ? 'friends' : 'bot'} size={18} /></span>
                <span className={`player-dot ${g.color === 'w' ? 'white' : 'black'}`} />
                <div className="game-main">
                  <b>vs {g.opponent}</b>
                  <span className="muted small">{formatDate(g.date)} · {Math.ceil(g.moves / 2)} moves · {g.reason}</span>
                </div>
                {g.reviewed && <span className="review-acc" title="Reviewed: your accuracy"><Icon name="target" size={14} />{g.accuracy ?? '–'}%</span>}
                {g.ratingChange != null && <span className={`delta ${g.ratingChange >= 0 ? 'up' : 'down'}`}>{g.ratingChange >= 0 ? '+' : ''}{g.ratingChange}</span>}
                <span className={`result-pill ${g.result}`}>{RESULT_LABEL[g.result]}</span>
              </a>
            ))}
          </div>
        </section>

        <section className="card">
          <h2>Training lessons</h2>
          {tracks.map((t) => (
            <div key={t.id} className="track-progress">
              <div className="muted small icon-text track-label"><Icon name={t.icon} size={16} /> {t.name}</div>
              {LESSONS.filter((l) => l.track === t.id).map((l) => (
                <a key={l.id} href={`#/training/${l.id}`} className="lesson-row" style={{ '--coach': getCoach(l.coach).color }}>
                  <CoachAvatar coach={getCoach(l.coach)} size={28} />
                  <span className="lesson-row-title">{l.title}</span>
                  {progress[l.id] ? <Stars value={progress[l.id].stars} /> : <span className="muted small">Not started</span>}
                </a>
              ))}
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
