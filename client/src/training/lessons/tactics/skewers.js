export const skewers = {
  id: 't-skewers',
  track: 'tactics',
  title: 'Skewers: Through the Big Piece',
  coach: 'kai',
  summary: 'Attack a valuable piece so that it has to move and uncover the piece behind it.',
  minutes: 4,
  steps: [
    {
      type: 'talk',
      fen: 'q7/8/8/3k4/8/5B2/5PPP/6K1 b - - 0 1',
      arrows: [['f3', 'a8']],
      text: 'A skewer is a pin turned around. You attack the BIG piece first. When it steps out of the way, the piece hiding behind it on the same line is left hanging. Only pieces that slide — bishops, rooks and queens — can skewer.',
    },
    {
      type: 'move',
      fen: 'q7/8/8/3k3B/8/8/5PPP/6K1 w - - 0 1',
      prompt: 'Black\'s king and queen stand on the same long diagonal. Skewer them.',
      line: ['h5f3', 'd5c5', 'f3a8'],
      hint: 'Put your bishop on the a8–h1 diagonal with check.',
      success: 'The king had to step aside, and the queen behind it fell. That\'s a skewer!',
    },
    {
      type: 'move',
      fen: '3r4/8/8/3k4/8/8/5PK1/7R w - - 0 1',
      prompt: 'Now with a rook: the king and rook share a file. Find the skewer.',
      line: ['h1d1', 'd5e6', 'd1d8'],
      hint: 'Check the king along the d-file.',
      success: 'Check first, then take what was standing behind.',
    },
    {
      type: 'quiz',
      question: 'What is the difference between a pin and a skewer?',
      options: [
        { text: 'In a skewer, the more valuable piece is in front', correct: true, why: 'A pin attacks the smaller piece with a bigger one behind it. A skewer attacks the bigger piece, so it must move and expose the smaller one.' },
        { text: 'A skewer only works with knights', why: 'Knights jump, so they can\'t line pieces up. Skewers need bishops, rooks or queens.' },
        { text: 'There is no difference', why: 'They both use a line, but the order of the pieces is reversed — and that changes who has to move.' },
      ],
    },
  ],
};
