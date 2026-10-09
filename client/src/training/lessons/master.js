/*
 * Master track: unlocked only after every other lesson is finished and the player's
 * pattern training and game results show they are ready (see training/mastery).
 */
export const masterLessons = [
  {
    id: 'm-calculation',
    track: 'master',
    title: 'Calculate Like a Master',
    coach: 'lin',
    summary: 'Candidate moves, forcing lines and the final blunder check.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        text: 'Masters don\'t calculate everything. They pick two or three candidate moves — checks, captures and threats first — and follow each one until the position goes quiet: no more checks, captures or threats.',
      },
      {
        type: 'quiz',
        question: 'When can you stop calculating a line?',
        options: [
          { text: 'When there are no more checks, captures or threats', correct: true, why: 'A quiet position can be judged by simply counting material and looking at piece activity.' },
          { text: 'After exactly three moves', why: 'Some lines end after one move, others after ten. Stop when it goes quiet.' },
          { text: 'When you find a check', why: 'A check is often the start of a line, not the end.' },
        ],
      },
      {
        type: 'move',
        fen: '4k3/8/8/8/8/8/8/RR4K1 w - - 0 1',
        prompt: 'Calculate the forcing line to the end: checkmate in two.',
        line: ['b1b7', 'e8f8', 'a1a8'],
        accept: { 0: ['b1b7', 'a1a7'] },
        hint: 'One rook cuts off a row, the other gives the final check.',
        success: 'A rook ladder: one rook builds a wall, the other delivers mate.',
      },
      {
        type: 'move',
        fen: '8/8/8/q3k3/8/8/2K5/7Q w - - 0 1',
        prompt: 'The queens are on the same row. Find the forcing check that wins Black\'s queen.',
        line: ['h1h5', 'e5d6', 'h5a5'],
        hint: 'Check the king along the 5th row. When it steps away, what\'s behind it?',
        success: 'A skewer! The king had to move, and the queen behind it fell.',
      },
      {
        type: 'quiz',
        question: 'You\'ve found a great move. What do masters do before playing it?',
        options: [
          { text: 'A final blunder check: imagine the move is played and look for the opponent\'s checks, captures and threats', correct: true, why: 'Ten seconds of checking saves many games.' },
          { text: 'Play it fast to save time', why: 'Speed is good, but a quick blunder check is worth it.' },
          { text: 'Look for an even more beautiful move', why: 'Good enough and safe beats beautiful and risky.' },
        ],
      },
    ],
  },
  {
    id: 'm-intermezzo',
    track: 'master',
    title: 'The In-Between Move',
    coach: 'viktor',
    summary: 'Don\'t recapture on autopilot — the zwischenzug that wins more.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'Club players recapture automatically. Masters pause and ask: is there a stronger move first? A check or a bigger threat played "in between" is called a zwischenzug. The recapture usually waits for you.',
      },
      {
        type: 'move',
        fen: '4k3/8/8/3q4/8/8/4N3/4R1K1 w - - 0 1',
        prompt: 'One move, two threats: uncover a check AND attack the queen.',
        line: ['e2c3', 'e8d7', 'c3d5'],
        hint: 'Your knight blocks the rook on e1. Move it to a square that also hits d5.',
        success: 'Discovered check! Black must deal with the king, so the queen falls.',
      },
      {
        type: 'move',
        fen: 'R7/8/8/8/3k3r/8/8/6K1 w - - 0 1',
        prompt: 'The black king and rook share a row. Check first, collect later.',
        line: ['a8a4', 'd4e3', 'a4h4'],
        hint: 'Your rook can check along the 4th row — with the black rook behind the king.',
        success: 'Check, then capture. The king couldn\'t protect its rook in time.',
      },
      {
        type: 'quiz',
        question: 'Your opponent captures a piece. You can recapture — or give a check that also attacks their queen. What\'s usually best?',
        options: [
          { text: 'The check first — then recapture afterwards', correct: true, why: 'The check forces a reply, you win the queen, and the recapture is still there next move.' },
          { text: 'Recapture right away', why: 'You\'d miss winning the queen.' },
          { text: 'Neither — retreat', why: 'There\'s no reason to retreat with such a strong option.' },
        ],
      },
      {
        type: 'quiz',
        question: 'When is an in-between move a bad idea?',
        options: [
          { text: 'When it gives your opponent time to save the piece you were going to recapture', correct: true, why: 'An in-between move only works if it forces a reply, like a check or a bigger threat.' },
          { text: 'Never — it\'s always good', why: 'A slow in-between move lets your opponent escape with the material.' },
          { text: 'When it\'s a check', why: 'Checks are the most forcing in-between moves.' },
        ],
      },
    ],
  },
  {
    id: 'm-prophylaxis',
    track: 'master',
    title: 'Prophylaxis: Kill the Plan',
    coach: 'mira',
    summary: 'Find your opponent\'s best idea — then make it impossible.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Every move, masters ask: "If it were my opponent\'s turn, what would they play?" If the answer is dangerous, they stop it before it happens. That\'s prophylaxis — prevention instead of cure.',
      },
      {
        type: 'quiz',
        question: 'Your opponent\'s bishop wants to land on b4 and pin your knight. Which move is prophylaxis?',
        options: [
          { text: 'A pawn move like a3 that takes b4 away', correct: true, why: 'One small pawn move removes their best idea.' },
          { text: 'Ignoring it and attacking on the kingside', why: 'Once the pin arrives, your attack may lose its key defender.' },
          { text: 'Moving the knight away from the centre', why: 'That\'s passive and gives up central control.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your king has castled. Your opponent is lining up a queen and bishop on the h7 square. What\'s a prophylactic idea?',
        options: [
          { text: 'Bring a knight to f6 (or f3) to guard h7 (or h2)', correct: true, why: 'A knight there blocks the diagonal and defends the target.' },
          { text: 'Push all your kingside pawns', why: 'That usually creates more weaknesses around your king.' },
          { text: 'Trade off your own bishop for a knight', why: 'That doesn\'t address the battery.' },
        ],
      },
      {
        type: 'quiz',
        question: 'What\'s the biggest benefit of prophylaxis?',
        options: [
          { text: 'Your opponent runs out of good plans and starts making mistakes', correct: true, why: 'Players without a plan drift. That\'s when they go wrong.' },
          { text: 'It always wins material straight away', why: 'Prophylactic moves are usually quiet — the reward comes later.' },
          { text: 'It saves time on the clock', why: 'It actually costs thinking time — but it pays off.' },
        ],
      },
    ],
  },
  {
    id: 'm-endgame',
    track: 'master',
    title: 'Endgame Technique',
    coach: 'lin',
    summary: 'The rule of the square, stalemate traps and the rook checkmate.',
    minutes: 8,
    steps: [
      {
        type: 'talk',
        fen: '8/8/8/P7/8/8/8/K6k b - - 0 1',
        highlights: ['a5', 'a8', 'd8', 'd5'],
        text: 'The rule of the square: draw an imaginary square from the pawn to its promotion row. If the enemy king can step inside that square, it catches the pawn. Here Black\'s king on h1 is far outside — the pawn runs home.',
      },
      {
        type: 'quiz',
        question: 'A white pawn on a5, the black king on e5, and it\'s Black\'s turn. Can the king catch the pawn?',
        options: [
          { text: 'Yes — it steps into the square with ...Kd6 (or ...Kd5)', correct: true, why: 'The pawn\'s square runs from a5 to d8. One step puts the king inside it.' },
          { text: 'No, the pawn is too fast', why: 'Count it: after ...Kd6 the king is inside the square and reaches a8 in time.' },
          { text: 'Only if White blunders', why: 'It\'s a forced catch — the rule of the square says so.' },
        ],
      },
      {
        type: 'move',
        fen: 'k7/8/8/2K5/8/8/8/1Q6 w - - 0 1',
        prompt: 'Mate in two — but watch out for stalemate traps.',
        line: ['c5c6', 'a8a7', 'b1b7'],
        wrong: { b1b6: 'Careful — that\'s stalemate! The black king has no moves but isn\'t in check.' },
        hint: 'Bring your king closer first. Black only has one move left after that.',
        success: 'Your king came closer, Black was forced to a7, and the queen mated on b7.',
      },
      {
        type: 'drill',
        fen: '8/8/8/4k3/8/8/8/R3K3 w - - 0 1',
        goal: 'mate',
        moves: 30,
        level: 5,
        prompt: 'The master test: checkmate with king and rook against the computer in 30 moves.',
        hint: 'Use the rook to cut the board in half, then bring your king up. Push the enemy king to the edge, row by row.',
        success: 'Checkmate with a lone rook! That\'s real endgame technique.',
      },
    ],
  },
  {
    id: 'm-tournament',
    track: 'master',
    title: 'Think Like a Tournament Player',
    coach: 'elena',
    summary: 'The rules, habits and nerves that decide real competitive games.',
    minutes: 5,
    steps: [
      {
        type: 'recap',
        title: 'Tournament rules you must know',
        text: 'These rules decide real games every day:',
        items: [
          { label: 'Touch', title: 'Touch-move', text: 'Deliberately touch a piece and you must move it, if it has a legal move.' },
          { label: '×3', title: 'Threefold repetition', text: 'The same position three times, same player to move: a draw can be claimed.' },
          { label: '50', title: 'Fifty-move rule', text: '50 moves each with no capture and no pawn move: a draw can be claimed.' },
          { label: 'K+N', title: 'Not enough material', text: 'King and knight (or bishop) against a lone king can\'t mate — it\'s a draw.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You have only a king and a bishop left; your opponent has a lone king. What\'s the result?',
        options: [
          { text: 'A draw — a lone bishop can\'t force checkmate', correct: true, why: 'There isn\'t enough material to mate, so the game is drawn.' },
          { text: 'A win if you play well', why: 'Even perfect play can\'t mate with king and bishop alone.' },
          { text: 'The game continues until move 50', why: 'With insufficient material, the game ends as a draw immediately.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You accidentally brush a piece while reaching for another. Must you move it?',
        options: [
          { text: 'No — touch-move only applies to deliberate touches. Say "I adjust" before straightening pieces.', correct: true, why: 'Accidental touches don\'t count, but always announce adjustments.' },
          { text: 'Yes, any touch counts', why: 'Only deliberate touches count.' },
          { text: 'Only in blitz', why: 'The rule is the same in every time control.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You\'ve just blundered a piece. What should you do on the next move?',
        options: [
          { text: 'Take a breath, reset, and look for the most stubborn defence', correct: true, why: 'The worst mistakes come right after a blunder, when you\'re upset. Calm down first.' },
          { text: 'Attack immediately to get the material back', why: 'Rushing after a blunder usually leads to a second one.' },
          { text: 'Resign straight away', why: 'Games are often saved after a blunder. Make your opponent prove it.' },
        ],
      },
    ],
  },
];
