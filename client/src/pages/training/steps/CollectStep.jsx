import { useCallback, useMemo, useState } from 'react';
import Board from '../../../components/board/Board.jsx';
import Icon from '../../../components/icons/Icon.jsx';
import StepLayout, { Feedback } from '../components/StepLayout.jsx';
import { ContinueButton, HintButton, HintNotice } from '../components/StepButtons.jsx';
import { pieceTargets, placementFen } from '../../../training/pieceMoves.js';
import { fb } from '../stepUtils.js';
import { playMoveSound, sounds } from '../../../utils/sound.js';

/*
 * "Star hunt": move one piece around an empty board to collect every star.
 * Enemy pieces must be captured too; friendly `blockers` are in the way.
 * Taking more than `par` moves still passes but counts as one mistake.
 */
const initial = (step) => ({
  sq: step.start,
  type: step.piece,
  stars: step.stars,
  enemies: step.enemies || {},
  moves: 0,
  last: null,
  path: [step.start],
});

export default function CollectStep({ step, coach, onNext, onMistake, onHint, onAnswer }) {
  const [s, setS] = useState(() => initial(step));
  const [feedback, setFeedback] = useState(null);
  const [hinted, setHinted] = useState(false);
  const [penalized, setPenalized] = useState(false);
  const blockers = useMemo(() => new Set(step.blockers || []), [step]);
  const done = s.stars.length === 0 && Object.keys(s.enemies).length === 0;

  const fen = useMemo(() => {
    const map = { [s.sq]: s.type.toUpperCase() };
    for (const b of blockers) map[b] = 'P';
    for (const [sq, t] of Object.entries(s.enemies)) map[sq] = t;
    return placementFen(map);
  }, [s, blockers]);

  const targets = useCallback(
    () => pieceTargets(s.type, s.sq, { friends: blockers, enemies: new Set(Object.keys(s.enemies)) }),
    [s, blockers],
  );

  const getMoves = useCallback(
    (from) => (from === s.sq && !done ? targets().map((t) => ({ from, to: t.to, flags: t.capture ? 'c' : 'n' })) : []),
    [s.sq, done, targets],
  );

  function onMove({ from, to }) {
    const enemies = { ...s.enemies };
    const captured = Boolean(enemies[to]);
    delete enemies[to];
    const stars = s.stars.filter((x) => x !== to);
    const promoted = s.type === 'p' && to[1] === '8';
    const next = { sq: to, type: promoted ? 'q' : s.type, stars, enemies, moves: s.moves + 1, last: { from, to }, path: [...s.path, to] };
    setS(next);
    playMoveSound({ captured: captured ? 'x' : undefined });

    const finished = stars.length === 0 && Object.keys(enemies).length === 0;
    if (finished) {
      sounds.good();
      onAnswer?.({ moves: next.moves, path: next.path });
      if (next.moves > step.par) {
        if (!penalized) { setPenalized(true); onMistake(); }
        setFeedback(fb('ok', `All collected in ${next.moves} moves! It can be done in ${step.par} — try again for a perfect score, or continue.`));
      } else {
        setFeedback(fb('good', step.success || `Perfect — ${next.moves} moves is the fewest possible!`));
      }
    } else if (promoted) {
      sounds.good();
      setFeedback(fb('good', 'Your pawn reached the last row and turned into a queen! Now keep collecting.'));
    } else if (captured) {
      setFeedback(fb('good', 'Captured! Your piece takes the enemy\'s square and the enemy piece leaves the board.'));
    } else if (stars.length < s.stars.length) {
      setFeedback(fb('good', `Got one! ${stars.length + Object.keys(enemies).length} left.`));
    } else {
      setFeedback(null);
    }
  }

  function reset() {
    setS(initial(step));
    setFeedback(null);
  }

  const markers = Object.fromEntries(s.stars.map((x) => [x, 'star']));
  const reach = hinted && !done ? Object.fromEntries(targets().map((t) => [t.to, t.capture ? 'capture' : 'move'])) : {};
  const left = s.stars.length + Object.keys(s.enemies).length;

  return (
    <StepLayout
      coach={coach}
      message={step.prompt}
      board={(
        <Board
          fen={fen}
          movableColor={done ? null : 'w'}
          getMoves={getMoves}
          onMove={onMove}
          lastMove={s.last}
          markers={markers}
          highlights={reach}
          showCoords
        />
      )}
      feedback={<>
        <div className="collect-stats">
          <span className="badge icon-text"><Icon name="star" size={14} /> {left} left</span>
          <span className="badge icon-text"><Icon name="target" size={14} /> {s.moves} moves · best is {step.par}</span>
        </div>
        {hinted && !done && <HintNotice extra=" The purple dots show every square your piece can reach right now.">{step.hint}</HintNotice>}
        <Feedback fb={feedback} />
      </>}
      actions={done ? (
        <div className="controls">
          {s.moves > step.par && <button className="btn icon-text" onClick={reset}><Icon name="retry" size={18} /> Try again</button>}
          <ContinueButton onClick={onNext} />
        </div>
      ) : (
        <div className="controls">
          <HintButton onClick={() => { if (!hinted) onHint(); setHinted(true); }} disabled={hinted} />
          {s.moves > 0 && <button className="btn icon-text" onClick={reset}><Icon name="retry" size={18} /> Restart</button>}
        </div>
      )}
    />
  );
}
