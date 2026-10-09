import { useEffect, useMemo, useState } from 'react';
import { LESSONS, TRACKS, lessonsInTrack } from '../../training/lessons/index.js';
import { useProgress } from '../../training/progressStore.js';
import { PATHS, useTrainer } from '../../training/trainerStore.js';
import { guestStorage } from '../../training/guestStorage.js';
import { levelInfo, totalXp } from '../../training/xp.js';
import { useAuth } from '../../context/AuthContext.jsx';
import Icon from '../../components/icons/Icon.jsx';
import PlayerHud from './hub/PlayerHud.jsx';
import GuestBanner from './hub/GuestBanner.jsx';
import WelcomeSheet from './hub/WelcomeSheet.jsx';
import LessonPath from './hub/LessonPath.jsx';
import LessonSheet from './hub/LessonSheet.jsx';
import PuzzleCard from './hub/PuzzleCard.jsx';
import CoachRoster from './hub/CoachRoster.jsx';
import './training.css';
import './hub/hub.css';

const WELCOME_SEEN = 'bc.welcomeSeen';

/* The track the player should focus on: their chosen path, or the next one with unfinished lessons. */
function recommendedTrack(path, progress) {
  const start = Math.max(0, TRACKS.findIndex((t) => t.id === PATHS[path]?.track));
  const ordered = [...TRACKS.slice(start), ...TRACKS.slice(0, start)];
  return (ordered.find((t) => lessonsInTrack(t.id).some((l) => !progress[l.id])) || ordered[0]).id;
}

export default function TrainingHub() {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { trainer, update } = useTrainer();
  const [trackId, setTrackId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    if (trainer && !trainer.path && !guestStorage.read(WELCOME_SEEN, false)) setWelcome(true);
  }, [trainer]);

  const recommended = useMemo(
    () => (trainer && !progressLoading ? recommendedTrack(trainer.path, progress) : null),
    [trainer, progress, progressLoading],
  );
  const activeTrack = trackId || recommended || TRACKS[0].id;
  const track = TRACKS.find((t) => t.id === activeTrack);
  const lessons = lessonsInTrack(activeTrack);
  const nextId = lessons.find((l) => !progress[l.id])?.id;

  if (!trainer) return <div className="center muted" style={{ padding: 40 }}>Loading your training…</div>;

  const stars = Object.values(progress).reduce((n, p) => n + (p.stars || 0), 0);
  const level = levelInfo(totalXp(progress, trainer));

  function closeWelcome() {
    guestStorage.write(WELCOME_SEEN, true);
    setWelcome(false);
  }

  function pickPath(id) {
    update((t) => ({ ...t, path: id, rating: t.games ? t.rating : PATHS[id].rating }));
    setTrackId(PATHS[id].track);
    closeWelcome();
  }

  return (
    <div className="training-hub fade-in">
      {!user && <GuestBanner />}
      <PlayerHud
        name={user ? user.username : 'Guest player'}
        level={level}
        stars={stars}
        maxStars={LESSONS.length * 3}
        trainer={trainer}
        onChangePath={() => setWelcome(true)}
      />
      <PuzzleCard trainer={trainer} />

      <section className="worlds">
        <div className="world-tabs" role="tablist">
          {TRACKS.map((t) => {
            const list = lessonsInTrack(t.id);
            const done = list.filter((l) => progress[l.id]).length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === activeTrack}
                className={`world-tab${t.id === activeTrack ? ' active' : ''}`}
                style={{ '--track': t.color }}
                onClick={() => setTrackId(t.id)}
              >
                <span className="world-icon"><Icon name={t.icon} size={22} /></span>
                <span className="world-name">{t.name}</span>
                <span className="world-count">{done}/{list.length}</span>
                {t.id === recommended && <span className="world-pin" title="Recommended for you" />}
              </button>
            );
          })}
        </div>
        <div className="world-head" style={{ '--track': track.color }}>
          <h2>{track.name}</h2>
          <p className="muted">{track.blurb}</p>
        </div>
        <LessonPath lessons={lessons} progress={progress} nextId={nextId} color={track.color} onOpen={setPreview} />
        {!nextId && (
          <div className="world-done card">
            <Icon name="trophy" size={28} />
            <div>
              <b>World complete!</b>
              <p className="muted small">Replay lessons to earn 3 stars, or keep sharpening your eye in the Pattern Trainer.</p>
            </div>
          </div>
        )}
      </section>

      <CoachRoster />

      {preview && <LessonSheet lesson={preview} progress={progress} onClose={() => setPreview(null)} />}
      {welcome && <WelcomeSheet isGuest={!user} current={trainer.path} onPick={pickPath} onClose={closeWelcome} />}
    </div>
  );
}
