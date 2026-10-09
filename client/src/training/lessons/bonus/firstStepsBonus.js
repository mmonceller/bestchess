/* Bonus rounds for First Steps: extra knowledge plus harder questions, unlocked after the lesson. */
export const firstStepsBonus = {
  'f-board': [
    {
      type: 'talk',
      text: 'Going deeper: strong players know the colour of every square without looking. Here\'s the trick — count the column letter (a = 1, b = 2 … h = 8) and add the row number. An even total means a dark square, an odd total means a light one. a1: 1 + 1 = 2, dark. h1: 8 + 1 = 9, light.',
    },
    {
      type: 'quiz',
      question: 'No peeking at a board: what colour is the square e4?',
      options: [
        { text: 'Light', correct: true, why: 'e is the 5th letter. 5 + 4 = 9, an odd number, so e4 is light.' },
        { text: 'Dark', why: 'Count it: e = 5, plus 4 makes 9. Odd totals are light squares.' },
      ],
    },
    {
      type: 'squares',
      prompt: 'Speed round with trickier squares — they\'re scattered all over the board this time.',
      squares: ['g7', 'b3', 'e5', 'h2', 'c6', 'd1', 'f8', 'a4'],
      success: 'Eight tricky squares, found. Your board vision is getting sharp!',
    },
    {
      type: 'quiz',
      question: 'At the start, the white queen stands on d1. What colour is d1?',
      options: [
        { text: 'Light — the queen starts on her own colour', correct: true, why: 'd = 4, 4 + 1 = 5, odd, so light. The white queen starts on a light square, the black queen on a dark one: "queen on her colour".' },
        { text: 'Dark', why: 'd = 4 and 4 + 1 = 5 — an odd total is light.' },
      ],
    },
  ],

  'f-rook-bishop': [
    {
      type: 'talk',
      fen: '8/8/8/8/8/8/8/2B5 w - - 0 1',
      showMoves: 'c1',
      text: 'Going deeper: a bishop stays on one colour for the whole game. This one started on a dark square, so it can never visit a light square. That\'s why a pair of bishops is so strong — together they cover every square.',
    },
    {
      type: 'quiz',
      question: 'A bishop starts on c1. Can it ever reach the square c2?',
      options: [
        { text: 'No, never', correct: true, why: 'c1 is dark and c2 is light. A bishop never changes colour.' },
        { text: 'Yes, in two moves', why: 'Two diagonal moves keep it on the same colour. c2 is a different colour from c1.' },
        { text: 'Only by capturing', why: 'Capturing doesn\'t change how a bishop moves — it still stays on dark squares.' },
      ],
    },
    {
      type: 'collect',
      piece: 'r',
      start: 'a1',
      stars: ['h8', 'c3', 'f6', 'a8'],
      blockers: ['a5', 'd3', 'f3'],
      par: 7,
      prompt: 'Expert star hunt: your own pawns are in the way. Collect every star with the rook in as few moves as possible.',
      hint: 'Plan the whole route before you move. Rooks travel along rows and columns, and they can\'t pass your pawns.',
    },
    {
      type: 'collect',
      piece: 'b',
      start: 'c1',
      stars: ['h6', 'a3', 'f8', 'e1'],
      blockers: ['d4'],
      par: 5,
      prompt: 'Now the bishop. A pawn sits right in the middle of the diagonals.',
      hint: 'All stars are on dark squares, like the bishop. Look for a path around the pawn on d4.',
    },
  ],

  'f-queen-king': [
    {
      type: 'talk',
      fen: '4k3/8/4K3/8/8/8/8/8 w - - 0 1',
      highlights: ['d7', 'e7', 'f7'],
      text: 'Going deeper: two kings can never stand next to each other — each would be attacking the other. So in endgames, kings often face off with one square between them. The glowing squares are off-limits to both kings here.',
    },
    {
      type: 'quiz',
      fen: '4k3/8/4K3/8/8/8/8/8 w - - 0 1',
      question: 'It\'s White\'s turn. Can the white king step to e7?',
      options: [
        { text: 'No — it would be next to the black king', correct: true, why: 'e7 touches e8. A king can never move next to the enemy king.' },
        { text: 'Yes, nothing is on e7', why: 'The square is empty, but it touches the black king on e8 — that\'s illegal.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Using piece values, which trade is a great deal for you?',
      options: [
        { text: 'Giving your rook (5) for their queen (9)', correct: true, why: 'You give 5 points and get 9. That\'s a profit of 4.' },
        { text: 'Giving your queen (9) for their rook (5)', why: 'You\'d lose 4 points on that swap.' },
        { text: 'Giving your rook (5) for their knight (3)', why: 'Players call this "losing the exchange" — you give up 2 points.' },
      ],
    },
  ],

  'f-knight': [
    {
      type: 'talk',
      fen: '8/8/8/3N4/8/8/8/N7 w - - 0 1',
      showMoves: ['d5', 'a1'],
      text: 'Going deeper: every knight move lands on the opposite colour. And knights hate corners — the knight on a1 reaches only 2 squares, while the one in the centre reaches 8. "A knight on the rim is dim!"',
    },
    {
      type: 'quiz',
      question: 'A knight stands on a light square and makes one move. Where does it land?',
      options: [
        { text: 'Always on a dark square', correct: true, why: 'A knight always switches colour with every move.' },
        { text: 'Always on a light square', why: 'The L-shape always takes the knight to the other colour.' },
        { text: 'It depends on the direction', why: 'Every L-shaped jump changes colour, whichever way it goes.' },
      ],
    },
    {
      type: 'collect',
      piece: 'n',
      start: 'b1',
      stars: ['d5', 'f6', 'h8'],
      par: 7,
      prompt: 'Expert knight hunt: the stars lead all the way to the far corner. Can you reach them all in the fewest jumps?',
      hint: 'Knights are slow over long distances. Think two jumps ahead.',
    },
  ],

  'f-pawns': [
    {
      type: 'talk',
      fen: '4k3/2p5/8/3P3P/8/8/8/4K3 w - - 0 1',
      highlights: ['h5'],
      text: 'Going deeper: a "passed pawn" has no enemy pawns in front of it — not on its own column and not on the columns next to it. Only pieces can stop it. The h5 pawn is passed. The d5 pawn is not, because the c7 pawn can still capture it.',
    },
    {
      type: 'quiz',
      fen: '4k3/2p5/8/3P3P/8/8/8/4K3 w - - 0 1',
      question: 'Why is the white pawn on d5 NOT a passed pawn?',
      options: [
        { text: 'The black pawn on c7 is on a neighbouring column and can capture it on d6', correct: true, why: 'Exactly. If the pawn steps to d6, c7 takes it.' },
        { text: 'Because it\'s in the centre', why: 'Centre pawns can be passed too. What matters is enemy pawns in front of it.' },
        { text: 'It is a passed pawn', why: 'Look at c7 — that black pawn guards d6.' },
      ],
    },
    {
      type: 'move',
      fen: '1r6/2P3k1/8/8/8/8/8/6K1 w - - 0 1',
      prompt: 'Promote — but the rook is watching c8. Find the way to get a queen that survives.',
      line: ['c7b8q'],
      wrong: { c7c8q: 'The rook on b8 takes your new queen straight away.' },
      hint: 'Pawns capture diagonally — even when promoting.',
      success: 'Capture and promote in one move. The rook is gone and you have a new queen!',
    },
  ],

  'f-check': [
    {
      type: 'talk',
      text: 'Going deeper: there are three ways out of check — move the king, block the attack, or capture the attacker. But a knight check can never be blocked, because the knight jumps. And a "double check" (two pieces checking at once) can only be escaped by moving the king.',
    },
    {
      type: 'quiz',
      question: 'Your king is in check from a knight. Which escape is impossible?',
      options: [
        { text: 'Blocking the check', correct: true, why: 'Knights jump, so there\'s nothing to put in the way.' },
        { text: 'Capturing the knight', why: 'If one of your pieces can take the knight, that ends the check.' },
        { text: 'Moving the king', why: 'Stepping away to a safe square always works if there\'s a free square.' },
      ],
    },
    {
      type: 'move',
      fen: '7k/7p/5N2/8/8/8/8/6RK w - - 0 1',
      prompt: 'Checkmate in one. The knight and the rook work as a team.',
      line: ['g1g8'],
      hint: 'The knight on f6 protects one square right next to the black king.',
      success: 'Checkmate! The knight protects g8, the rook covers the g-file and the pawn blocks h7.',
    },
  ],

  'f-special': [
    {
      type: 'talk',
      fen: 'r3k3/8/8/8/2b5/8/8/4K2R w K - 0 1',
      arrows: [['c4', 'f1']],
      text: 'Going deeper: castling has fine print. You can\'t castle if your king or that rook has already moved, if you\'re in check, or if the king would pass through or land on an attacked square. Here Black\'s bishop watches f1.',
    },
    {
      type: 'quiz',
      fen: 'r3k3/8/8/8/2b5/8/8/4K2R w K - 0 1',
      question: 'Can White castle short (O-O) right now?',
      options: [
        { text: 'No — the king would pass through f1, which the bishop attacks', correct: true, why: 'The king may not cross an attacked square while castling.' },
        { text: 'Yes, the king isn\'t in check', why: 'Not being in check isn\'t enough — the path must be safe too.' },
        { text: 'Yes, only the rook passes f1', why: 'The king passes f1 on its way to g1, and f1 is attacked.' },
      ],
    },
    {
      type: 'move',
      teach: true,
      fen: '4k3/8/8/3pP3/8/8/4K3/8 w - d6 0 1',
      prompt: 'Black\'s pawn just jumped from d7 to d5, right past yours. Capture it en passant!',
      line: ['e5d6'],
      hint: 'Your e5 pawn captures diagonally onto d6, as if the black pawn had only moved one square.',
      success: 'En passant! The black pawn disappears even though you landed behind it.',
    },
    {
      type: 'quiz',
      question: 'When are you allowed to capture en passant?',
      options: [
        { text: 'Only on the very next move after the enemy pawn jumps two squares', correct: true, why: 'Wait one move and the chance is gone forever.' },
        { text: 'Any time later in the game', why: 'En passant must be done right away, or never.' },
        { text: 'Only when the enemy pawn is protected', why: 'Protection doesn\'t matter for the rule.' },
      ],
    },
  ],

  'f-notation': [
    {
      type: 'recap',
      title: 'Advanced notation',
      text: 'Going deeper: a few extra symbols you\'ll see in books and broadcasts.',
      items: [
        { label: 'Nbd2', title: 'Which piece?', text: 'Two knights can reach d2 — the one from the b-column goes.' },
        { label: 'R1e2', title: 'Which row?', text: 'Two rooks on the e-column — the one on row 1 goes.' },
        { label: 'e8=Q', title: 'Promotion', text: 'The pawn reaches e8 and becomes a queen.' },
        { label: '! / ?', title: 'Good / bad move', text: '!! is brilliant, ?? is a blunder.' },
        { label: '1-0', title: 'Results', text: '1-0 White won, 0-1 Black won, ½-½ draw.' },
      ],
    },
    {
      type: 'quiz',
      question: 'What does Rad1 mean?',
      options: [
        { text: 'The rook from the a-column moves to d1', correct: true, why: 'The extra "a" says which of the two rooks moves.' },
        { text: 'A rook captures on d1', why: 'A capture would use an "x", like Rxd1.' },
        { text: 'A rook and a pawn both move', why: 'Each move in notation is a single move by one player.' },
      ],
    },
    {
      type: 'quiz',
      question: 'What does exd8=Q+ mean?',
      options: [
        { text: 'The e-pawn captures on d8, becomes a queen and gives check', correct: true, why: 'x = capture, =Q = promotion, + = check. Three things in one move!' },
        { text: 'The queen moves from e8 to d8', why: 'A queen move would start with Q. Lowercase "e" means the pawn on the e-column.' },
        { text: 'The king captures on d8', why: 'A king move starts with K.' },
      ],
    },
    {
      type: 'quiz',
      question: 'A game score ends with 0-1. Who won?',
      options: [
        { text: 'Black', correct: true, why: 'The first number is White\'s score, the second is Black\'s.' },
        { text: 'White', why: 'White winning is written 1-0.' },
        { text: 'It was a draw', why: 'A draw is written ½-½.' },
      ],
    },
  ],

  'f-golden-rules': [
    {
      type: 'talk',
      text: 'Going deeper: the golden rules are guidelines, not laws. Strong players break them when the position asks for it — like moving the queen early to grab a free piece. The real skill is knowing WHY each rule exists, so you can spot when it doesn\'t apply.',
    },
    {
      type: 'quiz',
      question: 'Move 4: your opponent leaves a knight completely unprotected, and your queen can take it safely. But "don\'t bring the queen out early!" What do you do?',
      options: [
        { text: 'Take the free knight', correct: true, why: 'The rule protects your queen from being chased around. A safe, free piece is worth more than a rule of thumb.' },
        { text: 'Ignore it and develop', why: 'Free material wins games. The rule doesn\'t mean "never use your queen".' },
        { text: 'Castle first, then decide', why: 'By then your opponent will have saved the knight.' },
      ],
    },
    {
      type: 'quiz',
      question: 'What is the main reason to castle early?',
      options: [
        { text: 'To tuck the king away safely and connect the rooks', correct: true, why: 'Castling does both jobs in a single move.' },
        { text: 'Because it\'s required before move 10', why: 'There\'s no such rule — some games are played without castling at all.' },
        { text: 'To win a pawn', why: 'Castling doesn\'t capture anything.' },
      ],
    },
  ],
};
