const DESPERADO = 'rnbqkb1r/pp3ppp/4pn2/3p4/2B1N3/8/PPPP1PPP/R1BQK1NR w KQkq - 0 1';
const LUCENA = '1K6/1P1k4/8/8/8/8/r7/2R5 w - - 0 1';
const PHILIDOR = '4k3/R7/1r6/4PK2/8/8/8/8 b - - 0 1';
const FRENCH = 'r1bqkbnr/pp3ppp/2n1p3/2ppP3/3P4/2P2N2/PP3PPP/RNBQKB1R b KQkq - 1 4';

export const advancedLessons = [
  {
    id: 'a-desperado',
    track: 'advanced',
    title: 'Doomed Pieces Die Expensive',
    coach: 'rook',
    summary: 'When a piece is lost anyway, make it take something with it.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: DESPERADO,
        arrows: [['d5', 'c4'], ['d5', 'e4']],
        text: 'The usual advice is "save your attacked pieces." My advice: if a piece is going to be lost anyway, make it grab something on its way out. A piece doing that is called a desperado.',
      },
      {
        type: 'quiz',
        fen: DESPERADO,
        question: 'The black pawn on d5 attacks both your bishop and your knight. How many can you save just by moving one away?',
        options: [
          { text: 'Only one — the other is lost', correct: true, why: 'One move can only move one piece. Unless your first move comes with a threat…' },
          { text: 'Both, with the right retreat', why: 'No single move gets both pieces out of danger.' },
          { text: 'None', why: 'You can save one — but you can do even better.' },
        ],
      },
      {
        type: 'move',
        fen: DESPERADO,
        prompt: 'Let the doomed knight capture something WITH check before it dies — then save the bishop.',
        line: ['e4f6', 'd8f6', 'c4b5'],
        accept: { 2: ['c4b5', 'c4b3', 'c4d3', 'c4e2'] },
        hint: 'The knight can capture the black knight on f6, and that gives check.',
        success: 'Your knight traded itself for a knight, and the bishop escaped. Nothing lost!',
      },
      {
        type: 'move',
        fen: '4k3/8/2q5/8/8/8/4B3/4R1K1 w - - 0 1',
        prompt: 'A close cousin: the discovered attack. Move the bishop to uncover the rook\'s attack — and win the queen.',
        line: ['e2b5'],
        accept: { 0: ['e2b5', 'e2f3'] },
        hint: 'Move the bishop out of the rook\'s way, onto a square that also attacks the queen on c6.',
        success: 'The rook gives check, so Black must save the king — and your bishop takes the queen.',
      },
      {
        type: 'quiz',
        question: 'Your opponent just captured one of your pieces. Do you have to capture back right away?',
        options: [
          { text: 'No — first look for an even stronger move, like a check', correct: true, why: 'An in-between move (players call it a zwischenzug) can win more. The recapture is usually still there afterwards.' },
          { text: 'Yes, otherwise you lose material', why: 'The recapture usually waits for you. Check for something stronger first.' },
          { text: 'Only in the endgame', why: 'In-between moves can appear at any stage of the game.' },
        ],
      },
    ],
  },
  {
    id: 'a-lucena',
    track: 'advanced',
    title: 'Lucena: Build the Bridge',
    coach: 'lin',
    summary: 'The key winning method in rook endgames, in 3 clear steps.',
    minutes: 7,
    steps: [
      {
        type: 'talk',
        fen: LUCENA,
        text: 'Endgames with rooks are the most common endgames in chess. Here White should win — but the king is stuck in front of its own pawn, and every time it steps out, Black\'s rook gives check from the side.',
      },
      {
        type: 'quiz',
        fen: LUCENA,
        question: 'How do you stop the never-ending checks?',
        options: [
          { text: 'Build a "bridge": put your rook on the 4th row to block the checks', correct: true, why: 'When the checks come, your rook steps in the way and the checks run out.' },
          { text: 'Run the king toward the black rook', why: 'The rook simply checks from the other side.' },
          { text: 'Push the pawn right now', why: 'You can\'t: b8 is where your own king is standing.' },
        ],
      },
      {
        type: 'talk',
        fen: LUCENA,
        arrows: [['c1', 'd1'], ['d1', 'd4']],
        text: 'The method:\n1. Rd1+ — check to push the black king one more column away.\n2. Rd4! — the bridge on the 4th row.\n3. Walk your king out (Kc7, Kb6, Kc6, Kb5). When the checks reach the b-file, block with Rb4.',
      },
      {
        type: 'drill',
        fen: LUCENA,
        prompt: 'Your turn: follow the method and promote the pawn within 15 moves.',
        goal: 'promote',
        moves: 15,
        hint: 'Rd1+ first. Then Rd4. Then walk the king out and block the last check on b4.',
        success: 'Bridge built! Many club players never learn this one.',
      },
    ],
  },
  {
    id: 'a-philidor',
    track: 'advanced',
    title: 'Philidor: The Third-Row Wall',
    coach: 'viktor',
    summary: 'Save a rook endgame when you\'re a pawn down — a 250-year-old trick.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: PHILIDOR,
        highlights: ['a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6'],
        text: 'Back in 1777, a player named Philidor showed how to defend this. Your king stands in front of the pawn. Your rook guards the glowing row (your 3rd row) so the white king can never step forward. Then you wait. A wall doesn\'t attack — it just stands there.',
      },
      {
        type: 'quiz',
        fen: PHILIDOR,
        question: 'White\'s king wants to reach d6, e6 or f6. What keeps it out?',
        options: [
          { text: 'Your rook guarding that row', correct: true, why: 'As long as the rook stays on that row, the white king can\'t step in.' },
          { text: 'Your king', why: 'Your king guards d7, e7 and f7 — but not the row in front of it.' },
          { text: 'Checks from behind', why: 'Not yet — that comes after White pushes the pawn to e6.' },
        ],
      },
      {
        type: 'quiz',
        fen: PHILIDOR,
        question: 'Later, White pushes the pawn to e6 to break the wall. Now what?',
        options: [
          { text: 'Move the rook far away to the 1st row and check from behind', correct: true, why: 'With the pawn on e6, the white king has nowhere to hide from checks coming from below.' },
          { text: 'Keep the rook on the same row', why: 'The pawn on e6 now blocks your rook\'s row.' },
          { text: 'Attack the pawn with the king', why: 'The white king protects the pawn — your rook has to do the work.' },
        ],
      },
      {
        type: 'drill',
        fen: PHILIDOR,
        prompt: 'Hold the wall for 12 moves. Don\'t lose your rook and don\'t let the pawn promote.',
        goal: 'hold',
        moves: 12,
        hint: 'Keep your rook on the 6th row until the pawn reaches e6 — then check from behind.',
        success: 'Wall held! A pawn down, and nothing to fear.',
      },
    ],
  },
  {
    id: 'a-chain-base',
    track: 'advanced',
    title: 'Attack the Base of the Chain',
    coach: 'mira',
    summary: 'Pawn chains have one weak spot. Hit it and the whole chain falls apart.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        fen: FRENCH,
        orientation: 'black',
        text: 'Look at White\'s pawns on d4 and e5: they protect each other diagonally, like a staircase. That\'s a pawn chain. A question for you: if you could remove one of them, which one would make the other fall?',
      },
      {
        type: 'find',
        fen: FRENCH,
        orientation: 'black',
        prompt: 'Tap the BASE of the chain — the pawn holding the other one up.',
        targets: ['d4'],
        hint: 'Which pawn protects e5?',
        success: 'd4! Without it, the pawn on e5 is alone and easy to attack.',
      },
      {
        type: 'quiz',
        fen: FRENCH,
        question: 'Why attack d4 instead of e5?',
        options: [
          { text: 'If d4 falls, e5 loses its protection and becomes a target', correct: true, why: 'Knock out the foundation and the rest of the building falls on its own.' },
          { text: 'Because e5 can\'t be attacked', why: 'e5 can be attacked later with ...f6 — but hit the base first.' },
          { text: 'Because d4 is worth more', why: 'All pawns are worth the same. What matters is the job each one does.' },
        ],
      },
      {
        type: 'move',
        fen: FRENCH,
        prompt: 'Put more pressure on the base. Find a move that attacks d4 again (or gets ready to).',
        line: ['d8b6'],
        accept: { 0: ['d8b6', 'g8e7', 'g8h6'] },
        wrong: { c5c4: '...c4 releases the tension: d4 is no longer attacked, and White\'s chain becomes permanent.' },
        hint: 'From b6 the queen backs up the c5 pawn and attacks b2. A knight can also head for f5 to hit d4.',
        success: 'More and more black pieces point at d4. White will struggle to hold it.',
      },
      {
        type: 'talk',
        text: 'Mira\'s rule: tension — pawns touching each other — is a weapon. Keep them in contact and add more attackers. Releasing the tension too early (like ...c4) hands your opponent a free, permanent pawn structure.',
      },
    ],
  },
  {
    id: 'a-practical',
    track: 'advanced',
    title: 'When Losing, Make It Messy',
    coach: 'elena',
    summary: 'How lost games get saved — and how won games get thrown away.',
    minutes: 4,
    steps: [
      {
        type: 'talk',
        text: 'A computer judges positions. Humans have to actually play them. A "lost" position is only lost if your opponent finds the right moves. So when you\'re worse, give them as many chances to go wrong as you can.',
      },
      {
        type: 'quiz',
        question: 'You\'re a whole piece down with nothing in return. What gives you the best chances?',
        options: [
          { text: 'Keep pieces on, open lines toward their king, and create threats', correct: true, why: 'A complicated position forces your opponent to think hard — and thinking hard leads to mistakes.' },
          { text: 'Trade pieces into an endgame', why: 'In an endgame, the extra piece wins easily and safely.' },
          { text: 'Play fast and hope', why: 'Playing fast just makes YOU the one who makes more mistakes.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your opponent is almost out of time, and you are winning. What\'s the best approach?',
        options: [
          { text: 'Play solid, safe moves and keep everything under control', correct: true, why: 'Let the clock do the work. Don\'t give them any tricks to find.' },
          { text: 'Try a risky sacrifice to finish fast', why: 'Taking big risks is for the player who\'s behind, not ahead.' },
          { text: 'Play as fast as possible', why: 'Rushing makes YOU the one who blunders.' },
        ],
      },
      {
        type: 'talk',
        text: 'The most dangerous move of a game is the one right after you make a big mistake. You feel upset and want to rush — players call this "tilt". Reset: look away from the board, take one slow breath, then check the position fresh, as if the game just started.',
      },
      {
        type: 'quiz',
        question: 'You just blundered a pawn. What should you do next?',
        options: [
          { text: 'Pause, calm down, and look at the new position with fresh eyes', correct: true, why: 'It\'s a new game now. Most "one mistake" losses are really two mistakes in a row.' },
          { text: 'Win it back right away, whatever it takes', why: 'Revenge moves are how losing one pawn turns into losing a whole piece.' },
          { text: 'Resign — it\'s over', why: 'A pawn down is a long game that you can still fight.' },
        ],
      },
    ],
  },
];
