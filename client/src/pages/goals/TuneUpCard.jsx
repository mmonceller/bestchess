import { useTrainer } from '../../training/trainerStore.js';
import { useProgress } from '../../training/progressStore.js';
import { useGameMisses } from '../../training/lessons/tuneup/useGameMisses.js';
import { tuneUpOffer } from '../../training/lessons/tuneup/offer.js';
import { localDay } from '../../daily/DailyContext.jsx';
import Icon from '../../components/icons/Icon.jsx';

/* The lesson Today's summary gives the player: improve a weak spot, or refresh one they already know. */
export default function TuneUpCard({ mastery }) {
  const { trainer } = useTrainer();
  const { progress, loading } = useProgress();
  const misses = useGameMisses(true);
  if (!trainer || loading || !misses) return <p className="muted">Preparing your tune-up…</p>;
  const offer = tuneUpOffer({ trainer, progress, gameRecord: misses, mastery, day: localDay() });
  return (
    <div className="tune-card">
      <div>
        <h3 className="icon-text"><Icon name="target" size={18} /> {offer.title}</h3>
        <p className="muted">{offer.text}</p>
      </div>
      <a className="btn primary" href={offer.href}>{offer.action}</a>
    </div>
  );
}
