import { useEffect, useMemo, useState } from 'react';
import { TRACKS, lessonsInTrack } from '../../../training/lessons/index.js';
import { useProgress } from '../../../training/progressStore.js';
import { PATHS, useTrainer } from '../../../training/trainerStore.js';
import { guestStorage } from '../../../training/guestStorage.js';
import { useMastery } from '../../../training/mastery/useMastery.js';
import { useAuth } from '../../../context/AuthContext.jsx';
import { tracksForSkill } from '../../../training/skill/tiers.js';
import Icon from '../../../components/icons/Icon.jsx';
import GuestBanner from '../hub/GuestBanner.jsx';
import WelcomeSheet from '../hub/WelcomeSheet.jsx';
import LessonPath from '../hub/LessonPath.jsx';
import LessonSheet from '../hub/LessonSheet.jsx';
import CoachRoster from '../hub/CoachRoster.jsx';
import MasteryChecklist from '../mastery/MasteryChecklist.jsx';
import MasteryModal from '../mastery/MasteryModal.jsx';
import MasteryUnlocked from '../mastery/MasteryUnlocked.jsx';
import '../training.css';
import '../hub/hub.css';

const MAX_TABS_PER_ROW = 7;
const WELCOME_SEEN = 'bc.welcomeSeen';

function recommendedTrack(startTrack, progress, tracks, lessonsFor) {
  const start = Math.max(0, tracks.findIndex((t) => t.id === startTrack));
  const ordered = [...tracks.slice(start), ...tracks.slice(0, start)];
  return (ordered.find((t) => lessonsFor(t.id).some((l) => !progress[l.id])) || ordered[0]).id;
}

/* Worlds, lesson paths and the coach descriptions. */
export default function LessonsPage() {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { trainer, update } = useTrainer();
  const mastery = useMastery(progress, trainer);
  const [trackId, setTrackId] = useState(null);
  const [preview, setPreview] = useState(null);
  const [welcome, setWelcome] = useState(false);
  const [gate, setGate] = useState(false);

  useEffect(() => {
    if (trainer && !trainer.path && !guestStorage.read(WELCOME_SEEN, false)) setWelcome(true);
  }, [trainer]);

  function closeWelcome() {
    guestStorage.write(WELCOME_SEEN, true);
    setWelcome(false);
  }

  function pickPath(id) {
    update((t) => ({ ...t, path: id, rating: t.games ? t.rating : PATHS[id].rating }));
    setTrackId(PATHS[id].track);
    closeWelcome();
  }

  const lessonsFor = lessonsInTrack;
  const tracks = TRACKS.filter((t) => !t.gated || mastery.visible);
  const playable = TRACKS.filter((t) => !t.gated || mastery.unlocked);
  const skillTracks = tracksForSkill(user?.skill);
  const pathTrack = PATHS[trainer?.path]?.track;
  const pathHasWork = pathTrack && lessonsFor(pathTrack).some((l) => !progress[l.id]);
  const startTrack = (pathHasWork && playable.some((t) => t.id === pathTrack))
    ? pathTrack
    : (skillTracks?.find((id) => playable.some((t) => t.id === id)) || pathTrack);
  const recommended = useMemo(
    () => (trainer && !progressLoading ? recommendedTrack(startTrack, progress, playable, lessonsFor) : null),
    [trainer, progress, progressLoading, playable.length, startTrack], // eslint-disable-line react-hooks/exhaustive-deps
  );
  const activeTrack = (trackId && tracks.some((t) => t.id === trackId) && trackId) || recommended || TRACKS[0].id;
  const track = TRACKS.find((t) => t.id === activeTrack);
  const locked = track.gated && !mastery.unlocked;
  const lessons = lessonsFor(activeTrack);
  const nextId = lessons.find((l) => !progress[l.id])?.id;

  if (!trainer) return <div className="center muted" style={{ padding: 40 }}>Loading your training…</div>;

  return (
    <div className="training-hub fade-in">
      <div className="lessons-toolbar">
        <a className="back-learning" href="#/training"><Icon name="arrowLeft" size={16} /> Back to learning</a>
        <button type="button" className="link small" onClick={() => setWelcome(true)}>Change starting point</button>
      </div>
      {!user && <GuestBanner />}

      <section className="worlds">
        <div className="world-tabs" role="tablist" style={{ '--tabs': tracks.length > MAX_TABS_PER_ROW ? Math.ceil(tracks.length / 2) : tracks.length }}>
          {tracks.map((t) => {
            const list = lessonsFor(t.id);
            const done = list.filter((l) => progress[l.id]).length;
            const isLocked = t.gated && !mastery.unlocked;
            const isNew = t.fresh && !isLocked && done < list.length;
            return (
              <button
                key={t.id}
                role="tab"
                aria-selected={t.id === activeTrack}
                className={`world-tab${t.id === activeTrack ? ' active' : ''}${t.gated ? ' gated' : ''}`}
                style={{ '--track': t.color }}
                onClick={() => setTrackId(t.id)}
              >
                {isNew && <span className="world-new">New</span>}
                <span className="world-icon"><Icon name={isLocked ? 'lock' : t.icon} size={22} /></span>
                <span className="world-name">{t.name}</span>
                <span className="world-count">{isLocked ? 'Locked' : `${done}/${list.length}`}</span>
                {t.id === recommended && <span className="world-pin" title={skillTracks ? 'Recommended for your skill level' : 'Recommended for you'} />}
              </button>
            );
          })}
        </div>
        {!mastery.unlocked && (
          <button type="button" className="link small unlock-master" onClick={() => setGate(true)}>
            Unlock Master Class course
          </button>
        )}
        <div className="world-head" style={{ '--track': track.color }}>
          <h2>{track.name}{track.fresh && nextId && <span className="world-new">New</span>}</h2>
          <p className="muted">{track.blurb}</p>
        </div>
        {locked ? (
          <MasteryChecklist mastery={mastery} />
        ) : (
          <>
            {track.gated && !lessons.some((l) => progress[l.id]) && <MasteryUnlocked />}
            <LessonPath lessons={lessons} progress={progress} nextId={nextId} color={track.color} markNew={track.fresh} onOpen={setPreview} />
            {!nextId && (
              <div className="world-done card">
                <Icon name="trophy" size={28} />
                <div>
                  <b>World complete!</b>
                  <p className="muted small">Open any finished lesson to review your answers and play its bonus round, or keep sharpening your eye in the Pattern Trainer.</p>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      <CoachRoster />
      {preview && <LessonSheet lesson={preview} progress={progress} onClose={() => setPreview(null)} />}
      {welcome && <WelcomeSheet isGuest={!user} current={trainer.path} onPick={pickPath} onClose={closeWelcome} />}
      {gate && <MasteryModal mastery={mastery} onClose={() => setGate(false)} />}
    </div>
  );
}
