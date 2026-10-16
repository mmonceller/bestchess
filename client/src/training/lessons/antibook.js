/*
 * One Rook lesson: how to play someone who only knows the book positions.
 * The openings and the practical ideas are the point. The moves are the first
 * step of each idea, not a memorized line.
 */
const JOBAVA = 'rnbqkbnr/ppp1pppp/8/3p4/3P4/2N5/PPP1PPPP/R1BQKBNR w KQkq - 2 2';
const JOBAVA_JUMP = 'rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/2N5/PPP1PPPP/R2QKBNR w KQkq - 4 4';
const LARSEN = 'rnbqkbnr/pppppppp/8/8/8/1P6/P1PPPPPP/RNBQKBNR w KQkq - 0 1';
const BENKO = 'rnbqkb1r/pp1ppppp/5n2/2pP4/2P5/8/PP2PPPP/RNBQKBNR b KQkq - 0 3';
const NIMZO = 'rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1';
const FLANK = 'r1bq1rk1/ppp1bppp/2np1n2/4p3/4P3/2NPBN2/PPPQ1PPP/R3K2R w KQ - 0 1';
const EXCHANGE = '2rq1rk1/pp2bppp/4pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQR1K1 b - - 0 1';

export const antibookLessons = [
  {
    id: 's-antibook',
    track: 'study',
    title: 'Beating the Book Player',
    coach: 'rook',
    summary: 'Leave their memorized openings and make them think on their own clock.',
    minutes: 12,
    steps: [
      {
        type: 'talk',
        text: 'A book player is dangerous in a position they have seen before. Known pawn structures, famous openings, classic master games: the moves come out in seconds. Their weak spot is the opposite. Drag the game somewhere their book never went, and the memorized advantage is gone. Then they have to calculate, on a clock, like everyone else.',
      },
      {
        type: 'recap',
        title: 'Where a book player is comfortable',
        text: 'They want the game to stay familiar. You want the opposite.',
        items: [
          { title: 'Their home', text: 'Main lines they have drilled: the Ruy Lopez, the Najdorf, a classical Queen\'s Gambit. Predictable structures. One clear plan.' },
          { title: 'Your job', text: 'A sound sideline by move 4 or 5. Asymmetrical pawns. More than one fight on the board.' },
          { title: 'The moment you have won the opening', text: 'They stop blitzing moves and spend several minutes on a single decision. The book is over.' },
        ],
      },
      {
        type: 'talk',
        fen: JOBAVA,
        text: 'With White, skip the 20-move theoretical duel. The Jobava London starts 1.d4, 2.Nc3, 3.Bf4. A book player prepared 2.c4, or the quiet London with 2.Nf3. 2.Nc3 is already a different game: you can build e4, and the knight can jump to b5 against c7. No fifteen moves of classical theory. Tension on move 3.',
      },
      {
        type: 'move',
        fen: JOBAVA,
        prompt: 'This is the Jobava setup after 1.d4 d5 2.Nc3. Develop the dark-squared bishop before Nf3. That is the sideline.',
        line: ['c1f4'],
        hint: 'Bf4. The bishop takes the diagonal, and you have not played the move they prepared against.',
        success: 'Bf4, and you never entered their Queen\'s Gambit file. The next idea in many lines is Nb5, hitting c7.',
      },
      {
        type: 'move',
        fen: JOBAVA_JUMP,
        prompt: 'Black has developed the knight and has not played c6. Use the Jobava knight. Jump in and attack c7.',
        line: ['c3b5'],
        hint: 'Nb5. From b5 the knight attacks c7. They have to deal with a threat on move 4, not a memorized plan.',
        success: 'Nb5 is not a 20-move line. It is an immediate problem. That is the whole point of the sideline.',
      },
      {
        type: 'talk',
        fen: LARSEN,
        text: '1.b3, the Nimzowitsch-Larsen, or 1.Nf3 and then b3, does the same job more quietly. Black\'s drawish files against 1.e4 and 1.d4 never appear. You put a bishop on the long diagonal and play by feel: squares, pressure, pawn breaks. General judgement beats a list of moves they do not have.',
      },
      {
        type: 'move',
        fen: LARSEN,
        prompt: 'The b-pawn is already on b3. Put the bishop on the long diagonal.',
        line: ['c1b2'],
        hint: 'Bb2. The bishop looks through the center from the flank.',
        success: 'No theory contest. The game will be about that diagonal and whatever pawn structure you choose next.',
      },
      {
        type: 'talk',
        text: 'With Black, do not defend their favorite main line. Against 1.d4, a Benko idea gives a pawn for the a-file, the b-file, and lasting dark-square pressure. Book players like a safe space advantage. An extra pawn with no active plan makes them uncomfortable. Against 1.e4, 1...Nc6 ignores the textbook "pawns in the center first." It invites 2.d4 d5 and a structure they rarely study. A Modern or Pirc move order does the same: you choose the structure, they do not get their book.',
      },
      {
        type: 'move',
        fen: BENKO,
        prompt: 'White played 1.d4 Nf6 2.c4 c5 3.d5. Offer the Benko pawn. Push the b-pawn two squares.',
        line: ['b7b5'],
        hint: 'b5. You are giving the pawn on purpose, for the open queenside files that follow.',
        success: 'They can take the pawn. Then your plan is the a-file and the b-file, not winning the pawn back next move. They are the ones who have to find a plan.',
      },
      {
        type: 'move',
        fen: NIMZO,
        prompt: 'White played 1.e4. Do not play the pawn move they prepared against. Develop the queen\'s knight first.',
        line: ['b8c6'],
        hint: 'Nc6. It fights for d4 and e5 without stepping into a main-line Ruy Lopez or a Sicilian they know by heart.',
        success: '1...Nc6 is the Nimzowitsch Defense. If they play 2.d4, you can strike with d5. The book they brought to the board is the wrong book.',
      },
      {
        type: 'recap',
        title: 'Break their move order in the middlegame too',
        numbered: true,
        text: 'Book players remember attacks in a fixed order. Change the order.',
        items: [
          { title: 'Delay castling', text: 'If the center is closed, leave the king on e1 or e8 a little longer. Their pieces were aimed at a castled king. Those routes lose their target.' },
          { title: 'Push a flank pawn early', text: 'h4, h5, a4 or a5 before the "correct" development is finished. They have to judge a threat that is not in the model game.' },
          { title: 'Ruin the structure on purpose', text: 'Trade a bishop for a knight if it doubles their pawns in an ugly way. Textbook "good bishop" rules stop helping them.' },
          { title: 'The exchange sacrifice', text: 'A rook for a knight or bishop on c3, c6, f3 or f6 can smash a pawn shield. Even a position the engine calls equal is miserable to play from memory.' },
        ],
      },
      {
        type: 'move',
        fen: FLANK,
        prompt: 'Both kings are not the point yet: yours is still on e1, and the center is closed. Before you castle, push the h-pawn and make them think.',
        line: ['h2h4'],
        hint: 'h4. You are not castling into the attack they prepared. You are starting one they have not looked at.',
        success: 'h4, king still in the center, center still closed. Their standard defensive setup has nothing to bite on yet.',
      },
      {
        type: 'move',
        fen: EXCHANGE,
        prompt: 'Their knight on c3 is the piece holding the center together, and your rook on c8 can take it. Give up the exchange.',
        line: ['c8c3'],
        hint: 'Rxc3. They can recapture with the b-pawn. That is the sacrifice: their queenside pawns are the ones that suffer.',
        success: 'A rook for a knight, and their pawn on b2 has to decide what the queenside looks like. No model game covers the next ten moves for them.',
      },
      {
        type: 'quiz',
        question: 'They play a quiet move and stare at you, as if you must defend something. Nothing of yours is actually attacked. What do you do?',
        options: [
          { text: 'Ignore the pose and play your own active plan', correct: true, why: 'A ghost threat is only a threat if it wins material or mates. If it does neither, answering it is the passive move they wanted.' },
          { text: 'Make a defensive move, to be safe', why: 'That is the point of the pose. You spend a tempo on a threat that was never real.' },
          { text: 'Offer a draw, because they look confident', why: 'Confidence from a memorized face is not a threat. Check the board.' },
        ],
      },
      {
        type: 'recap',
        title: 'Make them calculate, then use the clock',
        text: 'They will play the first ten or fifteen moves in under half a minute. Your aim is a position that stops that.',
        items: [
          { title: 'Book-friendly', text: 'A closed center, one pawn break, symmetrical pawns, pieces that never touch. They can play this on memory.' },
          { title: 'Human-friendly, for you', text: 'An open center, asymmetrical pawn islands, and attacks on both wings at once. Every move is a choice, not a recollection.' },
          { title: 'The clock', text: 'Once they spend five minutes on move 6, keep the position messy. Do not simplify back into a structure they know.' },
        ],
      },
      {
        type: 'recap',
        title: 'How to practice this before a tournament',
        numbered: true,
        text: 'Three short sessions beat another evening of main-line memorization.',
        items: [
          { title: 'Openings, 30 minutes', text: 'One White sideline, Jobava London or 1.b3. One Black idea, the Benko pawn or 1...Nc6. Learn the pawn structure and the piece squares, not a long line.' },
          { title: 'Out-of-book puzzles, 30 minutes', text: 'Material that is not a normal trade: rook and pawn against two minor pieces, or pawn races with a king still in the center.' },
          { title: 'Speed games, two or three', text: 'Play an off-beat move by move 5. Then use the time they spend thinking. That is the whole strategy, at tournament speed.' },
        ],
      },
    ],
  },
];
