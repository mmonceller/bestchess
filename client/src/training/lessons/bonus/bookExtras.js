/*
 * Extra "going deeper" steps appended to existing bonus rounds, and bonus rounds for the
 * newer Master Class lessons. Ideas from Silman's How to Reassess Your Chess and
 * Kotov's Think Like a Grandmaster, written in our own words.
 */
export const BOOK_EXTRAS = {
  'b-blunder-filter': [
    {
      type: 'talk',
      text: 'One more habit from the grandmasters: once you\'ve chosen your move, pause and look at the board as if you were a beginner. Is anything hanging? Can they check me? This "beginner\'s look" catches the simple blunders that deep thinking misses.',
    },
    {
      type: 'quiz',
      question: 'When is the best moment for the "beginner\'s look"?',
      options: [
        { text: 'After you\'ve decided on a move, but before you play it', correct: true, why: 'That\'s the last chance to spot something simple you overlooked.' },
        { text: 'After your opponent replies', why: 'Too late — the move is already on the board.' },
        { text: 'Only in the opening', why: 'Simple blunders happen in every phase of the game.' },
      ],
    },
  ],
  'i-worst-piece': [
    {
      type: 'talk',
      text: 'Extra idea: a knight needs a "support point" — an advanced square protected by your pawn where no enemy pawn can attack it. Before improving a knight, find its future home first, then plan the route there.',
    },
  ],
  'i-what-they-want': [
    {
      type: 'talk',
      text: 'Extra idea: make a habit of describing the position in words — who has more space, who has the better minor piece, which pawns are weak. If you can explain what both sides want, finding their plan (and stopping it) becomes much easier.',
    },
  ],
  'i-trade-logic': [
    {
      type: 'quiz',
      question: 'Extra question: your pieces are cramped and have little room. Which trades help you?',
      options: [
        { text: 'Trading off some pieces to free up space', correct: true, why: 'The cramped side benefits from exchanges — fewer pieces need fewer squares.' },
        { text: 'No trades — keep everything on the board', why: 'Keeping pieces in a cramped position makes them get in each other\'s way.' },
        { text: 'Trading pawns only', why: 'Pawn trades can help with breaks, but piece trades are what relieve a cramp.' },
      ],
    },
  ],
  'a-practical': [
    {
      type: 'talk',
      text: 'Extra idea: you don\'t have to calculate every position deeply. In calm positions, trust your judgement and move faster. Save your time for the sharp moments where one move decides everything.',
    },
  ],
  'm-calculation': [
    {
      type: 'quiz',
      question: 'Extra question: you\'ve already analysed a line and found it works. Should you go back and check it again?',
      options: [
        { text: 'Usually not — analyse each branch once and trust it', correct: true, why: 'Re-checking the same line again and again is a classic way to lose time.' },
        { text: 'Yes, at least three times', why: 'That burns the clock. Do it carefully once, then do a final simple safety check.' },
        { text: 'Only if the opponent looks confident', why: 'Your opponent\'s face doesn\'t change the position.' },
      ],
    },
  ],
  'm-tree': [
    {
      type: 'talk',
      text: 'Going deeper: when choosing candidates, look at the most forcing moves first, but don\'t stop there. The quiet move you almost didn\'t consider is often the one that wins or saves the game.',
    },
    {
      type: 'quiz',
      question: 'You\'ve listed three candidate moves. Halfway through analysing the second, you get an idea for the first. What should you do?',
      options: [
        { text: 'Note it, finish the current branch, then return', correct: true, why: 'Jumping back and forth scrambles your analysis and wastes time.' },
        { text: 'Abandon the second line immediately', why: 'Then you\'ll have to start that branch again later.' },
        { text: 'Play the first move without checking', why: 'An unchecked idea can be a blunder.' },
      ],
    },
  ],
  'm-blunders': [
    {
      type: 'talk',
      text: 'Going deeper: blunders also happen when a piece "seems" to guard a square because it usually does. After any exchange or piece move, re-check which squares are really covered now.',
    },
    {
      type: 'quiz',
      question: 'Your opponent is a much weaker player. How should that change your vigilance?',
      options: [
        { text: 'Not at all — stay just as alert', correct: true, why: 'Overconfidence against weaker players is one of the most common sources of blunders.' },
        { text: 'Relax — they won\'t find anything', why: 'Weaker players find simple threats very well.' },
        { text: 'Play faster to finish quickly', why: 'Rushing invites exactly the mistakes you want to avoid.' },
      ],
    },
  ],
  'm-creeping': [
    {
      type: 'talk',
      text: 'Going deeper: creeping moves often put the opponent in zugzwang — every move they make worsens their position. When you\'re clearly better, ask: "What useful moves does my opponent have left?" and try to take them away.',
    },
    {
      type: 'quiz',
      question: 'What is zugzwang?',
      options: [
        { text: 'A position where any move the player makes worsens their position', correct: true, why: 'They would love to pass, but in chess you must move.' },
        { text: 'A type of checkmate', why: 'Zugzwang can lead to mate, but it\'s about being forced to move.' },
        { text: 'A draw by repetition', why: 'That\'s threefold repetition, a different idea.' },
      ],
    },
  ],
  'm-plans': [
    {
      type: 'talk',
      text: 'Going deeper: "weak colour complexes" happen when the pawns and bishop that guarded one colour of squares are gone. Then enemy pieces can land on those squares freely — often around the king.',
    },
    {
      type: 'quiz',
      question: 'Your opponent traded off their dark-squared bishop and their pawns are on light squares. What should you look for?',
      options: [
        { text: 'Dark squares where your pieces can settle, especially near their king', correct: true, why: 'Nothing guards those dark squares any more.' },
        { text: 'Light squares to attack', why: 'Their pawns and light-squared bishop still cover those.' },
        { text: 'An immediate draw offer', why: 'You may have a strong positional edge. Use it.' },
      ],
    },
  ],
};
