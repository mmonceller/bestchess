/* Bonus rounds for the Endgame School track (ideas from Dvoretsky's Endgame Manual). */
export const endgameBonus = {
  'e-king-races': [
    {
      type: 'talk',
      text: 'Going deeper: kings can also "shoulder" each other. Kings can never stand next to each other, so your king can block the other king\'s path like a body check in sports. Sometimes the winning move is simply to step in the way.',
    },
    {
      type: 'quiz',
      question: 'Three connected pawns on the 5th row against a lone king (no other pieces). What usually happens?',
      options: [
        { text: 'The pawns win on their own — the king can\'t stop all three', correct: true, why: 'When the king takes one, another pawn runs forward. Connected pawns protect each other.' },
        { text: 'The king always eats them', why: 'One king can\'t deal with three connected pawns that are already far up the board.' },
        { text: 'It\'s always a draw', why: 'Three connected passed pawns are very strong.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Both sides are racing pawns to make a queen. Yours queens first. What must you check?',
      options: [
        { text: 'Whether my new queen can stop their pawn — or whether they promote with check', correct: true, why: 'Queening first only wins if the other pawn can still be stopped.' },
        { text: 'Nothing — first to queen wins', why: 'Not always! A pawn on the 7th backed by its king can still draw against a queen.' },
        { text: 'Whether I can promote to a knight', why: 'Underpromotion is rare. The real question is stopping the other pawn.' },
      ],
    },
  ],
  'e-zugzwang': [
    {
      type: 'talk',
      text: 'Going deeper: some squares are "partners". If your king is on square A, the enemy king MUST be on its partner square B, or it loses. Strong players work out these partner squares (called corresponding squares) and use them to find the only winning moves.',
    },
    {
      type: 'quiz',
      question: 'A "mined square" is a square you must not step on first, because whoever steps on it falls into zugzwang. What should you do?',
      options: [
        { text: 'Make a waiting move and let the opponent step on it first', correct: true, why: 'Like two players at a door: whoever goes first loses.' },
        { text: 'Rush onto it quickly', why: 'That\'s exactly the trap. Stepping on first hands the win to your opponent.' },
        { text: 'Ignore it', why: 'Mined squares decide many pawn endings. Count before you step.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Both sides have spare pawn moves. How do you work out who wins the waiting game?',
      options: [
        { text: 'Count the spare moves for each side — whoever has more can pass last', correct: true, why: 'It\'s a simple counting game. The side with the last spare move puts the other in zugzwang.' },
        { text: 'Whoever moves first wins', why: 'It depends on who runs out of safe moves first.' },
        { text: 'Spare moves don\'t matter', why: 'In blocked pawn endings, they often decide everything.' },
      ],
    },
  ],
  'e-fortress': [
    {
      type: 'talk',
      text: 'Going deeper: a knight can also stop a pawn, but it struggles against a rook pawn (on the a- or h-file). Near the edge the knight has fewer squares to jump to. If the pawn reaches the 7th row with its king helping, the knight usually loses the race.',
    },
    {
      type: 'quiz',
      question: 'A lone bishop against two passed pawns that are far apart. What usually happens?',
      options: [
        { text: 'The pawns are dangerous — the bishop can\'t guard both sides at once', correct: true, why: 'Pawns far apart stretch the defence. The defending king has to stop one while the bishop stops the other.' },
        { text: 'The bishop easily stops both', why: 'Only if the pawns are close together, or the king helps.' },
        { text: 'It\'s always a draw', why: 'Separated pawns are a big problem for a lone bishop.' },
      ],
    },
    {
      type: 'quiz',
      question: 'In an opposite-coloured bishop ending, the attacker has two passed pawns far apart. Is it still a draw?',
      options: [
        { text: 'Often not — the defending king can\'t block both pawns', correct: true, why: 'The king blocks one, the bishop must stop the other — and the attacker\'s king helps break through.' },
        { text: 'Yes, opposite bishops are always a draw', why: 'Not always! Pawns far apart are the attacker\'s best winning chance.' },
        { text: 'It depends only on whose move it is', why: 'The pawn positions matter much more.' },
      ],
    },
  ],
  'e-queen-vs-pawn': [
    {
      type: 'quiz',
      question: 'Queen vs. a c-pawn on the 7th row. When CAN the queen still win?',
      options: [
        { text: 'When your king is already close enough to help mate before the stalemate trick works', correct: true, why: 'With the king nearby, you can set up a mate while the enemy king is hiding in the corner.' },
        { text: 'Never', why: 'It\'s usually a draw, but if your king is close enough there are winning lines.' },
        { text: 'Always, if you check enough times', why: 'Checks alone run into the stalemate trick.' },
      ],
    },
    {
      type: 'talk',
      text: 'Going deeper: against an a-pawn (rook pawn) the defending king hides in the corner in front of its pawn. Taking the pawn or blocking it often gives stalemate. That\'s why rook pawns and bishop pawns are the "drawing" pawns.',
    },
    {
      type: 'quiz',
      question: 'Queen against a rook (no pawns). Who usually wins?',
      options: [
        { text: 'The queen, but it takes careful technique', correct: true, why: 'The queen wins in the end by pushing the king and rook apart and forking them.' },
        { text: 'It\'s always a draw', why: 'Queen vs. rook is a win, though even strong players sometimes struggle with it.' },
        { text: 'The rook', why: 'The rook is much weaker — it can only hold on for a while.' },
      ],
    },
  ],
  'e-rook-rules': [
    {
      type: 'talk',
      text: 'Going deeper: when defending, send your king to the "short side" — the side of the pawn with fewer columns. Keep your rook on the "long side", where it has space to check from far away.',
    },
    {
      type: 'quiz',
      question: 'Your rook must stop an enemy pawn alone (no other pieces). What decides the result?',
      options: [
        { text: 'How fast each king can get to the pawn — count the moves', correct: true, why: 'A rook stops a pawn easily if your king arrives in time. If the enemy king supports it too long, it may be a draw.' },
        { text: 'Rooks always beat pawns', why: 'A far-advanced pawn with its king can draw against a rook.' },
        { text: 'Pawns always draw against rooks', why: 'Usually the rook wins — if the king is close enough.' },
      ],
    },
    {
      type: 'quiz',
      question: 'Rook and pawn vs. rook: the defending king is cut off from the pawn by your rook. What does that usually mean?',
      options: [
        { text: 'Good winning chances — the defender\'s king can\'t get in front of the pawn', correct: true, why: 'A cut-off king is the attacker\'s dream. Without the king in front, the pawn often walks home.' },
        { text: 'An easy draw', why: 'The defender wants the king in front of the pawn. Cut off, it\'s much harder.' },
        { text: 'Nothing changes', why: 'Cutting the king off is one of the most important ideas in rook endings.' },
      ],
    },
  ],
  'e-big-rules': [
    {
      type: 'talk',
      text: 'Going deeper: the "two weaknesses" rule. If your opponent has only one weakness, they can usually defend it. Create a second weakness on the other side of the board, then switch between them until the defence breaks.',
    },
    {
      type: 'quiz',
      question: 'You have king, bishop and knight against a lone king. Can you force checkmate?',
      options: [
        { text: 'Yes — but only in a corner of the same colour as your bishop', correct: true, why: 'It takes skill and up to about 33 moves, but it\'s a forced win.' },
        { text: 'No, it\'s a draw', why: 'It\'s a win, but a hard one. Two knights alone, on the other hand, can\'t force mate.' },
        { text: 'Yes, in any corner', why: 'The bishop can only help mate in a corner of its own colour.' },
      ],
    },
    {
      type: 'quiz',
      question: 'You have two knights against a lone king. What is the result?',
      options: [
        { text: 'A draw — two knights can\'t force checkmate', correct: true, why: 'Mate is only possible if the defender blunders.' },
        { text: 'An easy win', why: 'Surprisingly, two knights can\'t force mate against a careful defender.' },
        { text: 'A win if you\'re quick', why: 'Speed doesn\'t help. The defender can always avoid mate.' },
      ],
    },
  ],
};

/* Extra steps for older endgame lessons, appended after their existing bonus steps. */
export const ENDGAME_EXTRAS = {
  'i-key-squares': [
    {
      type: 'quiz',
      question: 'Extra question: a pawn on the edge (an a-pawn) works differently. Where are its key squares?',
      options: [
        { text: 'The two squares next to the corner: b7 and b8', correct: true, why: 'If your king gets there, the defending king can\'t reach the corner and the pawn queens.' },
        { text: 'Two rows in front of the pawn, like other pawns', why: 'Edge pawns are special — the defender can draw by hiding in the corner.' },
        { text: 'An a-pawn has no key squares', why: 'It has them: b7 and b8.' },
      ],
    },
    {
      type: 'quiz',
      question: 'When a pawn moves forward, what happens to its key squares?',
      options: [
        { text: 'They move forward too', correct: true, why: 'Key squares belong to the pawn\'s position. Push it and you need to recheck them.' },
        { text: 'They stay where they were', why: 'They follow the pawn.' },
        { text: 'They disappear', why: 'They just move. A pawn on the 5th or 6th row even has extra key squares.' },
      ],
    },
  ],
  'a-lucena': [
    {
      type: 'quiz',
      question: 'Extra question: does Lucena\'s bridge work with a pawn on the a- or h-file?',
      options: [
        { text: 'No — with an edge pawn the king can\'t step out to the side and it\'s usually a draw', correct: true, why: 'The edge leaves only one side to escape on, and the defender uses that.' },
        { text: 'Yes, exactly the same way', why: 'Edge pawns are special. The bridge needs room on both sides.' },
        { text: 'Only with the queen on the board', why: 'Lucena is a rook ending. Edge pawns are the exception.' },
      ],
    },
  ],
  'a-philidor': [
    {
      type: 'talk',
      text: 'Extra idea: if the wall on the 3rd row gets broken, defend from the side. Put your king on the short side of the pawn and your rook far away on the long side, so it can check from a distance.',
    },
  ],
  'm-endgame': [
    {
      type: 'quiz',
      question: 'Extra question: your opponent defends their only weak pawn perfectly. What should you do?',
      options: [
        { text: 'Create a second weakness on the other side of the board', correct: true, why: 'One weakness can be defended. Two weaknesses far apart usually can\'t.' },
        { text: 'Keep attacking the same pawn', why: 'If it\'s defended well, you\'ll just go round in circles.' },
        { text: 'Agree a draw', why: 'There\'s still a plan: give them a second problem.' },
      ],
    },
  ],
};
