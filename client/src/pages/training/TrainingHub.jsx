import { useProgress } from '../../training/progressStore.js';
import { useTrainer } from '../../training/trainerStore.js';
import { levelInfo, totalXp } from '../../training/xp.js';
import { useAuth } from '../../context/AuthContext.jsx';
import PlayerHud from './hub/PlayerHud.jsx';
import GuestBanner from './hub/GuestBanner.jsx';
import LessonsCard from './home/LessonsCard.jsx';
import TermsSection from './home/TermsSection.jsx';
import PuzzleTraining from './home/PuzzleTraining.jsx';
import './training.css';
import './hub/hub.css';
import './home/home.css';

export default function TrainingHub() {
  const { user } = useAuth();
  const { progress, loading: progressLoading } = useProgress();
  const { trainer } = useTrainer();

  if (!trainer) return <div className="center muted" style={{ padding: 40 }}>Loading your training…</div>;

  const level = levelInfo(totalXp(progress, trainer));
  const started = Object.values(progress).some((row) => row);

  return (
    <div className="training-hub fade-in">
      {!user && <GuestBanner />}
      <PlayerHud
        name={user ? user.username : 'Guest player'}
        level={level}
        trainer={trainer}
      />
      <LessonsCard started={started} ready={!progressLoading} />
      <TermsSection />
      <PuzzleTraining />
    </div>
  );
}
