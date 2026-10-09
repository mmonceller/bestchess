/* Bonus rounds for the Master track. */
export const masterBonus = {
  'm-calculation': [
    {
      type: 'talk',
      text: 'Going deeper: when calculating, picture the board after each move instead of the move list. Strong players train this by solving puzzles without moving the pieces. Also look for your opponent\'s best reply, not the reply you hope for.',
    },
    {
      type: 'move',
      fen: '3q2k1/5ppp/8/8/8/3B4/5PPP/3R2K1 w - - 0 1',
      prompt: 'Calculate it fully before you touch a piece: which forcing move wins the queen?',
      line: ['d3h7', 'g8h7', 'd1d8'],
      hint: 'Checks first. The bishop has one — and it opens a line.',
      success: 'Bishop check, discovered attack, queen won. You saw it to the end.',
    },
  ],
  'm-intermezzo': [
    {
      type: 'talk',
      text: 'Going deeper: in-between moves work for defenders too. When your opponent starts a trade, look for a check or a counter-threat before you recapture — it can turn a losing exchange into an equal one.',
    },
    {
      type: 'quiz',
      question: 'Which in-between move is the most reliable?',
      options: [
        { text: 'A check', correct: true, why: 'A check must be answered, so your opponent can\'t use the time to save material.' },
        { text: 'A quiet pawn move', why: 'Quiet moves give your opponent a free move.' },
        { text: 'A retreat', why: 'A retreat doesn\'t force anything.' },
      ],
    },
  ],
  'm-prophylaxis': [
    {
      type: 'talk',
      text: 'Going deeper: the great champion Tigran Petrosian was famous for prophylaxis — he often stopped his opponents\' plans before they even thought of them. A good habit: after every opponent move, name their plan in one sentence.',
    },
    {
      type: 'quiz',
      question: 'Your opponent\'s only active plan is to push a pawn to open a file against your king. You have a quiet move that stops the push. What should you do?',
      options: [
        { text: 'Play the quiet move — then your opponent has no plan at all', correct: true, why: 'Without a plan, they\'ll drift, and you can improve at your leisure.' },
        { text: 'Start your own attack and race them', why: 'Races are risky when you could simply stop their play.' },
        { text: 'Offer a draw', why: 'You\'re about to take away their only idea — play on.' },
      ],
    },
  ],
  'm-endgame': [
    {
      type: 'talk',
      text: 'Going deeper: in the rook checkmate, the rook never needs to give random checks. Use "waiting moves" with the rook along its row to make the enemy king step into opposition with yours — then give the check that pushes it back a row.',
    },
    {
      type: 'quiz',
      question: 'In king and rook versus king, when should the rook give check?',
      options: [
        { text: 'When the kings face each other (opposition)', correct: true, why: 'Then the enemy king can\'t step forward, so the check pushes it back a row.' },
        { text: 'As often as possible', why: 'Random checks just chase the king around without making progress.' },
        { text: 'Never — only the king gives mate', why: 'The rook delivers the final check; the king supports it.' },
      ],
    },
  ],
  'm-tournament': [
    {
      type: 'talk',
      text: 'Going deeper: in a long tournament, energy matters as much as preparation. Eat, rest and walk between rounds. Review each game briefly afterwards — then let it go and focus on the next one.',
    },
    {
      type: 'quiz',
      question: 'You lost a painful game in round 3 of 7. What\'s the best thing to do before round 4?',
      options: [
        { text: 'Briefly note the lesson, then rest and reset for the next game', correct: true, why: 'Dwelling on a loss costs energy you need for the next round.' },
        { text: 'Analyse the loss for hours', why: 'Save the deep analysis for after the tournament.' },
        { text: 'Play very safe for the rest of the event', why: 'Changing your style out of fear rarely works.' },
      ],
    },
  ],
};
