import { useCallback, useEffect, useRef, useState } from 'react';
import Icon from '../../../components/icons/Icon.jsx';
import { accuracy, applyAttempt, formatDuration, restartCycle, runFor, targetMs } from '../../../training/woodpecker/cycles.js';
import CycleClock from './CycleClock.jsx';
import CycleSummary from './CycleSummary.jsx';
import WoodpeckerPlay from './WoodpeckerPlay.jsx';

/* Plays the current cycle of one set, in order, and closes the cycle after the last exercise. */
export default function WoodpeckerSession({ set, trainer, update }) {
  const [puzzles, setPuzzles] = useState(null);
  const [shown, setShown] = useState(null);
  const [finished, setFinished] = useState(null);
  const [clockFrom, setClockFrom] = useState(null);
  const trainerRef = useRef(trainer);
  trainerRef.current = trainer;
  const run = runFor(trainer, set.id);

  useEffect(() => {
    let alive = true;
    set.load().then((m) => { if (alive) setPuzzles(m.default); });
    return () => { alive = false; };
  }, [set]);

  useEffect(() => {
    if (puzzles && shown === null) {
      setShown(Math.min(run.index, puzzles.length - 1));
      setClockFrom(Date.now());
    }
  }, [puzzles, shown, run.index]);

  const puzzle = puzzles && shown !== null ? puzzles[shown] : null;

  const onResult = useCallback(({ solved }) => {
    const ms = clockFrom ? Date.now() - clockFrom : 0;
    let res = null;
    update((t) => {
      res = applyAttempt(t, set.id, { n: puzzle.n, solved, ms }, puzzles.length);
      return res.trainer;
    });
    setClockFrom(null);
    if (res?.finished) setFinished(res.finished);
    return res || { xp: 0 };
  }, [update, set.id, puzzle, puzzles, clockFrom]);

  function next() {
    if (finished) return;
    setShown(runFor(trainerRef.current, set.id).index);
    setClockFrom(Date.now());
  }

  function startNextCycle() {
    setFinished(null);
    setShown(0);
    setClockFrom(Date.now());
  }

  function restart() {
    if (!window.confirm(`Start cycle ${run.cycle} of the ${set.name} set over from exercise 1?`)) return;
    update((t) => restartCycle(t, set.id));
    setShown(0);
    setClockFrom(Date.now());
  }

  if (!puzzles || !puzzle) return <div className="center muted" style={{ padding: 40 }}><span className="spinner" /></div>;

  const target = targetMs(run);
  const position = Math.min(shown + 1, puzzles.length);

  return (
    <>
      <header className="trainer-head wp-head">
        <a className="orb small" href="#/puzzles/woodpecker" aria-label="Back to the sets"><Icon name="back" size={18} /></a>
        <div className="trainer-stats">
          <span className="chip" style={{ '--c': set.color }}><Icon name="retry" size={16} /> {set.name} · <b>Cycle {finished ? finished.cycle : run.cycle}</b></span>
          <span className="chip chip-today"><Icon name="checkCircle" size={16} /> <b>{run.solved}/{run.index}</b> {run.index ? `(${accuracy(run.solved, run.index)}%)` : ''}</span>
          <span className="chip"><Icon name="clock" size={16} /> <CycleClock baseMs={run.ms} from={clockFrom} /></span>
          {target && <span className="chip" title="Half of your last cycle's time"><Icon name="target" size={16} /> {formatDuration(target)}</span>}
        </div>
        <button className="btn small wp-restart" onClick={restart} title="Start this cycle again from exercise 1">
          <Icon name="undo" size={15} /> Restart
        </button>
      </header>
      <div className="wp-progress" aria-label={`Exercise ${position} of ${puzzles.length}`}>
        <span style={{ width: `${finished ? 100 : (run.index / puzzles.length) * 100}%`, background: set.color }} />
      </div>

      {finished ? (
        <CycleSummary set={set} finished={finished} history={run.history} onContinue={startNextCycle} />
      ) : (
        <WoodpeckerPlay key={`${run.cycle}-${puzzle.n}`} puzzle={puzzle} onResult={onResult} onNext={next} />
      )}
    </>
  );
}
