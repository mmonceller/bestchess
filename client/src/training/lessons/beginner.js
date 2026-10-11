/*
 * Step types:
 *  talk    – coach explanation (optional board, arrows, highlights, showMoves)
 *  quiz    – multiple choice with per-option explanations
 *  find    – tap the target squares on the board
 *  move    – play a forced line: line[0], line[2]... are the student's moves, odd indexes are replies.
 *            `teach: true` marks rule demonstrations that the validator doesn't hold to engine accuracy.
 *  best    – any move within `maxLoss` centipawns of the engine's best is accepted
 *  drill   – play it out against the engine until the goal is reached
 *  collect – star hunt: move one piece to collect stars in `par` moves
 *  squares – tap the named squares
 *  recap   – summary cards
 */

import { openingSidesLesson } from './openings/bothSides.js';

const LPDO = 'r2qk2r/ppp2ppp/3p3n/4p3/1b2P1b1/2NP1N2/PP3PPP/R1BQKB1R w KQkq - 0 1';
const KQK = '8/8/8/4k3/8/8/8/4K2Q w - - 0 1';

export const beginnerLessons = [
  {
    id: 'b-loose-pieces',
    track: 'beginner',
    title: 'Loose Pieces Drop Off',
    coach: 'mira',
    summary: 'The habit that decides most beginner games: spotting pieces nobody protects.',
    minutes: 4,
    steps: [
      {
        type: 'talk',
        fen: LPDO,
        text: 'Here\'s a question: how are most games between new players decided? Not by clever plans — by pieces that nobody is protecting. A famous grandmaster, John Nunn, gave it a name: "Loose Pieces Drop Off." A loose piece is one with no defender.',
      },
      {
        type: 'find',
        fen: LPDO,
        prompt: 'Two BLACK pieces (not pawns) have no black piece protecting them. Tap both.',
        targets: ['b4', 'h8'],
        hint: 'For each black piece, ask: "If White captured it, could Black capture back?"',
        success: 'Right — the bishop on b4 and the rook on h8 are loose.',
      },
      {
        type: 'quiz',
        fen: LPDO,
        question: 'Both are loose. Which one can White attack right now while ALSO giving check?',
        options: [
          { text: 'The bishop on b4', correct: true, why: 'Queen to a4 gives check along the diagonal to e8 AND attacks b4 at the same time.' },
          { text: 'The rook on h8', why: 'No White piece can reach h8 with check this move.' },
          { text: 'Neither', why: 'Look at the queen: a4 is on the king\'s diagonal and right next to b4.' },
        ],
      },
      {
        type: 'move',
        fen: LPDO,
        prompt: 'Cash in: give a check that also attacks the loose bishop. After Black blocks the check, capture the bishop.',
        line: ['d1a4', 'c7c6', 'a4b4'],
        hint: 'The queen goes to the edge of the board, on a4.',
        success: 'A free piece — all because you asked "what is loose?"',
      },
      {
        type: 'quiz',
        question: 'When is the best moment to look for loose pieces?',
        options: [
          { text: 'Right after every move your opponent makes', correct: true, why: 'Any move can leave a piece unprotected. Check the new position before thinking about your own plan.' },
          { text: 'Only when I\'m attacking', why: 'Your own loose pieces matter just as much when you defend.' },
          { text: 'Once, at the end of the opening', why: 'The board changes every move — checking once is not enough.' },
        ],
      },
      {
        type: 'talk',
        text: 'Mira\'s homework: before each move, look at every one of your pieces and ask it, "Who protects you?" A piece that answers "nobody" is a target waiting to happen.',
      },
    ],
  },
  {
    id: 'b-queen-box',
    track: 'beginner',
    title: 'The Box Method: Checkmate with a Queen',
    coach: 'lin',
    summary: 'A simple recipe for winning with king and queen against a lone king.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: KQK,
        highlights: ['f3', 'c6'],
        text: 'No memorizing — just a 3-step recipe. Step 1: put your queen a knight\'s jump away from the enemy king (an L shape away). That traps the king inside a box it can\'t leave.',
      },
      {
        type: 'move',
        fen: KQK,
        prompt: 'Step 1: move the queen so it\'s a knight\'s jump away from the black king.',
        line: ['h1f3'],
        accept: { 0: ['h1f3', 'h1c6'] },
        hint: 'Squares a knight\'s jump from e5 that your queen can reach: f3 or c6.',
        success: 'The king is boxed in. Notice: no check was needed — checks just push the king around.',
      },
      {
        type: 'talk',
        text: 'Step 2: follow the king. Each time it moves, move your queen so it\'s a knight\'s jump away again. The box gets smaller every time.\n\nStep 3: once the king is stuck on the edge of the board, STOP moving the queen. Walk your own king closer — checkmate needs both pieces working together.',
      },
      {
        type: 'quiz',
        fen: 'k7/8/2Q5/8/8/8/8/1K6 w - - 0 1',
        question: 'The box is tiny now. Which move would throw away the win?',
        options: [
          { text: 'Qb6', correct: true, why: 'Stalemate! Black would have no legal move and not be in check — the game ends in a draw.' },
          { text: 'Kb2', why: 'Safe: your king walks closer, and the black king can still move to a7 or b8.' },
          { text: 'Qe8+', why: 'Not the fastest, but the black king can still move — so no stalemate.' },
        ],
      },
      {
        type: 'talk',
        text: 'Good to know: there\'s no special move limit once your opponent has only a king left. But the fifty-move rule still counts — if 50 moves go by for each side with no capture and no pawn move, your opponent can claim a draw.\n\nThe box method needs far fewer moves than that. The 20-move goal in the next drill is just practice, not a rule.',
      },
      {
        type: 'drill',
        fen: KQK,
        prompt: 'Use the recipe: checkmate the lone king within 20 moves.',
        goal: 'mate',
        moves: 20,
        hint: 'Box the king in, follow it, then bring your own king. Before every queen move, make sure the black king still has a legal move.',
        success: 'Recipe complete! You\'ll never forget this checkmate.',
      },
    ],
  },
  {
    id: 'b-forks',
    track: 'beginner',
    title: 'The Knight at the Family Dinner',
    coach: 'viktor',
    summary: 'Forks — attacking two things at once — explained with a story.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        fen: '4k2r/pp1n1ppp/q7/1N6/8/8/PP3PPP/3QK2R w Kk - 0 1',
        text: 'In my village there was an uncle who always sat between two relatives at dinner and bothered them both. Nobody could get away from him in time. In chess, that uncle is the knight — and when one piece attacks two at once, it\'s called a fork.',
      },
      {
        type: 'move',
        fen: '4k2r/pp1n1ppp/q7/1N6/8/8/PP3PPP/3QK2R w Kk - 0 1',
        prompt: 'Find the dinner seat: one knight move that attacks the king AND the queen.',
        line: ['b5c7', 'e8d8', 'c7a6'],
        hint: 'Which square is a knight\'s jump from both e8 and a6?',
        success: 'The king has to move, and the queen is lost. The uncle wins again!',
      },
      {
        type: 'quiz',
        question: 'Why are knight forks so powerful?',
        options: [
          { text: 'A knight\'s attack can\'t be blocked, and the pieces it attacks can\'t attack it back', correct: true, why: 'Queens, rooks and kings can never attack the square a knight is attacking them from.' },
          { text: 'Knights are the most valuable piece', why: 'A knight is only worth about 3 points. It\'s the shape of its move that matters.' },
          { text: 'Knights move in straight lines', why: 'They jump in an L — that\'s exactly what makes them sneaky.' },
        ],
      },
      {
        type: 'move',
        fen: 'r2qkb1r/ppp2ppp/2n1b3/4p3/3P4/2N2N2/PPP2PPP/R1BQKB1R w KQkq - 0 1',
        prompt: 'Even a little pawn can fork. Find the pawn move that attacks two black pieces.',
        line: ['d4d5'],
        hint: 'Which pawn move attacks the knight on c6 and the bishop on e6 at once?',
        success: 'Two pieces attacked by one pawn — Black can only save one of them.',
      },
      {
        type: 'talk',
        text: 'Viktor\'s secret: a knight always attacks squares of the OPPOSITE color to the one it stands on. So it can only fork pieces that stand on the SAME color. When your king and queen are on the same color, watch out for knights!',
      },
      {
        type: 'quiz',
        question: 'Black\'s king is on g8 and the queen is on d8. Could one knight fork them?',
        options: [
          { text: 'No — they stand on different colored squares', correct: true, why: 'g8 is a light square and d8 is dark. A knight only attacks one color at a time.' },
          { text: 'Yes, from e7', why: 'From e7 a knight attacks g8 and c8, but not d8.' },
          { text: 'Yes, from f6', why: 'From f6 a knight attacks g8 and d7, but not d8.' },
        ],
      },
    ],
  },
  {
    id: 'b-blunder-filter',
    track: 'beginner',
    title: 'The Blunder Filter',
    coach: 'elena',
    summary: 'Checks, captures, threats: a 10-second habit that saves games.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Your brain plays in two ways: "hoping" and "looking". Almost every blunder (a big mistake) happens when you\'re hoping. The cure is a quick filter before EVERY move. Look for Checks, then Captures, then Threats — for you and for your opponent. Checks come first because the other player must answer them.',
      },
      {
        type: 'move',
        fen: '6k1/5ppp/7q/8/8/4B3/5PPP/3R2K1 w - - 0 1',
        prompt: 'Black\'s queen can be captured. Tempting! But run the filter first — checks come first.',
        line: ['d1d8'],
        wrong: { e3h6: 'You won the queen… but missed checkmate in one! The first good move you see isn\'t always the best one.' },
        hint: 'Look at Black\'s back row. The pawns on f7, g7 and h7 trap their own king.',
        success: 'Checkmate! The filter found what grabbing the queen would have missed.',
      },
      {
        type: 'quiz',
        question: 'Why run the filter for your OPPONENT\'s moves too?',
        options: [
          { text: 'My move might allow a check, capture or threat I didn\'t notice', correct: true, why: 'Most blunders aren\'t bad ideas — they\'re replies you forgot to look at.' },
          { text: 'To guess their personality', why: 'Fun, but the board tells you everything you need.' },
          { text: 'It\'s only needed in the endgame', why: 'Tricks can happen at any point in the game.' },
        ],
      },
      {
        type: 'best',
        fen: 'r4rk1/ppp2ppp/2nbp3/8/4P2q/2NP4/PPP2PPP/R1BQ1RK1 w - - 0 1',
        prompt: 'Run the filter for Black. What is Black threatening? Find a move that stops it.',
        maxLoss: 60,
        hint: 'The bishop on d6 and the queen on h4 are both aiming at your h2 pawn — next to your king.',
        success: 'Threat stopped. You saw their move before they played it!',
      },
      {
        type: 'talk',
        text: 'Bonus habit — "sit on your hands": when you find a good move, don\'t play it yet. Look for one other option, and run the filter on both. Strong players do this automatically. It takes ten seconds and saves whole games.',
      },
      {
        type: 'quiz',
        question: 'You found a move that wins a pawn. What should you do next?',
        options: [
          { text: 'Check what my opponent can do right after it', correct: true, why: 'A "free" pawn is sometimes a trap. The filter tells you if it\'s safe.' },
          { text: 'Play it quickly before I forget', why: 'Rushing is exactly when mistakes sneak in.' },
          { text: 'Ignore it and keep developing', why: 'Free pawns are good — just make sure it\'s really free first.' },
        ],
      },
    ],
  },
  {
    id: 'b-opening-race',
    track: 'beginner',
    title: 'Openings Are a Race',
    coach: 'kai',
    summary: 'Three questions that make every opening move good — plus a map of common starting plans.',
    minutes: 8,
    steps: [
      {
        type: 'talk',
        text: 'No memorizing today! The opening (the first 10 or so moves) is a race to get your pieces ready. Every move should answer YES to one of three questions:\n1. Does it bring out a piece?\n2. Does it fight for the center?\n3. Does it make my king safer?\nIf the answer is no to all three, the move is probably too slow. Let\'s go!',
      },
      {
        type: 'best',
        fen: 'rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2',
        prompt: 'White to move. Make a "race" move.',
        maxLoss: 30,
        hint: 'Bring out a knight or bishop toward the center.',
        success: 'Developing with a purpose. Next!',
      },
      {
        type: 'best',
        fen: 'rnbqkbnr/pppp1ppp/8/4p2Q/4P3/8/PPPP1PPP/RNB1KBNR b KQkq - 1 2',
        prompt: 'White brought the queen out early, and it\'s attacking your e5 pawn. Bring out a piece AND protect the pawn in one move.',
        maxLoss: 35,
        hint: 'A knight can protect e5 while coming out.',
        success: 'Two jobs in one move. Players call that "gaining a tempo" — winning time.',
      },
      {
        type: 'best',
        fen: 'r1bqkbnr/pppp1ppp/2n5/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 3 3',
        prompt: 'Alarm! White threatens Queen takes f7 — that would be checkmate. Stop it!',
        maxLoss: 50,
        hint: 'Either block the queen\'s path or add a defender to f7.',
        success: 'Checkmate stopped. Soon you can chase White\'s queen around and win more time.',
      },
      {
        type: 'quiz',
        question: 'After 1.e4 e5, which White move is the slowest?',
        options: [
          { text: '2.h4', correct: true, why: 'It brings out no piece, doesn\'t fight for the center, and doesn\'t protect the king. A wasted move.' },
          { text: '2.Nf3', why: 'Brings out a knight and attacks e5. A race move!' },
          { text: '2.Bc4', why: 'Brings out a bishop and aims at f7. A race move!' },
        ],
      },
      {
        type: 'talk',
        text: 'Time math: a move that does nothing is like letting your opponent play two moves in a row. In the opening, treat every move like money — don\'t waste it.',
      },
      {
        type: 'talk',
        text: 'You still don\'t need a book of names. But once those three questions feel easy, it helps to know a few starting plans — so you can pick one that matches how you like to fight, instead of inventing a new setup every game.',
      },
      {
        type: 'recap',
        title: 'Four styles of opening',
        text: 'Openings are not just lists of moves. They are styles:',
        items: [
          { icon: 'pawn', title: 'Classical', text: 'Put pawns in the center (e4 or d4) and develop around them. Direct and easy to understand.' },
          { icon: 'bishop', title: 'Hypermodern', text: 'Let the opponent take the center, then chip away at it from the sides with pieces and later pawn breaks.' },
          { icon: 'book', title: 'System', text: 'Play nearly the same safe setup every game, no matter what they do. Less memory work.' },
          { icon: 'swords', title: 'Gambit', text: 'Give up a pawn on purpose to race faster or open lines. You buy time with material.' },
        ],
      },
      {
        type: 'recap',
        title: 'If you have White',
        text: 'Four popular first plans. All of them pass the three questions:',
        items: [
          { label: 'Bc4', title: 'Italian Game', text: '1.e4 e5 2.Nf3 Nc6 3.Bc4. The bishop aims at f7. You can keep it calm, or get wild with the Fried Liver Attack.' },
          { label: 'Bb5', title: 'Ruy Lopez', text: '1.e4 e5 2.Nf3 Nc6 3.Bb5. The bishop nags the knight that defends e5. Deep, long games — a favourite for centuries.' },
          { label: 'c4', title: 'Queen\'s Gambit', text: '1.d4 d5 2.c4. You offer a side pawn to pull their d-pawn off the center. Great if you like slow, careful play.' },
          { label: 'Bf4', title: 'London System', text: '1.d4, then Bf4 and e3. Almost the same house every time. Perfect when you don\'t want to memorize a book.' },
        ],
      },
      {
        type: 'talk',
        text: 'Want something less common as White? 1.c4 is the English (a side-door grab of the center). 1.e4 e5 2.Nf3 Nc6 3.d4 is the Scotch — you blow the center open on move 3. Feeling bold? The King\'s Gambit (1.e4 e5 2.f4) offers a pawn to open a file toward their king.',
      },
      {
        type: 'recap',
        title: 'If they play 1.e4',
        text: 'You are Black. Three main answers — and they feel very different:',
        items: [
          { label: 'c5', title: 'Sicilian Defense', text: '1...c5. You fight for the center from the side. Games get sharp and uneven — both sides can attack.' },
          { label: 'c6', title: 'Caro-Kann', text: '1...c6, then ...d5. Solid. You hit the center without locking in your light-squared bishop the way the French sometimes does.' },
          { label: 'e6', title: 'French Defense', text: '1...e6, then ...d5. A sturdy pawn chain and a counterpunch. You must plan how to free the bishop on c8.' },
        ],
      },
      {
        type: 'talk',
        text: 'Other answers to 1.e4: the Scandinavian (1...d5) hits back at once. The Petrov (1...Nf6) copies White\'s idea and is very hard to crack. The Pirc and Modern let White take the center, then you strike later — hypermodern style.',
      },
      {
        type: 'recap',
        title: 'If they play 1.d4',
        text: 'Two big families — rock-solid or wait-and-strike:',
        items: [
          { label: 'c6', title: 'Slav Defense', text: '1.d4 d5 2.c4 c6. You guard d5 and keep the door open for your light-squared bishop. Very sturdy.' },
          { label: 'g6', title: 'King\'s Indian', text: '1.d4 Nf6 2.c4 g6. You let them build a big center, tuck a bishop on g7, then hit the flanks. Fireworks later.' },
        ],
      },
      {
        type: 'talk',
        text: 'More 1.d4 ideas: the Nimzo-Indian pins their knight with ...Bb4. The Dutch (1...f5) grabs kingside space. The Grünfeld lets them take the center, then you blow it up with ...d5. You don\'t need all of these — pick one White plan and one Black plan vs e4 and vs d4, and play them until they feel like home.',
      },
      {
        type: 'quiz',
        question: 'Why do players like the London System?',
        options: [
          { text: 'You can use almost the same safe setup against many Black replies', correct: true, why: 'It\'s a system: the pieces go to familiar squares, so you spend less time remembering lines.' },
          { text: 'It forces checkmate in ten moves', why: 'No opening does that against good defence.' },
          { text: 'You give away a pawn on move two', why: 'That would be a gambit. The London keeps its pawns.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Black plays the Sicilian (1.e4 c5). What is the idea?',
        options: [
          { text: 'Fight for the center from the side and keep the game unbalanced', correct: true, why: 'The c-pawn challenges d4 without copying 1...e5. Both sides get attacking chances.' },
          { text: 'Copy White\'s e-pawn and keep everything symmetrical', why: 'That\'s 1...e5. The Sicilian is the opposite of copycat play.' },
          { text: 'Give up the queen for a fast attack', why: 'No — you keep your queen! The fight is about the center and opposite-side chances.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A hypermodern opening is one where you…',
        options: [
          { text: 'Let the opponent take the center, then chip away at it later', correct: true, why: 'King\'s Indian, Pirc, Réti — you control the center with pieces first, then strike.' },
          { text: 'Always castle on move four', why: 'Castling is a golden rule, not a style of opening.' },
          { text: 'Push every pawn two squares on the first move', why: 'That would just hang pawns. Hypermodern play is patient, not reckless.' },
        ],
      },
    ],
  },
  openingSidesLesson,
  {
    id: 'b-tactics-sprint',
    track: 'beginner',
    title: 'Tactics Sprint',
    coach: 'kai',
    summary: 'Six quick puzzles against the clock. Speed builds pattern memory.',
    minutes: 3,
    steps: [
      { type: 'talk', text: 'Six puzzles, 30 seconds each. You get better at spotting tricks by seeing them again and again — fast. Ready? Go!' },
      { type: 'move', fen: '6rk/6pp/8/6N1/8/8/8/6K1 w - - 0 1', prompt: 'Checkmate in one move.', line: ['g5f7'], timeLimit: 30, hint: 'The black king is boxed in by its own pieces.', success: 'Smothered mate — the king was trapped by its own army!' },
      { type: 'move', fen: '2k5/7R/8/8/8/8/8/R5K1 w - - 0 1', prompt: 'Checkmate in one move.', line: ['a1a8'], timeLimit: 30, hint: 'One rook already blocks the 7th row.', success: 'The ladder mate — two rooks working together.' },
      { type: 'move', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K1NR w KQkq - 4 4', prompt: 'Checkmate in one move.', line: ['h5f7'], timeLimit: 30, hint: 'The f7 pawn is only protected by the king.', success: 'Scholar\'s mate — now you know why to guard f7!' },
      { type: 'move', fen: '6k1/5ppp/8/8/8/1Q6/8/6K1 w - - 0 1', prompt: 'Checkmate in one move.', line: ['b3b8'], timeLimit: 30, hint: 'The king is stuck on its back row.', success: 'Back-rank mate.' },
      { type: 'move', fen: '2q3k1/5ppp/8/3N4/8/8/5PPP/6K1 w - - 0 1', prompt: 'Win the queen.', line: ['d5e7'], timeLimit: 30, hint: 'A knight check that also attacks c8.', success: 'A fork of the king and queen!' },
      { type: 'move', fen: '4k3/8/2q5/8/8/8/4B3/4R1K1 w - - 0 1', prompt: 'Win the queen.', line: ['e2b5'], accept: { 0: ['e2b5', 'e2f3'] }, timeLimit: 30, hint: 'Move the bishop out of the rook\'s way — with an attack on the queen.', success: 'Discovered check! The rook gives check, and the bishop grabs the queen.' },
    ],
  },
];
