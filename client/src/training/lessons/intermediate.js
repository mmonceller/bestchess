const CHAIN = 'r1bqk2r/pp1nbppp/2n1p3/2ppP3/3P1P2/2P2N2/PP1N2PP/R1BQKB1R w KQkq - 0 1';
const PIN = 'r1bqkb1r/ppp2ppp/3p4/4n3/8/2NB4/PPP2PPP/R1BQR1K1 w kq - 0 1';
const THREAT = 'r4rk1/ppp2ppp/2nbp3/8/4P2q/2NP4/PPP2PPP/R1BQ1RK1 w - - 0 1';
const KEY = '4k3/8/8/4K3/4P3/8/8/8 w - - 0 1';
const KP = '8/8/8/3k4/8/8/3KP3/8 w - - 0 1';

export const intermediateLessons = [
  {
    id: 'i-worst-piece',
    track: 'intermediate',
    title: 'Fix Your Worst Piece',
    coach: 'rook',
    summary: 'When you don\'t know what to do, improve the piece that\'s doing the least.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        fen: CHAIN,
        text: 'Books give you long checklists for the middlegame (the part of the game after the opening). I say forget the list. Ask ONE question: which of my pieces is doing the least work right now — and how can I make it better?',
      },
      {
        type: 'find',
        fen: CHAIN,
        prompt: 'Tap White\'s worst piece — the one with the least to do.',
        targets: ['c1'],
        hint: 'Look for a piece stuck behind its own pawns, with no open lines.',
        success: 'The bishop on c1. Its own pawns on c3, d4, e5 and f4 sit on its color and block every diagonal.',
      },
      {
        type: 'quiz',
        fen: CHAIN,
        question: 'Why is that bishop so bad — even if it moves?',
        options: [
          { text: 'Its own pawns sit on its color and block every diagonal', correct: true, why: 'Moving a piece out is not the same as making it useful. A bishop staring at its own pawns stays weak wherever it goes.' },
          { text: 'It hasn\'t moved yet', why: 'Moving it to d2 or e3 changes nothing — it would still be staring at its own pawns.' },
          { text: 'Bishops are weaker than knights here', why: 'White\'s other bishop is fine. The problem is the pawns blocking this one.' },
        ],
      },
      {
        type: 'quiz',
        fen: CHAIN,
        question: 'What is a realistic way to fix it over the next few moves?',
        options: [
          { text: 'Bring it outside the pawn chain (b3, then Ba3) or trade it off', correct: true, why: 'Either give it an open diagonal in front of the pawns, or swap it for one of Black\'s good pieces.' },
          { text: 'Put more pawns on dark squares', why: 'That blocks it even more.' },
          { text: 'Ignore it — it doesn\'t matter', why: 'Over 40 moves, a useless piece is almost like playing a piece down.' },
        ],
      },
      {
        type: 'talk',
        text: 'Now flip it around. Find your opponent\'s BEST piece and trade it off. Find their WORST piece and leave it on the board — let them suffer with it. Many "deep" strategic decisions come down to exactly this.',
      },
    ],
  },
  {
    id: 'i-pin-pile',
    track: 'intermediate',
    title: 'Pin It, Then Hit It',
    coach: 'viktor',
    summary: 'A pinned piece can\'t run. Attack it with your cheapest piece.',
    minutes: 4,
    steps: [
      {
        type: 'talk',
        fen: PIN,
        arrows: [['e1', 'e8']],
        text: 'A pinned piece is stuck: if it moves, something more valuable behind it gets attacked. It\'s like a guard chained to a door — it can\'t run and can\'t chase anyone. Many players admire their pin and do nothing. My rule: once you pin it, attack it — with the cheapest piece you have.',
      },
      {
        type: 'quiz',
        fen: PIN,
        question: 'The black knight on e5 is pinned. What is behind it?',
        options: [
          { text: 'The king on e8 — so the knight can\'t legally move at all', correct: true, why: 'If the knight moved, the rook on e1 would be attacking the king. That\'s against the rules.' },
          { text: 'The queen on d8', why: 'The queen isn\'t on the same line as the rook. Follow the e-file up from e1.' },
          { text: 'Nothing — it isn\'t pinned', why: 'Follow the e-file from your rook on e1: knight, then king.' },
        ],
      },
      {
        type: 'move',
        fen: PIN,
        prompt: 'Attack the pinned knight with your cheapest piece.',
        line: ['f2f4'],
        hint: 'Pawns are the cheapest pieces. Which pawn can attack e5?',
        success: 'Black needs a move to free the knight (like ...Be7 or ...Kf8). Then you capture it with fxe5.',
      },
      {
        type: 'talk',
        text: 'Think of a pin as buying you one free move — the time your opponent needs to un-pin. Spend that move attacking the pinned piece, not somewhere else on the board.',
      },
      {
        type: 'quiz',
        question: 'A knight pinned to its king is "protecting" a pawn. Is that pawn really protected?',
        options: [
          { text: 'No — the pinned knight isn\'t allowed to recapture', correct: true, why: 'Count a defender pinned to the king as zero. It can\'t move, so it can\'t defend.' },
          { text: 'Yes, a defender is a defender', why: 'A defender that isn\'t allowed to move can\'t take back.' },
          { text: 'Only if it\'s Black\'s move', why: 'Whose turn it is doesn\'t un-pin anything.' },
        ],
      },
    ],
  },
  {
    id: 'i-what-they-want',
    track: 'intermediate',
    title: 'What Does My Opponent Want?',
    coach: 'mira',
    summary: 'Stop their plan before it happens — the question strong players always ask.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'The most underrated question in chess isn\'t "what should I do?" It\'s "what does my opponent want to do next?" Ask it first, every move. Often, once you know the answer, your own move becomes obvious. Strong players call this prophylaxis — stopping a plan before it starts.',
      },
      {
        type: 'quiz',
        fen: THREAT,
        question: 'Black just moved the queen to h4. What is Black planning?',
        options: [
          { text: 'Queen takes h2 — checkmate', correct: true, why: 'The bishop on d6 protects the queen when it lands on h2, and the white king can\'t escape.' },
          { text: 'Queen takes e4, winning a pawn', why: 'Possible, but your knight on c3 would just capture the queen back. Look for something bigger.' },
          { text: 'Nothing special', why: 'Two black pieces are aiming at h2. That\'s never "nothing"!' },
        ],
      },
      {
        type: 'best',
        fen: THREAT,
        prompt: 'Now that you know Black\'s plan — stop it.',
        maxLoss: 60,
        hint: 'You can block the bishop\'s diagonal, chase the queen away, or add a defender to h2.',
        success: 'You played the move Black was hoping you wouldn\'t. That\'s prophylaxis!',
      },
      {
        type: 'best',
        fen: 'r1bqkb1r/pppp1ppp/5n2/8/3nP3/2N2Q2/PP3PPP/R1B1KBNR w KQkq - 0 1',
        prompt: 'Your queen is attacked — that part is obvious. But ask Mira\'s question: what ELSE does the knight on d4 want to do?',
        maxLoss: 40,
        hint: 'From d4, the knight can jump to c2 and attack your king and rook at once (a fork). Move the queen to a square that also guards c2.',
        success: 'One move, two problems solved. You saw the threat hiding behind the obvious one.',
      },
      {
        type: 'talk',
        text: 'Notice what happened: you didn\'t calculate long sequences of moves. You asked a simple question, and the answer pointed to the right move. That\'s how strong players "see" so much — they ask better questions.',
      },
    ],
  },
  {
    id: 'i-trade-logic',
    track: 'intermediate',
    title: 'Trade When Ahead, Mix It Up When Behind',
    coach: 'elena',
    summary: 'When to swap pieces off — and when to keep them.',
    minutes: 4,
    steps: [
      {
        type: 'talk',
        text: 'Your feelings often push you the wrong way. When you\'re ahead, you feel brave and want to attack. When you\'re behind, you feel tired and want to trade pieces and hope. Both are backwards! Ahead in material? Trade pieces. Behind? Keep pieces on and make things complicated.',
      },
      {
        type: 'quiz',
        question: 'You are a whole knight ahead. Why do trades help you?',
        options: [
          { text: 'With fewer pieces left, your extra knight matters more', correct: true, why: 'Being 3 points up when there are 40 points on the board is small. Being 3 up when there are only 6 left is decisive.' },
          { text: 'Trades make the game shorter', why: 'A short game isn\'t the goal — winning is.' },
          { text: 'Queens are bad in endgames', why: 'Queens are great! The problem is that YOUR OPPONENT\'S queen can still cause trouble.' },
        ],
      },
      {
        type: 'move',
        fen: '6k1/5ppp/4p3/3q4/3Q4/5N2/PP3PPP/6K1 w - - 0 1',
        prompt: 'You\'re a knight ahead. Black\'s queen is the only piece that could cause trouble. What\'s the cleanest move?',
        line: ['d4d5', 'e6d5'],
        hint: 'Get rid of Black\'s most dangerous piece by trading queens.',
        success: 'Queens are gone. You\'re a knight up and Black has no way to fight back — an easy win.',
      },
      {
        type: 'quiz',
        question: 'You are a pawn behind. Your opponent offers to trade queens. Usually you should…',
        options: [
          { text: 'Avoid the trade and keep the queens on', correct: true, why: 'Queens create threats and chances. An endgame with a pawn less is usually lost.' },
          { text: 'Accept — simpler is safer', why: 'Simpler is safer for the player who is AHEAD.' },
          { text: 'Trade, then trade the rooks too', why: 'Every trade brings you closer to a losing endgame.' },
        ],
      },
      {
        type: 'quiz',
        question: 'When is a trade a BAD idea, even when you\'re ahead?',
        options: [
          { text: 'When it gives your opponent very active pieces or a dangerous pawn', correct: true, why: 'Always picture the position after the trade — don\'t just count the points.' },
          { text: 'Never — trading is always good when ahead', why: 'Every rule has exceptions. Look at what stays on the board.' },
          { text: 'When it\'s still the opening', why: 'The stage of the game isn\'t the issue — the position after the trade is.' },
        ],
      },
    ],
  },
  {
    id: 'i-key-squares',
    track: 'intermediate',
    title: 'Key Squares & Opposition',
    coach: 'lin',
    summary: 'Win king-and-pawn endgames with a simple step-by-step system.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: KEY,
        highlights: ['d6', 'e6', 'f6'],
        text: 'In an endgame with just kings and a pawn, the secret isn\'t the pawn — it\'s certain squares. A pawn on e4 has three key squares: d6, e6 and f6 (glowing). If your king reaches any of them, the pawn will promote no matter what. So the plan is simple: get your king to a key square.',
      },
      {
        type: 'move',
        fen: KEY,
        prompt: 'Step onto a key square.',
        line: ['e5e6'],
        accept: { 0: ['e5e6', 'e5d6', 'e5f6'] },
        hint: 'The key squares are two rows in front of the pawn.',
        success: 'Key square reached — now the win is guaranteed.',
      },
      {
        type: 'talk',
        text: 'What if the enemy king guards the key squares? Use the opposition: put your king directly facing the other king, with one empty square between them. Whoever has to move must step aside — and that lets the other king through.',
      },
      {
        type: 'quiz',
        fen: KP,
        question: 'For the pawn on e2, the key squares are d4, e4 and f4. White to move. Which plan wins?',
        options: [
          { text: 'King to d3, then take the opposition with Ke3 if Black blocks', correct: true, why: 'After 1.Kd3 Ke5 2.Ke3! the kings face each other and Black must step aside, opening a key square.' },
          { text: 'Push the pawn to e4 right away', why: 'The pawn runs ahead of its king and the black king just captures it: 1.e4+ Kxe4, a draw.' },
          { text: 'Shuffle the king back and forth and wait', why: 'Waiting gives Black time to block your king\'s path.' },
        ],
      },
      {
        type: 'drill',
        fen: KP,
        prompt: 'Your turn: promote the pawn within 20 moves against the computer.',
        goal: 'promote',
        moves: 20,
        hint: 'King first, pawn later. Aim for d4, e4 or f4 and use the opposition.',
        success: 'Perfect technique. This ending will win you games for life.',
      },
    ],
  },
];
