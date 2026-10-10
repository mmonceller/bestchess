import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import { useAuth } from '../../../context/AuthContext.jsx';
import { useTrainer } from '../../../training/trainerStore.js';
import { applyResult, pickPuzzle, unlockedPatterns } from '../../../training/patterns/trainerLogic.js';
import { engine } from '../../../engine/engineClient.js';
import GuestBanner from '../hub/GuestBanner.jsx';
import PuzzlePlay from './PuzzlePlay.jsx';
import MasteryPanel from './MasteryPanel.jsx';
import FocusChips from './focus/FocusChips.jsx';
import '../../../components/game/game.css';
import '../training.css';
import './patterns.css';

/* Adaptive puzzle trainer: picks puzzles near the player's rating, weighted toward weak patterns. */
export default function PatternTrainer() {
  const { user } = useAuth();
  const { trainer, update } = useTrainer();
  const [focus, setFocus] = useState(null);
  const [puzzle, setPuzzle] = useState(null);
  const [round, setRound] = useState(0);
  const [session, setSession] = useState({ solved: 0, tried: 0 });
  const trainerRef = useRef(trainer);
  trainerRef.current = trainer;

  useEffect(() => () => engine.cancel(), []);
  useEffect(() => {
    if (trainer && !puzzle) setPuzzle(pickPuzzle(trainer, focus));
  }, [trainer, puzzle, focus]);

  const onResult = useCallback(({ solved, usedHint }) => {
    let res = null;
    update((t) => {
      res = applyResult(t, puzzle, { solved, usedHint });
      return res.trainer;
    });
    setSession((s) => ({ solved: s.solved + (solved ? 1 : 0), tried: s.tried + 1 }));
    return res;
  }, [update, puzzle]);

  function next(nextFocus = focus) {
    setPuzzle(pickPuzzle(trainerRef.current, nextFocus));
    setRound((r) => r + 1);
  }

  function chooseFocus(id) {
    setFocus(id);
    next(id);
  }

  if (!trainer || !puzzle) return <div className="center muted" style={{ padding: 40 }}>Finding a puzzle for you…</div>;

  const unlocked = unlockedPatterns(trainer.rating);

  return (
    <div className="pattern-trainer fade-in">
      {!user && <GuestBanner />}
      <header className="trainer-head">
        <a className="orb small" href="#/training" aria-label="Back to Learn Chess"><Icon name="back" size={18} /></a>
        <div className="trainer-stats">
          <span className="chip chip-puzzle"><Icon name="puzzle" size={16} /> <b>{trainer.rating}</b> rating</span>
          <span className="chip chip-fire"><Icon name="fire" size={16} /> <b>{trainer.streak}</b> in a row</span>
          <span className="chip chip-today"><Icon name="checkCircle" size={16} /> <b>{session.solved}/{session.tried}</b> today</span>
        </div>
      </header>

      <FocusChips patterns={unlocked} focus={focus} onChoose={chooseFocus} />

      <PuzzlePlay key={`${puzzle.id}-${round}`} puzzle={puzzle} onResult={onResult} onNext={() => next()} />

      <MasteryPanel trainer={trainer} />
    </div>
  );
}
