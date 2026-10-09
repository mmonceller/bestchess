import { useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useTrainer } from '../../../training/trainerStore.js';
import { setById } from '../../../training/woodpecker/sets.js';
import { engine } from '../../../engine/engineClient.js';
import GuestBanner from '../hub/GuestBanner.jsx';
import SetChooser from './SetChooser.jsx';
import WoodpeckerSession from './WoodpeckerSession.jsx';
import '../../../components/game/game.css';
import '../training.css';
import '../patterns/patterns.css';
import './woodpecker.css';

/* #/puzzles/woodpecker shows the sets; #/puzzles/woodpecker/<set> runs the current cycle. */
export default function WoodpeckerPage({ setId }) {
  const { user } = useAuth();
  const { trainer, update } = useTrainer();
  const set = setById(setId);

  useEffect(() => () => engine.cancel(), []);

  if (!trainer) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;
  return (
    <div className="woodpecker fade-in">
      {!user && <GuestBanner />}
      {set
        ? <WoodpeckerSession key={set.id} set={set} trainer={trainer} update={update} />
        : <SetChooser trainer={trainer} />}
    </div>
  );
}
