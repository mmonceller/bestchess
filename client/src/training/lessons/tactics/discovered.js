export const discovered = {
  id: 't-discovered',
  track: 'tactics',
  title: 'Discovered Attacks & Double Check',
  coach: 'viktor',
  summary: 'Move one piece out of the way so the piece behind it attacks too — two threats in one move.',
  minutes: 5,
  steps: [
    {
      type: 'talk',
      fen: '8/ppk5/5q2/8/3N4/8/1B3PPP/6K1 w - - 0 1',
      arrows: [['b2', 'f6']],
      text: 'Look at the bishop on b2. Right now the knight is standing in its way. When the knight jumps away, the bishop suddenly attacks the queen. That is a discovered attack: the piece that moves makes one threat, and the piece behind it makes another.',
    },
    {
      type: 'move',
      fen: '8/ppk5/5q2/8/3N4/8/1B3PPP/6K1 w - - 0 1',
      prompt: 'Move the knight so that it gives check AND uncovers the bishop\'s attack on the queen.',
      line: ['d4b5', 'c7d7', 'b2f6'],
      hint: 'Which knight jump checks the king on c7?',
      wrong: { d4e6: 'Check — but the queen on f6 can simply capture the knight on e6.' },
      success: 'Black had to answer the check, so the queen was lost.',
    },
    {
      type: 'talk',
      text: 'The strongest kind is double check: the moving piece AND the uncovered piece both give check. Nothing can block two checks, and you can\'t capture two pieces at once — the king MUST move.',
    },
    {
      type: 'move',
      fen: '4k3/1q6/8/8/4N3/8/5PPP/4R1K1 w - - 0 1',
      prompt: 'The rook on e1 is aiming at the king through your knight. Find the double check that also hits the queen.',
      line: ['e4d6', 'e8d7', 'd6b7'],
      hint: 'Look for a knight square that checks e8 and attacks b7.',
      success: 'Double check! The king had to run, and the queen dropped.',
    },
    {
      type: 'quiz',
      question: 'Your opponent gives you a double check. What can you do?',
      options: [
        { text: 'Only move your king', correct: true, why: 'Two pieces are checking you. A block or a capture can only deal with one of them.' },
        { text: 'Block one of the checks', why: 'The other check would still be there, so that move is illegal.' },
        { text: 'Capture one of the checking pieces', why: 'Unless the king itself captures, the second check is still on — moving the king is the only answer.' },
      ],
    },
  ],
};
