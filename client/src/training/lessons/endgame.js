/*
 * Endgame School: ideas from Dvoretsky's Endgame Manual, explained in simple words.
 * Every move step here is checked against the tablebase (npm run check:endgames).
 */
const RETI = '7K/8/k1P5/7p/8/8/8/8 w - - 0 1';
const ZUGZWANG = '8/6p1/5kP1/3K1P2/8/8/8/8 w - - 0 1';
const WRONG_BISHOP = '8/4k3/8/4K2P/8/3B4/8/8 b - - 0 1';
const OPPOSITE_BISHOPS = '8/4k3/8/4P1b1/2BK4/8/8/8 w - - 0 1';
const QUEEN_VS_PAWN = '6Q1/8/8/8/8/8/3pk3/K7 w - - 0 1';
const STALEMATE_TRICK = '8/8/8/8/5K2/1Q6/2p5/k7 w - - 0 1';
const ROOK_BEHIND = '6k1/r4ppp/8/P7/8/8/5PPP/R5K1 w - - 0 1';
const CUT_OFF = '8/8/8/3p4/5k2/8/8/K5R1 w - - 0 1';

export const endgameLessons = [
  {
    id: 'e-king-races',
    track: 'endgame',
    title: 'Catch the Pawn: Réti\'s Trick',
    coach: 'lin',
    summary: 'A king can chase two things at once — if it walks on the diagonal.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Quick reminder: to see if a king can catch a pawn, picture a square from the pawn to its last row. If the king can step inside that square, it catches the pawn. Today you\'ll learn a trick that breaks this rule of thumb.',
      },
      {
        type: 'talk',
        fen: RETI,
        highlights: ['h8', 'h5', 'c6'],
        text: 'This looks hopeless for White. Black\'s pawn is far away from your king, and Black\'s king is right next to your pawn. But a king walking on a diagonal moves toward two places at the same time.',
      },
      {
        type: 'move',
        tablebase: true,
        fen: RETI,
        prompt: 'Save the game! Walk your king so it chases the black pawn AND helps your own pawn.',
        line: ['h8g7', 'h5h4', 'g7f6', 'h4h3', 'f6e7'],
        accept: { 4: ['f6e7', 'f6e6'] },
        wrong: {
          c6c7: 'Black\'s king steps to b7 and stops your pawn. Then the h-pawn runs home.',
          h8h7: 'Going straight down the h-file only chases the pawn — and it\'s too slow. Go diagonally.',
          g7g6: 'Straight down the file is too slow. Keep walking diagonally toward the middle.',
        },
        hint: 'Step diagonally toward the centre: g7, then f6. Each step gets closer to both pawns.',
        success: 'A draw! If Black runs with the pawn, your king supports your own pawn and it becomes a queen too.',
      },
      {
        type: 'quiz',
        question: 'Why does the king\'s diagonal walk work?',
        options: [
          { text: 'Each diagonal step brings it closer to both pawns at once', correct: true, why: 'Going diagonally costs no extra time, so the king chases one pawn while helping the other.' },
          { text: 'Black played badly', why: 'Black had nothing better. The diagonal walk works against any defence.' },
          { text: 'Kings move faster on diagonals', why: 'Every king move is one square. The trick is that one diagonal step serves two goals.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your king is outside the pawn\'s square. What should you check before giving up?',
        options: [
          { text: 'Whether my king can also help my own pawn or attack something on the way', correct: true, why: 'Threats on the way gain time. That\'s how a "lost" race becomes a draw.' },
          { text: 'Nothing — outside the square means lost', why: 'Usually true, but tricks like this one save many games.' },
          { text: 'Whether I can move the king backwards', why: 'Going backwards loses even more time.' },
        ],
      },
      {
        type: 'recap',
        title: 'King races',
        numbered: true,
        items: [
          { title: 'Draw the square', text: 'Can your king step into the pawn\'s square? Then it catches the pawn.' },
          { title: 'Look for two jobs', text: 'A king that chases a pawn and helps its own pawn gains time.' },
          { title: 'Walk diagonally', text: 'A diagonal path can be just as fast as a straight one — and it covers more.' },
        ],
      },
    ],
  },
  {
    id: 'e-zugzwang',
    track: 'endgame',
    title: 'The Waiting Game: Zugzwang',
    coach: 'elena',
    summary: 'Sometimes the side that has to move loses. Learn to pass the turn.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'Zugzwang is a German word. It means "forced to move". In endgames it happens a lot: every move a player can make makes their position worse — but they have to move anyway.',
      },
      {
        type: 'quiz',
        question: 'The two kings face each other. It\'s your move and you would love to "pass". You still have a pawn that can step forward without any danger. What does that pawn move do?',
        options: [
          { text: 'It passes the turn, so the other king must step aside', correct: true, why: 'A safe "spare" pawn move is like skipping your turn. Save these for the right moment.' },
          { text: 'Nothing useful — pawn moves are a waste of time', why: 'In endgames a spare pawn move can decide the whole game.' },
          { text: 'It loses the pawn', why: 'If the pawn is safe, it just hands the move to your opponent.' },
        ],
      },
      {
        type: 'talk',
        fen: ZUGZWANG,
        highlights: ['f5', 'g6'],
        text: 'Here Black\'s king attacks your f5 pawn. Your king must keep protecting it. If you move the wrong way, Black eats f5, then g6, and Black\'s pawn becomes a queen! Each king has only a few good squares. Find the one that leaves Black with no good moves.',
      },
      {
        type: 'move',
        tablebase: true,
        fen: ZUGZWANG,
        prompt: 'Only one move wins. Keep guarding f5 and leave Black without good squares.',
        line: ['d5e4', 'f6g5', 'e4e5'],
        wrong: {
          d5d4: 'Your king no longer guards f5. Black takes it with ...Kxf5 and wins.',
          d5c5: 'Too far away. Black takes f5 and then g6.',
          d5c6: 'Too far away. Black takes f5 and then g6.',
          d5d6: 'Your king can\'t guard f5 from d6. Black takes it.',
          f5f6: 'Pushing the pawn throws away the win. After ...Kxf6 it\'s only a draw.',
          e4e3: 'Your pawn on f5 is left alone. Black takes it and it\'s only a draw.',
          e4f3: 'From f3 your king doesn\'t guard f5 any more. Black takes it — only a draw.',
        },
        hint: 'Your king must stay next to f5. Which square protects it and gets closer to Black\'s pawn?',
        success: 'Black is stuck! The king must step away from f5, and then your king walks in and eats the g7 pawn.',
      },
      {
        type: 'talk',
        text: 'Sometimes you need to lose a move on purpose. The king can do it by walking in a little triangle: three moves to come back to the same square, while the enemy king, with less room, can only shuffle back and forth. Now the same position appears — but with the other player to move. This trick is called triangulation.',
      },
      {
        type: 'quiz',
        question: 'Why does triangulation work?',
        options: [
          { text: 'Your king has more room, so it can lose a move that the other king cannot', correct: true, why: 'Three moves in a triangle against two moves back and forth: the turn switches to the opponent.' },
          { text: 'It confuses the opponent', why: 'It works even against perfect defence. It\'s about counting moves.' },
          { text: 'Triangles are stronger shapes', why: 'The shape only matters because it brings the king back to the same square in an odd number of moves.' },
        ],
      },
      {
        type: 'recap',
        title: 'Waiting-game rules',
        numbered: true,
        items: [
          { title: 'Know who wants to move', text: 'Often in endgames, the side that has to move is the one in trouble.' },
          { title: 'Save spare pawn moves', text: 'Don\'t waste them early — use one when you need to pass the turn.' },
          { title: 'Triangle to lose a move', text: 'If your king has more room, a small triangle gives the turn to your opponent.' },
        ],
      },
    ],
  },
  {
    id: 'e-fortress',
    track: 'endgame',
    title: 'Draw Savers: Fortresses',
    coach: 'rook',
    summary: 'Being down material isn\'t always lost. Learn the setups that can\'t be broken.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'A fortress is a setup where you\'re behind in material, but your opponent still can\'t win. Knowing a few fortresses saves many games that look lost.',
      },
      {
        type: 'talk',
        fen: WRONG_BISHOP,
        highlights: ['h8', 'd3'],
        text: 'Fortress number one: the "wrong bishop". White has a bishop and a pawn on the edge (the h-file). The pawn wants to become a queen on h8 — a dark square. But White\'s bishop only walks on light squares, so it can never chase a king out of the h8 corner. If Black\'s king reaches the corner, it\'s a draw!',
      },
      {
        type: 'move',
        tablebase: true,
        fen: WRONG_BISHOP,
        prompt: 'You are Black. Run your king to the safe corner on h8 before White\'s king blocks the way.',
        line: ['e7f7', 'e5f5', 'f7g7'],
        accept: { 0: ['e7f7', 'e7f8'], 2: ['f7g7', 'f7f8', 'f7g8'] },
        wrong: {
          e7d7: 'Wrong way! White\'s king will block you from the corner and the pawn becomes a queen.',
          e7d8: 'Wrong way! White\'s king will block you from the corner and the pawn becomes a queen.',
          e7e8: 'Too slow — next White plays Kf6 and you can\'t get to the corner.',
          f7e7: 'Don\'t go backwards. The corner is your safe house.',
        },
        hint: 'Head toward h8 — step to f7 first.',
        success: 'Your king reaches the corner. White can\'t chase it out, so it\'s a draw — even a whole bishop and pawn down!',
      },
      {
        type: 'talk',
        fen: OPPOSITE_BISHOPS,
        highlights: ['e6', 'e7', 'g5'],
        text: 'Fortress number two: bishops of opposite colours. White is a pawn up, but White\'s bishop walks on light squares and Black\'s on dark squares. Black\'s king sits in front of the pawn, and the bishop guards the dark squares. The pawn can never move forward safely. Draw.',
      },
      {
        type: 'quiz',
        question: 'Why are endgames with opposite-coloured bishops so often a draw?',
        options: [
          { text: 'Each bishop rules its own colour, so the defender can block pawns on squares the attacker\'s bishop can\'t touch', correct: true, why: 'The attacking bishop can never fight for the blocking square.' },
          { text: 'Because bishops are weak pieces', why: 'Bishops are strong. The point is they can never meet or fight for the same squares.' },
          { text: 'Because the rules say so', why: 'There\'s no special rule — it comes from how the bishops move.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You are losing and see a chance to trade into a "wrong bishop" ending. What should you think?',
        options: [
          { text: 'Great — if my king reaches the corner, it\'s a draw', correct: true, why: 'Knowing fortresses lets you aim for them on purpose.' },
          { text: 'Avoid it — I\'ll be a whole piece down', why: 'Material doesn\'t matter if your opponent can\'t make progress.' },
          { text: 'Resign', why: 'Never resign a fortress! Make your opponent prove it — they can\'t.' },
        ],
      },
      {
        type: 'recap',
        title: 'Fortress facts',
        items: [
          { icon: 'bishop', title: 'Wrong bishop', text: 'Rook pawn + bishop that can\'t control the corner = draw if the king gets there.' },
          { icon: 'bishop', title: 'Opposite bishops', text: 'Block the pawns on your bishop\'s colour. Even two pawns down can be a draw.' },
          { icon: 'king', title: 'King first', text: 'In most fortresses, the defending king stands right in front of the pawns.' },
        ],
      },
    ],
  },
  {
    id: 'e-queen-vs-pawn',
    track: 'endgame',
    title: 'Queen vs. a Runaway Pawn',
    coach: 'lin',
    summary: 'Stop a pawn that is one step from queening — and know when you can\'t.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: QUEEN_VS_PAWN,
        highlights: ['d2', 'd1'],
        text: 'Black\'s pawn is one step from becoming a queen, and your king is far away. Here is the plan: give checks, or pin the pawn, until Black\'s king has to stand in front of its own pawn on d1. Then the pawn is blocked for one move — and you use that free move to bring your king one step closer.',
      },
      {
        type: 'move',
        tablebase: true,
        fen: QUEEN_VS_PAWN,
        prompt: 'Start the plan: find a check that keeps the queen close to the pawn.',
        line: ['g8g4'],
        accept: { 0: ['g8g4', 'g8g2', 'g8c4', 'g8e6', 'g8e8', 'g8a2'] },
        wrong: {
          g8g1: 'That gives Black time to support the pawn with the king. It\'s only a draw.',
          g8d8: 'That gives Black time to support the pawn with the king. It\'s only a draw.',
          a1b2: 'Your king is too far to help in time. Use the queen first.',
        },
        hint: 'A check from g4 or g2, or a check on the diagonal, keeps Black busy.',
        success: 'Good start. Keep checking until the king blocks its own pawn, then bring your king closer.',
      },
      {
        type: 'drill',
        fen: QUEEN_VS_PAWN,
        goal: 'mate',
        moves: 30,
        level: 5,
        prompt: 'Now do it all: stop the pawn, bring your king, and checkmate within 30 moves.',
        hint: 'Check, check, check until the king stands on d1. Then move your king one step closer. Repeat, then win the pawn.',
        success: 'Beautiful technique — the queen beats the pawn on the 7th!',
      },
      {
        type: 'talk',
        fen: STALEMATE_TRICK,
        highlights: ['a1', 'c2'],
        text: 'But watch out! With a pawn on the c-file (or the a-file), Black has a trick. Black\'s king hides in the corner. If you take the pawn with Qxc2, Black has no legal move — stalemate, a draw! So against these pawns, the queen alone usually can\'t win unless your king is already close.',
      },
      {
        type: 'quiz',
        question: 'Your queen is fighting a pawn on the 7th row and your king is far away. Which pawn is usually a DRAW?',
        options: [
          { text: 'A pawn on the a-, c-, f- or h-file', correct: true, why: 'Rook pawns and bishop pawns give the defending king a stalemate hiding place.' },
          { text: 'A pawn on the d- or e-file', why: 'Centre pawns lose: the queen forces the king in front of the pawn again and again.' },
          { text: 'A pawn on the b- or g-file', why: 'Knight pawns also lose — no stalemate trick there.' },
        ],
      },
    ],
  },
  {
    id: 'e-rook-rules',
    track: 'endgame',
    title: 'Rook Endgame Rules',
    coach: 'viktor',
    summary: 'The most common endgame of all: where rooks belong and how to cut the king off.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'Rook endgames are the most common endgames in chess. They\'re also famous for being tricky. Luckily, a few simple rules will guide you in almost every one.',
      },
      {
        type: 'talk',
        fen: ROOK_BEHIND,
        highlights: ['a1', 'a5', 'a7'],
        text: 'Rule 1: rooks belong BEHIND passed pawns. Your rook on a1 is behind your a-pawn: every time the pawn moves forward, your rook gets more room. Black\'s rook on a7 is in front of the pawn: it gets less and less room, and it\'s stuck guarding instead of attacking.',
      },
      {
        type: 'quiz',
        question: 'Your opponent has a dangerous passed pawn. Where should your rook go?',
        options: [
          { text: 'Behind it, so it can stop the pawn and stay active', correct: true, why: 'A rook behind the pawn attacks it all the way, and gets more room as the pawn moves.' },
          { text: 'Right in front of it, on the next square', why: 'Then your rook just sits there doing nothing, and the enemy king can chase it away.' },
          { text: 'Far away on the other side', why: 'Then nothing stops the pawn.' },
        ],
      },
      {
        type: 'talk',
        fen: CUT_OFF,
        highlights: ['e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8'],
        arrows: [['g1', 'e1']],
        text: 'Rule 2: cut the king off. A rook on a file (or row) between the enemy king and the action works like a wall. Here Re1 builds a wall on the e-file: Black\'s king can\'t cross it to help its pawn, and your king walks over to eat the pawn.',
      },
      {
        type: 'quiz',
        question: 'Rule 3: your rook can either defend a pawn passively or attack the enemy pawns. Which is usually better?',
        options: [
          { text: 'Attack — an active rook is worth more than a pawn', correct: true, why: 'A passive rook just defends. An active rook makes threats and keeps the enemy busy.' },
          { text: 'Defend — never give up a pawn', why: 'Clinging to a pawn with a passive rook often loses the whole endgame.' },
          { text: 'It doesn\'t matter', why: 'Activity is the most important thing in rook endings.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Rule 4: you\'re defending and want to check the enemy king from the side. Where should your rook stand?',
        options: [
          { text: 'Far away from the king — at least three columns', correct: true, why: 'From far away, the king can\'t come close to the rook to stop the checks.' },
          { text: 'Right next to the king', why: 'Then the king just attacks your rook.' },
          { text: 'Anywhere, it doesn\'t matter', why: 'Distance matters a lot. Close checks run out quickly.' },
        ],
      },
      {
        type: 'recap',
        title: 'Rook endgame rules',
        items: [
          { icon: 'rook', title: 'Behind passed pawns', text: 'Both your own and your opponent\'s.' },
          { icon: 'rook', title: 'Cut the king off', text: 'A rook on a file or row works like a wall.' },
          { icon: 'rook', title: 'Stay active', text: 'An active rook is worth more than a pawn.' },
          { icon: 'king', title: 'Check from far away', text: 'Side checks work best from at least three columns away.' },
        ],
      },
    ],
  },
  {
    id: 'e-big-rules',
    track: 'endgame',
    title: 'The Big Endgame Ideas',
    coach: 'mira',
    summary: 'Four ideas that matter in every endgame: king, pawns, zugzwang and fortresses.',
    minutes: 5,
    steps: [
      {
        type: 'recap',
        title: 'The four big ideas',
        items: [
          { label: 'K', title: 'Use your king', text: 'In the endgame the king is a strong fighter. Bring it to the middle.' },
          { label: 'P', title: 'Pawns want to be queens', text: 'Passed pawns win endgames. Create one and push it with support.' },
          { label: 'Z', title: 'Zugzwang', text: 'Sometimes the side that has to move loses. Count the moves.' },
          { label: 'F', title: 'Fortresses', text: 'Down material? Look for a setup your opponent can\'t break.' },
        ],
      },
      {
        type: 'quiz',
        question: 'The queens are traded and only a few pieces are left. Where does your king belong?',
        options: [
          { text: 'Toward the middle, ready to fight', correct: true, why: 'With fewer pieces there\'s little danger of checkmate, so the king becomes a strong piece.' },
          { text: 'Tucked in the corner behind pawns', why: 'That\'s for the middlegame. In the endgame a hiding king is wasted.' },
          { text: 'Where it is — kings shouldn\'t move', why: 'A passive king often loses the endgame.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You are winning an endgame, but there\'s no quick finish. What is the best attitude?',
        options: [
          { text: 'No hurry — improve your pieces step by step first', correct: true, why: 'The losing side can\'t do much. Rushing gives them chances; patience takes them away.' },
          { text: 'Push your pawns as fast as possible', why: 'Rushed pawns can get stuck or lost. Prepare first.' },
          { text: 'Offer a draw', why: 'You\'re winning! Take your time and play it out.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You are a pawn up in an endgame. What should you trade?',
        options: [
          { text: 'Pieces, but keep the pawns', correct: true, why: 'Fewer pieces makes your extra pawn count more. Fewer pawns gives the defender drawing chances.' },
          { text: 'Pawns, but keep the pieces', why: 'With no pawns left, even a full piece extra can be a draw.' },
          { text: 'Everything, as fast as possible', why: 'If the last pawns disappear, there\'s nothing left to make a queen.' },
        ],
      },
      {
        type: 'quiz',
        question: 'An outside passed pawn is a passed pawn far away from the other pawns. Why is it so strong?',
        options: [
          { text: 'It drags the enemy king away, so your king can eat the pawns on the other side', correct: true, why: 'The enemy king must chase it. Meanwhile your king goes shopping on the other wing.' },
          { text: 'It can\'t be captured', why: 'It can — but whoever captures it is far from the real fight.' },
          { text: 'It moves two squares at a time', why: 'Only on its first move, like any pawn.' },
        ],
      },
    ],
  },
];
