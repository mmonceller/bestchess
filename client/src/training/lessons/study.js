/*
 * Advanced Study: harder lessons for players who already play. The ideas overlap
 * earlier worlds on purpose, but the positions and the questions are stricter.
 */
const STOP_KNIGHT = 'r1bq1rk1/pp2bppp/2np1n2/4p3/4P3/3P1N2/PPP1BPPP/RNBQ1RK1 w - - 0 1';
const CARLSBAD = 'r1bq1rk1/pp1n1ppp/2p1pn2/3p4/3P4/2NBPN2/PP3PPP/R1BQ1RK1 w - - 0 1';
const IQP = 'r1bq1rk1/pp3ppp/2n1pn2/8/3P4/2N1BN2/PP2BPPP/R2Q1RK1 w - - 0 1';
const HANGING = 'r1bq1rk1/pp3ppp/2n1pn2/8/2PP4/2N1BN2/PP3PPP/R2QKB1R w KQ - 0 1';
const WORST_PIECE = 'r1bq1rk1/pp2bppp/2n1pn2/3p4/3P4/P1N1PN2/1P3PPP/R1BQKB1R w KQ - 0 1';
const QUIET = 'r1bq1rk1/pppp1ppp/2n2n2/4p3/1bB1P3/2N2N2/PPPP1PPP/R1BQK2R w KQ - 0 1';
const PAWN_UP = '4k3/8/8/3p4/4B3/8/8/4K3 w - - 0 1';
const COMPLICATE = '6k1/5ppp/8/8/8/6q1/5P1P/5QK1 w - - 0 1';
const SCHEME = '8/4k3/4p3/8/4P3/8/4K3/8 w - - 0 1';
const ROOK_ACTIVE = '6k1/p4ppp/8/8/8/8/r4PPP/4R1K1 w - - 0 1';
const TABIYA = 'r1bq1rk1/pppp1ppp/2n2n2/2b1p3/2B1P3/3P1N2/PPP2PPP/RNBQ1RK1 w - - 0 1';

export const studyLessons = [
  {
    id: 's-prophylaxis',
    track: 'study',
    title: 'Prophylaxis',
    coach: 'mira',
    summary: 'Find the opponent\'s dream setup and take it away before it starts.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'A puzzle asks, "What is the threat right now?" A stronger question is, "What is their plan if I give them two free moves?" Prophylaxis means making a useful move that stops that plan before it begins.',
      },
      {
        type: 'recap',
        title: 'Think from their side first',
        numbered: true,
        text: 'Before you improve your own pieces, answer three questions:',
        items: [
          { title: 'Their dream', text: 'Which square, file or pawn break would make their position easy?' },
          { title: 'The stop', text: 'Which calm move takes that idea away, or makes it cost them something?' },
          { title: 'Your plan second', text: 'Only then improve your worst piece. A stopped plan is already a small win.' },
        ],
      },
      {
        type: 'quiz',
        fen: STOP_KNIGHT,
        question: 'Black\'s knight on c6 would love one square. Which one?',
        options: [
          { text: 'd4, a protected outpost in the middle of your position', correct: true, why: 'From d4 the knight stares at your camp and is hard to kick. That is the plan to stop.' },
          { text: 'b4, to attack the a2-pawn', why: 'b4 is a one-move nuisance. d4 is the square they want to live on.' },
          { text: 'a5, to trade itself for your bishop', why: 'Trading is possible later. The dream is the outpost, not the trade.' },
        ],
      },
      {
        type: 'move',
        fen: STOP_KNIGHT,
        prompt: 'Stop ...Nd4 before it happens. Do it with a pawn move that also helps your center.',
        line: ['c2c3'],
        hint: 'A pawn on c3 covers d4. The knight can no longer sit there.',
        success: 'c3 is not a tactic. It simply deletes Black\'s best idea. That is prophylaxis.',
      },
      {
        type: 'quiz',
        question: 'You stopped their plan and have no attack of your own yet. What now?',
        options: [
          { text: 'Improve your least useful piece, now that their idea is gone', correct: true, why: 'Prophylaxis buys you the right to maneuver. The opponent has to find a new plan.' },
          { text: 'Sacrifice something so the game becomes sharp', why: 'You just made their plan worse. There is no need to change the character of the position.' },
          { text: 'Repeat the same stopping move', why: 'The pawn is already on c3. Look for the next small improvement.' },
        ],
      },
    ],
  },
  {
    id: 's-structures',
    track: 'study',
    title: 'Complex Pawn Structures',
    coach: 'lin',
    summary: 'Carlsbad, the isolated queen pawn and hanging pawns: when to keep them and when to change them.',
    minutes: 8,
    steps: [
      {
        type: 'talk',
        text: 'Past a simple pawn chain, three structures decide a lot of serious games. In each one you are not "just attacking a weakness." You are choosing whether the position should open, stay closed, or turn into a different structure.',
      },
      {
        type: 'talk',
        fen: CARLSBAD,
        arrows: [['b2', 'b4'], ['b4', 'b5']],
        text: 'The Carlsbad formation: both sides have pawns on c, d and e, and the c-pawns are on c6 and c3 or c2. White\'s classic plan is a minority attack. Fewer pawns advance on the queenside (b4, b5) to trade and leave Black with a weak pawn on c6.',
      },
      {
        type: 'move',
        fen: CARLSBAD,
        prompt: 'Start the minority attack. The first step is a pawn move, not a piece move.',
        line: ['b2b4'],
        hint: 'Push the b-pawn. The next idea, later, is b5, trading off Black\'s c6-pawn.',
        success: 'b4 begins the plan. You are not winning a pawn today. You are choosing the structure you want in ten moves.',
      },
      {
        type: 'quiz',
        fen: IQP,
        question: 'White\'s d-pawn is isolated: no pawn on c or e can defend it. When is that pawn a strength?',
        options: [
          { text: 'In the middlegame, while your pieces use the space and the d5 break', correct: true, why: 'The isolated pawn gives you room and a half-open c-file and e-file. Trade into an ending and it becomes a target.' },
          { text: 'Only after the queens are traded', why: 'Without queens, the pawn is easier to attack and harder to use as a wedge.' },
          { text: 'Never — an isolated pawn is always a mistake', why: 'Many openings accept it on purpose, because the piece play comes first.' },
        ],
      },
      {
        type: 'quiz',
        fen: HANGING,
        question: 'Hanging pawns stand side by side on c4 and d4, with no b-pawn or e-pawn beside them. What is the key decision?',
        options: [
          { text: 'Whether to push one of them and open a file, or keep the tension', correct: true, why: 'c5 or d5 can clamp the opponent, or it can leave you with an isolated pawn. Wait until the push gains something concrete.' },
          { text: 'Always push both pawns as far as they go', why: 'Each push changes which pawn is weak and which file opens. One of them is often the mistake.' },
          { text: 'Trade them off at the first chance', why: 'The pawns are your space. Trading them too soon gives up the only thing they were good for.' },
        ],
      },
    ],
  },
  {
    id: 's-maneuver',
    track: 'study',
    title: 'The Art of Maneuvering',
    coach: 'elena',
    summary: 'When nothing is hanging, find your worst piece and spend several moves improving it.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'If there is no tactic, many players repeat moves or start an attack with the wrong piece. Maneuvering is slower. You name your worst piece, pick its best square, and allow three or four moves to get it there.',
      },
      {
        type: 'quiz',
        fen: WORST_PIECE,
        question: 'Every piece is on the board and nothing is en prise. Which piece is doing the least?',
        options: [
          { text: 'The dark-squared bishop on c1, still on its starting square', correct: true, why: 'The knights and the light-squared bishop already have squares. The c1-bishop is the piece to improve.' },
          { text: 'The knight on f3, because it is not checking', why: 'That knight already influences the center. "Not checking" does not make a piece bad.' },
          { text: 'The rook on a1, because the a-file is closed', why: 'Rooks often wait. The bishop that has not moved is the clearer problem.' },
        ],
      },
      {
        type: 'move',
        fen: WORST_PIECE,
        prompt: 'Start the maneuver. Give the dark-squared bishop a square, then you will be able to castle.',
        line: ['c1d2'],
        hint: 'Bd2 develops the bishop without blocking your center. Castling comes next.',
        success: 'One quiet move. The maneuver is not finished — the bishop may later go to c3 or e1 — but it has joined the game.',
      },
      {
        type: 'recap',
        title: 'A maneuver is a route, not a single move',
        numbered: true,
        text: 'Use the same checklist whenever the position is calm:',
        items: [
          { title: 'Name the worst piece', text: 'The one with the fewest squares, or the one still on its home square.' },
          { title: 'Name the square', text: 'Where would that piece attack something, or stop their plan?' },
          { title: 'Count the route', text: 'If it takes three moves, play them, as long as each one does not lose material.' },
        ],
      },
    ],
  },
  {
    id: 's-evaluate',
    track: 'study',
    title: 'Evaluation or Calculation',
    coach: 'kai',
    summary: 'Puzzles teach you how to calculate. Games teach you when calculating is a waste of the clock.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'Calculating everything on every move is how strong players fall into time trouble. Most moves are "normal": they improve a piece or keep the structure. You calculate when the position is forcing — checks, captures and one-move threats. Everywhere else, a judgement is enough.',
      },
      {
        type: 'recap',
        title: 'Two different jobs',
        text: 'The same player has to switch hats:',
        items: [
          { title: 'The puzzle habit', text: 'Find the forced line. There is a correct move and the rest lose.' },
          { title: 'The game habit', text: 'Ask whether the position is forcing. If it is not, choose a useful move and save the clock.' },
          { title: 'The critical moment', text: 'When a capture, a pawn break or a king in the center appears, stop and calculate for real.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Which moment deserves a long calculation?',
        options: [
          { text: 'A capture is available, or your king and their king are both still in the center', correct: true, why: 'Those positions have forcing branches. A quiet bishop move with both kings safe does not.' },
          { text: 'Every move after move 10, so you never miss a tactic', why: 'You will find some tactics and lose the game on the clock anyway.' },
          { text: 'Only the endgame', why: 'A middlegame sacrifice is exactly when the clock should be spent.' },
        ],
      },
      {
        type: 'move',
        fen: QUIET,
        prompt: 'Nothing is forcing. Make the normal move: bring the king to safety and connect the rooks.',
        line: ['e1g1'],
        hint: 'Castle kingside. You can look at a3 or d3 afterwards, with your king safe.',
        success: 'Castling did not need a five-move calculation. You kept the time for the moment the center opens.',
      },
    ],
  },
  {
    id: 's-material',
    track: 'study',
    title: 'Practical Materialism',
    coach: 'viktor',
    summary: 'Hold an ugly extra pawn, or give material back only when the compensation is real and long-term.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'Being a pawn up often looks worse before it looks better. Your pieces are passive and their pieces are pretty. The practical skill is knowing when that ugliness is fine — and when you should give the pawn back, or give even more, for something that lasts.',
      },
      {
        type: 'quiz',
        question: 'You are a pawn up. Your position is cramped, but nothing is hanging and their attack does not quite work. What is the practical choice?',
        options: [
          { text: 'Defend the ugly position and keep the pawn', correct: true, why: 'If their compensation is only "it looks nice," the pawn wins later. Do not return it out of discomfort.' },
          { text: 'Give the pawn back immediately so the pieces look better', why: 'Only give it back when you can name what you get: a file, a square, or the end of their attack.' },
          { text: 'Sacrifice a piece too, to complicate', why: 'Complicating from a won position is how won positions are lost.' },
        ],
      },
      {
        type: 'move',
        fen: PAWN_UP,
        prompt: 'The pawn is loose and the capture is safe. Take it. Pretty play can wait.',
        line: ['e4d5'],
        hint: 'The bishop on e4 captures the pawn on d5. The black king does not attack that square.',
        success: 'A pawn in the bag. The rest of the game is technique, not a new idea.',
      },
      {
        type: 'quiz',
        question: 'When is giving up material the strong decision, not a swindle?',
        options: [
          { text: 'When you can name the compensation: an open file, a square, or a pawn that is a passer', correct: true, why: 'A positional sacrifice is a trade. You pay a pawn or the exchange and you can point at what you bought.' },
          { text: 'Whenever you are bored with a quiet position', why: 'Boredom is not compensation. Quiet and a pawn up is a good life.' },
          { text: 'Only if a tactic wins the material back on the next move', why: 'That is a combination, not a positional sacrifice. The point of the second kind is that the material does not come back at once.' },
        ],
      },
    ],
  },
  {
    id: 's-swindle',
    track: 'study',
    title: 'Resilience and Swindling',
    coach: 'rook',
    summary: 'When you are lost, stop playing the "correct" losing move and make their job as hard as you can.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'The objectively best move in a lost position is often a polite trade into a lost ending. Your opponent still has to play the moves. A swindle is not hope without a reason. It is a choice to keep pieces on, give check, and leave them a chance to go wrong.',
      },
      {
        type: 'quiz',
        question: 'You are losing. The engine\'s best move trades queens into a pawn ending two pawns down. A check keeps the queens on and gives them a chance to stumble. What do you play?',
        options: [
          { text: 'The check, if it does not lose even faster', correct: true, why: 'Two pawns down with queens off is a lesson they can win in their sleep. Queens on is a game they can mess up.' },
          { text: 'The trade, because it is the best move', why: '"Best" here means you lose more slowly against perfect play. Your opponent is not perfect. Give them a chance to prove it.' },
          { text: 'Resign at once', why: 'Resign when there is no check, no passer and no trick. A check is still a chance.' },
        ],
      },
      {
        type: 'move',
        fen: COMPLICATE,
        prompt: 'Their queen on g3 is checking down the open file. Step the king aside and keep both queens on the board.',
        line: ['g1h1'],
        hint: 'Kh1 leaves the g-file. The queen stays on the board, so they still have to find the win.',
        success: 'You are still losing. You are also still in the game, and they have to find the win with a clock running.',
      },
      {
        type: 'quiz',
        question: 'Which losing position is worth fighting, and which should you resign?',
        options: [
          { text: 'Fight when you still have a check, a passer, or pieces that can coordinate. Resign when none of those exist', correct: true, why: 'A swindle needs a ingredient. Shuffling a lone king is not resilience. It is delaying the handshake.' },
          { text: 'Fight every position to checkmate, no matter how little is left', why: 'Opponents notice. Save the fight for positions that can actually turn.' },
          { text: 'Resign whenever you are a pawn down', why: 'A pawn down is often the side that should be happy to defend. That is the previous lesson, not this one.' },
        ],
      },
    ],
  },
  {
    id: 's-scheme',
    track: 'study',
    title: 'Scheming in the Endgame',
    coach: 'lin',
    summary: 'Picture the winning setup first, then walk the pieces there. Do not calculate from an empty plan.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'A lot of endgames are not a long line. They are a picture. "If my king reaches e5 and the rooks come off, the pawn queens." You work backward from that picture: which trade, which king step, which pawn move makes the picture legal.',
      },
      {
        type: 'quiz',
        fen: SCHEME,
        question: 'White\'s pawn is on e4, Black\'s on e6. What is the winning picture, before you touch a piece?',
        options: [
          { text: 'White\'s king on d5 or f5, so it can step into e6 or support the pawn\'s advance', correct: true, why: 'The pawn on e4 cannot move until the black pawn is attacked or the king outflanks. The king is the piece that makes the picture.' },
          { text: 'Push the e-pawn as soon as it is legal', why: 'e5 right now gives Black the d5 and f5 squares and may throw the pawn away.' },
          { text: 'Trade kings by walking onto the same square', why: 'Kings cannot capture each other. One of them has to give way. That is the scheme.' },
        ],
      },
      {
        type: 'move',
        fen: SCHEME,
        prompt: 'Start the outflank. Step the king toward the wing so it can reach d5.',
        line: ['e2d3'],
        accept: { 0: ['e2d3', 'e2f3', 'e2d2', 'e2f2'] },
        hint: 'Move the king off the e-file, toward d or f. Both wings are the start of the same scheme.',
        success: 'The king is on its way. Black has to choose a side, and you take the other one.',
      },
      {
        type: 'quiz',
        question: 'You can trade rooks and reach a king-and-pawn ending you already know is won. What do you do?',
        options: [
          { text: 'Trade. The scheme you pictured is the win. Do not keep calculating once the picture is on the board', correct: true, why: 'The trade is the last step of the plan, not a new problem.' },
          { text: 'Keep the rooks, in case there is a prettier win', why: 'Pretty is how won endings become drawn endings.' },
          { text: 'Calculate every defense to move 40 before you trade', why: 'If the king and pawn ending is a known win, the trade is the calculation.' },
        ],
      },
    ],
  },
  {
    id: 's-activity',
    track: 'study',
    title: 'Dynamic Defense',
    coach: 'elena',
    summary: 'In a worse rook ending, an active rook is often worth more than the pawn you are down.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'Rook endings forgive a missing pawn and punish a passive rook. If you are worse, the losing plan is to tie your rook to a pawn. The drawing plan is to put the rook on the seventh rank, check the king, and attack their pawns.',
      },
      {
        type: 'quiz',
        fen: ROOK_ACTIVE,
        question: 'Black\'s rook is already on a2, and you are a pawn down. What is the failure?',
        options: [
          { text: 'Using your rook to babysit a pawn while their rook eats the others', correct: true, why: 'One passive rook against one active rook is how a one-pawn deficit becomes three.' },
          { text: 'Giving check, because checks are rude in the endgame', why: 'Checks are how the defending rook stays active. Take them.' },
          { text: 'Trading rooks when you are a pawn down', why: 'Trading rooks a pawn down is usually the loss. Activity is the reason not to trade.' },
        ],
      },
      {
        type: 'move',
        fen: ROOK_ACTIVE,
        prompt: 'Activate the rook. Put it on the seventh rank, where it attacks their pawns instead of guarding yours.',
        line: ['e1e7'],
        hint: 'Re7. The rook attacks f7 and eyes a7. Their rook on a2 is no longer the only active piece.',
        success: 'You are still a pawn down. Your rook is the one asking the questions now.',
      },
      {
        type: 'quiz',
        question: 'Their rook is stuck defending a pawn, and yours is on the seventh rank. Should you trade rooks?',
        options: [
          { text: 'No. Your activity is the compensation. Trade only if the pawn ending is drawn or won', correct: true, why: 'The active rook is the asset. Cash it in only when the resulting ending is safe.' },
          { text: 'Yes, trades always simplify a defense', why: 'They simplify into the pawn ending you were trying to avoid.' },
          { text: 'Yes, because you are a pawn down and trades reduce their winning chances', why: 'A pawn ending a pawn down is often a dead loss. The rook is what keeps you alive.' },
        ],
      },
    ],
  },
  {
    id: 's-tabiya',
    track: 'study',
    title: 'Tabiyas and Middlegame Plans',
    coach: 'mira',
    summary: 'Learn the standard position of an opening, not twenty moves of memory. Know the breaks, the pieces and the ending it leads to.',
    minutes: 8,
    steps: [
      {
        type: 'talk',
        text: 'A tabiya is the position an opening is trying to reach: the pieces are developed, the pawns have a shape, and the real game is about to start. Memorizing moves before that position is fragile. Knowing the tabiya means you know the pawn break, where the pieces belong, and which ending the structure wants.',
      },
      {
        type: 'talk',
        fen: TABIYA,
        text: 'This is a normal Italian tabiya. Both bishops are on c4 and c5, the kingside knights are developed, both sides have castled, and the center is not yet open. White\'s idea is not a one-move trick. It is c3 and d4, asking Black\'s bishop and the e5-pawn what they want to do.',
      },
      {
        type: 'move',
        fen: TABIYA,
        prompt: 'Play the move that prepares the d4 break. Do not open the center yet.',
        line: ['c2c3'],
        hint: 'c3 supports a later d4 and also gives the c4-bishop a retreat square if it is attacked.',
        success: 'c3 is the tabiya move. d4 comes when you are ready for the position it creates, not because the move is on a list.',
      },
      {
        type: 'quiz',
        fen: TABIYA,
        question: 'You know the tabiya. Which three things should you be able to say about it?',
        options: [
          { text: 'The pawn break, the best squares for the pieces, and the ending the structure tends toward', correct: true, why: 'Those three replace a long line of memorized moves. If the opponent leaves the book, you still have a plan.' },
          { text: 'The next twelve moves for both sides, in order', why: 'They will leave that order. The plan survives. The list does not.' },
          { text: 'Only the trap, so you can win if they fall for it', why: 'A trap is a bonus. The tabiya is the position you get when they do not fall for it.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Black plays an unexpected move on move 6 and your memorized line is over. What do you use?',
        options: [
          { text: 'The tabiya plan: the same break and the same piece squares, adjusted to what they just changed', correct: true, why: 'An unexpected move changes one detail. It does not delete the structure.' },
          { text: 'A new opening, starting from move 1 in your head', why: 'The pieces are already on the board. Play the position you have.' },
          { text: 'The first check you can find', why: 'A check with no plan is how a prepared position becomes a bad one.' },
        ],
      },
    ],
  },
];
