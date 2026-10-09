import { useMemo } from 'react';
import Icon from '../icons/Icon.jsx';
import { assessDanger } from '../../chess/danger/assessDanger.js';
import { threatensMate } from '../../chess/danger/mateThreat.js';
import './danger.css';

/*
 * Live warning under the winning meter: forced checkmate against the player, a mate-in-one
 * threat, or a position that is almost lost. `evaluation` comes from useEvaluation (White's side).
 */
export default function DangerNotice({ fen, evaluation, playerColor }) {
  const opponent = playerColor === 'w' ? 'b' : 'w';
  const myTurn = fen.split(' ')[1] === playerColor;
  const threat = useMemo(() => myTurn && threatensMate(fen, opponent), [fen, myTurn, opponent]);
  const fresh = evaluation?.fen === fen && !evaluation.over;
  const sign = playerColor === 'w' ? 1 : -1;
  const danger = assessDanger({
    cp: fresh && evaluation.cp != null ? evaluation.cp * sign : null,
    mate: fresh && evaluation.mate != null ? evaluation.mate * sign : null,
    threat,
  });
  if (!danger) return null;
  return (
    <div className={`danger-notice level-${danger.level} pop-in`} role="alert">
      <Icon name={danger.level === 'losing' ? 'warning' : 'king'} size={20} />
      <div>
        <b>{danger.title}</b>
        <p>{danger.text}</p>
      </div>
    </div>
  );
}
