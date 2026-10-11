/* Bonus rounds for Tactics Toolbox. */
export const tacticsBonus = {
  't-more-mates': [
    {
      type: 'talk',
      fen: 'rnbqkbnr/pppp1ppp/8/4p3/6P1/5P2/PPPPP2P/RNBQKBNR b KQkq - 0 2',
      arrows: [['d8', 'h4']],
      highlights: ['h4', 'e1'],
      text: 'Going deeper: Fool\'s Mate is even faster than Scholar\'s — two moves. White pushes the f- and g-pawns, opens the king\'s diagonal, and Black\'s queen lands on h4. You will almost never see it in a real game. You will see the idea: do not rip open your own king for no reason.',
    },
    {
      type: 'quiz',
      question: 'Fool\'s Mate happens because White…',
      options: [
        { text: 'Opened the diagonal to their own king with the f- and g-pawns', correct: true, why: 'The queen then checks on h4 and there is no block and no escape.' },
        { text: 'Forgot to castle', why: 'There was no time to castle — the game ended on move two.' },
        { text: 'Left f7 unguarded', why: 'That is Scholar\'s Mate. Fool\'s Mate is the other way: White\'s own king is exposed.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Hook Mate needs a rook, a knight, and what else?',
      options: [
        { text: 'A pawn that protects the rook — the hook', correct: true, why: 'The pawn holds the rook so the king cannot take it.' },
        { text: 'A second rook on the 7th rank', why: 'That is the blind swine, not the hook.' },
        { text: 'Two bishops on crossing diagonals', why: 'That is Boden\'s Mate.' },
      ],
    },
  ],
};
