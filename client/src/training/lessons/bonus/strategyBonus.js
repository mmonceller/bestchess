/* Bonus rounds for Strategy Lab. */
export const strategyBonus = {
  's-imbalances': [
    {
      type: 'talk',
      text: 'Going deeper: imbalances are not good or bad on their own — they\'re a roadmap. If you have more space, your plan is to squeeze. If they have a weak pawn, your plan is to attack it. Once you can describe a position\'s imbalances, the right plan usually suggests itself.',
    },
    {
      type: 'quiz',
      question: 'You can\'t find a good move. What\'s the best first step?',
      options: [
        { text: 'Check for threats, then list the imbalances for both sides', correct: true, why: 'The imbalances point to targets and plans. Moves follow from plans.' },
        { text: 'Make any safe-looking move and wait', why: 'Aimless moves let your opponent take over.' },
        { text: 'Calculate every legal move', why: 'Too slow. Let the imbalances narrow your search first.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Which of these is NOT one of the imbalances?',
      options: [
        { text: 'Which player is higher rated', correct: true, why: 'Ratings aren\'t on the board. Imbalances are differences in the position itself.' },
        { text: 'King safety', why: 'King safety is one of the most important imbalances.' },
        { text: 'Control of a key file', why: 'That\'s an imbalance — roads for rooks.' },
      ],
    },
  ],
  's-minor-pieces': [
    {
      type: 'talk',
      text: 'Going deeper: a "bad" bishop isn\'t always useless. If it defends important pawns, it may be doing a vital job. And a good way to fight the two bishops is to trade one of them off — a single bishop is much less scary than the pair.',
    },
    {
      type: 'quiz',
      question: 'Your opponent has the two bishops. What\'s a common antidote?',
      options: [
        { text: 'Trade one of their bishops for your knight or bishop', correct: true, why: 'Without its partner, the remaining bishop is just a normal minor piece.' },
        { text: 'Open the position', why: 'That helps the bishops even more.' },
        { text: 'Put all your pawns on the colour of their bishops', why: 'That gives the bishops targets to attack.' },
      ],
    },
    {
      type: 'quiz',
      question: 'All the pawns are on one side of the board. Which minor piece tends to do well?',
      options: [
        { text: 'The knight — it can reach every square in a small area', correct: true, why: 'With no long-range work to do, the bishop\'s big advantage disappears.' },
        { text: 'The bishop — always', why: 'Bishops shine when there\'s play on both wings.' },
        { text: 'Neither can move', why: 'Both can move. The knight\'s short range just matters less here.' },
      ],
    },
  ],
  's-rooks': [
    {
      type: 'talk',
      text: 'Going deeper: sometimes it pays to wait before opening a file. Put your rooks behind the pawn break first, so that when the file opens, they\'re already in position to take it.',
    },
    {
      type: 'quiz',
      question: 'Why double rooks on an open file?',
      options: [
        { text: 'Two rooks together control the file and can invade even if one is challenged', correct: true, why: 'If the opponent offers a trade, you recapture and still own the file.' },
        { text: 'So one can protect the other from pawns', why: 'Pawns rarely attack rooks on open files. The point is control.' },
        { text: 'It\'s required to castle', why: 'Castling has nothing to do with it.' },
      ],
    },
  ],
  's-targets': [
    {
      type: 'talk',
      text: 'Going deeper: an isolated pawn isn\'t only a weakness. In the middlegame it often gives its owner open files and active pieces. The defender\'s plan is to trade pieces, blockade, and then win the pawn in the endgame.',
    },
    {
      type: 'quiz',
      question: 'You\'re playing against an isolated pawn. What\'s the usual plan?',
      options: [
        { text: 'Blockade the square in front of it, trade pieces, and attack it in the endgame', correct: true, why: 'Fewer pieces means less activity for the side with the isolated pawn.' },
        { text: 'Avoid all trades', why: 'Trades usually help the side playing against the isolated pawn.' },
        { text: 'Let it advance', why: 'An advancing isolated pawn can become dangerous. Stop it first.' },
      ],
    },
  ],
  's-space': [
    {
      type: 'talk',
      text: 'Going deeper: when both sides have space on different wings, it becomes a race. Each player pushes on their own side — and whoever breaks through first usually wins. Keep your pieces on the side where you\'re playing.',
    },
    {
      type: 'quiz',
      question: 'A big pawn centre gives you space. What can your opponent try against it?',
      options: [
        { text: 'Attack it with pawns and pieces until it becomes a target', correct: true, why: 'Advanced central pawns can be undermined and fall apart if not supported.' },
        { text: 'Nothing — a big centre is unbeatable', why: 'Big centres can be targets if they aren\'t well supported.' },
        { text: 'Put all their pieces on the back rank', why: 'Passivity lets the centre roll forward.' },
      ],
    },
  ],
  's-statics-dynamics': [
    {
      type: 'talk',
      text: 'Going deeper: think of a fight between a boxer and a puncher. The puncher (dynamic side) wants to land a knockout early. The boxer (static side) dodges, survives, and wins on points later. Know which one you are in each game.',
    },
    {
      type: 'quiz',
      question: 'You have a long-term structural advantage but your opponent is attacking. What\'s your priority?',
      options: [
        { text: 'Defend solidly and neutralise the attack — your advantage will still be there later', correct: true, why: 'Static plusses wait for you. First survive the dynamic phase.' },
        { text: 'Counter-attack at any cost', why: 'You might win, but you\'d be giving up your safer, long-term edge.' },
        { text: 'Offer a draw', why: 'If you survive, you\'re better. Keep playing.' },
      ],
    },
  ],
  's-passed-pawns': [
    {
      type: 'talk',
      text: 'Going deeper: a blockade isn\'t only defence. The blockading piece often becomes your best piece, because it can never be chased away by pawns. Sometimes the side with the passed pawn ends up worse because its pieces are tied to babysitting the pawn.',
    },
    {
      type: 'quiz',
      question: 'Which passed pawn is usually the most dangerous in an endgame?',
      options: [
        { text: 'An outside passed pawn, far away from the other pawns', correct: true, why: 'It drags the enemy king away from the rest of the board, where your king can then feast.' },
        { text: 'A passed pawn in the middle of a pawn group', why: 'Centre passers are good, but an outside passer is a classic winning weapon.' },
        { text: 'A doubled passed pawn', why: 'Doubled pawns are usually less effective.' },
      ],
    },
  ],
};
