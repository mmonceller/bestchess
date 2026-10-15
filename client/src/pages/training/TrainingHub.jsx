import { useEffect, useState } from 'react';
import { useProgress } from '../../training/progressStore.js';
import { PATHS, useTrainer } from '../../training/trainerStore.js';
import { guestStorage } from '../../training/guestStorage.js';
import { levelInfo, totalXp } from '../../training/xp.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PlayerHud from './hub/PlayerHud.jsx';
import GuestBanner from './hub/GuestBanner.jsx';
import WelcomeSheet from './hub/WelcomeSheet.jsx';
import LessonsCard from './home/LessonsCard.jsx';
import TermsSection from './home/TermsSection.jsx';
import PuzzleTraining from './home/PuzzleTraining.jsx';
import './training.css';
import './hub/hub.css';
import './home/home.css';

const WELCOME_SEEN = 'bc.welcomeSeen';

export default function TrainingHub() {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { trainer, update } = useTrainer();
  const [welcome, setWelcome] = useState(false);

  useEffect(() => {
    if (trainer && !trainer.path && !guestStorage.read(WELCOME_SEEN, false)) setWelcome(true);
  }, [trainer]);

  if (!trainer) return <div className="center muted" style={{ padding: 40 }}>Loading your training…</div>;

  const level = levelInfo(totalXp(progress, trainer));
  const started = Object.values(progress).some((row) => row);

  function closeWelcome() {
    guestStorage.write(WELCOME_SEEN, true);
    setWelcome(false);
  }

  function pickPath(id) {
    update((t) => ({ ...t, path: id, rating: t.games ? t.rating : PATHS[id].rating }));
    closeWelcome();
  }

  return (
    <div className="training-hub fade-in">
      {!user && <GuestBanner />}
      <PlayerHud
        name={user ? user.username : 'Guest player'}
        level={level}
        trainer={trainer}
        onChangePath={() => setWelcome(true)}
      />
      <LessonsCard started={started} ready={!progressLoading} />
      <TermsSection />
      <PuzzleTraining />
      {welcome && <WelcomeSheet isGuest={!user} current={trainer.path} onPick={pickPath} onClose={closeWelcome} />}
    </div>
  );
}
