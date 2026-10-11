import {
  ANASTASIA,
  ARABIAN,
  BODEN,
  EPAULETTE,
  HOOK,
  OPERA,
  SCHOLAR,
  SWINE,
} from './mates/positions.js';

const see = (fen, text, extra = {}) => ({ type: 'talk', fen, text, ...extra });
const mate = (fen, prompt, line, hint, success, extra = {}) => ({
  type: 'move',
  fen,
  prompt,
  line,
  hint,
  success,
  ...extra,
});

/*
 * Follow-up to Mating Patterns: Back Rank & Smothered. Those two stay in the first
 * lesson; this one is the other named mates every player should be able to see.
 */
export const moreMates = {
  id: 't-more-mates',
  track: 'tactics',
  title: 'More Mating Patterns',
  coach: 'mira',
  summary: 'Eight more mates with a name: see the picture, then deliver the checkmate yourself.',
  minutes: 10,
  steps: [
    {
      type: 'talk',
      text: 'Back-rank and smothered you already know. These are the other pictures. Each one is a team of pieces doing a simple job. See it, then play it — the name will stick because the shape will.',
    },

    see(
      SCHOLAR,
      'Scholar\'s Mate. The queen and bishop both stare at f7 — the weakest square at the start of the game. Four moves and it is over, if Black forgets to guard that pawn.',
      { arrows: [['h5', 'f7'], ['c4', 'f7']], highlights: ['f7'] },
    ),
    mate(
      SCHOLAR,
      'You are White. Deliver Scholar\'s Mate.',
      ['h5f7'],
      'The queen takes on f7. The bishop on c4 protects her, and the king is the only defender.',
      'Scholar\'s Mate. Easy to stop once you know it: develop, and never leave f7 (or f2) lonely.',
    ),

    see(
      ANASTASIA,
      'Anastasia\'s Mate. A knight covers the king\'s escape squares (g8 and g6). A rook then checks on the edge file — the h-file here. The king is trapped on the side of the board.',
      { arrows: [['e4', 'h4'], ['e7', 'g8'], ['e7', 'g6']], highlights: ['h8', 'h4'] },
    ),
    mate(
      ANASTASIA,
      'The knight has the escapes. Slide the rook to the h-file.',
      ['e4h4'],
      'Slide the rook across to h4. The h-file is open above the rook.',
      'Anastasia\'s Mate. Knight on the side-door, rook on the edge.',
    ),

    see(
      ARABIAN,
      'Arabian Mate. Oldest picture in the book: a knight and a rook trap a king in the corner. The knight covers the escape and protects the rook.',
      { arrows: [['h2', 'h7'], ['f6', 'h7'], ['f6', 'g8']], highlights: ['h8', 'h7'] },
    ),
    mate(
      ARABIAN,
      'Corner the king: rook next to it, knight standing guard.',
      ['h2h7'],
      'Put the rook on h7. Your knight on f6 protects it and covers g8.',
      'Arabian Mate. Rook in the king\'s face, knight as the bodyguard.',
    ),

    see(
      BODEN,
      'Boden\'s Mate. Two bishops on crossing diagonals. The king has usually castled queenside, and its own rook and pawns finish the cage. Often a queen is given away to open the line.',
      { arrows: [['f1', 'a6'], ['f4', 'c7'], ['f4', 'b8']], highlights: ['c8', 'a6'] },
    ),
    mate(
      BODEN,
      'Cross the bishops. The empty diagonal to a6 is the mate.',
      ['f1a6'],
      'Bishop from f1 to a6. The other bishop already cuts the other diagonal.',
      'Boden\'s Mate. Two bishops, two colours, nowhere to hide.',
    ),

    see(
      HOOK,
      'Hook Mate. A rook, a knight and a pawn on the edge. The pawn is the hook: it protects the rook. The knight takes away the last squares.',
      { arrows: [['h2', 'h7'], ['g6', 'h7'], ['f6', 'g8']], highlights: ['h8', 'g6'] },
    ),
    mate(
      HOOK,
      'Hang the rook on the hook — the pawn on g6 will hold it.',
      ['h2h7'],
      'Rook to h7. The g-pawn and the knight both look after that square.',
      'Hook Mate. Pawn holds the rook. Knight holds the king.',
    ),

    see(
      OPERA,
      'Opera Mate — named after Paul Morphy\'s night at the opera. A rook (or queen) lands on the back row; one bishop cuts the escape and protects the rook.',
      { arrows: [['d1', 'd8'], ['g5', 'd8'], ['g5', 'e7']], highlights: ['e8', 'd8'] },
    ),
    mate(
      OPERA,
      'Morphy\'s finish: rook to the back row. The bishop on g5 does the rest.',
      ['d1d8'],
      'The rook goes to d8. Your bishop already guards that square and e7.',
      'Opera Mate. One sliding piece, one bishop — the king has no door.',
    ),

    see(
      SWINE,
      'Blind Swine Mate. Two rooks on the 7th rank are called "pigs on the seventh". When they lock the king against the edge, it is mate.',
      { arrows: [['g7', 'h7'], ['f7', 'h7']], highlights: ['h8', 'h7'] },
    ),
    mate(
      SWINE,
      'Both rooks already sit on the 7th. The one on g7 takes on h7.',
      ['g7h7'],
      'Take the h-pawn with the rook next to it. The other rook on f7 protects it.',
      'Blind swine. Two rooks on the 7th — the king has no row left.',
    ),

    see(
      EPAULETTE,
      'Epaulette Mate. The king stands between two of its own pieces — the "shoulder pads". A queen checks from the front and those helpers block every step sideways.',
      { arrows: [['d5', 'e6'], ['e6', 'e8']], highlights: ['e8', 'd8', 'f8'] },
    ),
    mate(
      EPAULETTE,
      'The rooks are the shoulder pads. Put the queen right in front of the king.',
      ['d5e6'],
      'Queen to e6 — one square in front of the king, staring up the file.',
      'Epaulette Mate. Their own pieces become the walls.',
    ),

    {
      type: 'quiz',
      fen: ARABIAN,
      question: 'A rook and a knight trap a king in the corner. Which mate is that?',
      options: [
        { text: 'Arabian Mate', correct: true, why: 'Rook next to the king, knight covering the escape and protecting the rook.' },
        { text: 'Scholar\'s Mate', why: 'That one is queen and bishop on f7, in the opening.' },
        { text: 'Epaulette Mate', why: 'That one is a queen in front of a king wearing two of its own pieces as shoulder pads.' },
      ],
    },
    {
      type: 'quiz',
      fen: BODEN,
      question: 'Two bishops on crossing diagonals, king stuck after queenside castling. Which mate?',
      options: [
        { text: 'Boden\'s Mate', correct: true, why: 'The bishops cut every colour. A queen is often given away to open one of those lines.' },
        { text: 'Opera Mate', why: 'Opera is a rook (or queen) plus one bishop, not two bishops.' },
        { text: 'Hook Mate', why: 'Hook is rook, knight and a pawn that holds the rook.' },
      ],
    },
    {
      type: 'recap',
      title: 'Eight pictures',
      text: 'Back-rank and smothered you already had. Add these to the list:',
      items: [
        { label: 'f7', title: 'Scholar\'s Mate', text: 'Queen and bishop on the weak f7 (or f2) pawn.' },
        { label: 'h', title: 'Anastasia', text: 'Knight covers the escapes; rook checks on the edge file.' },
        { label: 'N+R', title: 'Arabian', text: 'Knight and rook lock a king in the corner.' },
        { label: 'B+B', title: 'Boden', text: 'Two bishops on crossing diagonals.' },
        { label: 'P', title: 'Hook', text: 'Rook, knight, and a pawn that holds the rook.' },
        { label: 'B+R', title: 'Opera', text: 'Rook on the back row; one bishop cuts the door.' },
        { label: '7th', title: 'Blind swine', text: 'Two rooks on the 7th, king trapped on the edge.' },
        { label: 'Q', title: 'Epaulette', text: 'Queen in front; the king\'s own pieces are the walls.' },
      ],
    },
  ],
};
