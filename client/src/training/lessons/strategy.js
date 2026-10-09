/*
 * Strategy Lab: positional understanding built around the idea of "imbalances" —
 * the differences between the two sides that tell you what to play.
 * Concepts follow Jeremy Silman's How to Reassess Your Chess; text and positions are original.
 */
const KNIGHT_VS_BISHOP = '6k1/4bp1p/3p2p1/3Np3/4P3/6P1/P4P1P/6K1 w - - 0 1';
const BACKWARD = '6k1/pp3ppp/3p4/4p3/2P1P3/8/PP3PPP/6K1 w - - 0 1';
const ISOLATED = '6k1/pp3ppp/8/3p4/8/8/PP3PPP/6K1 w - - 0 1';
const BREAKTHROUGH = '7k/ppp5/8/PPP5/8/8/8/K7 w - - 0 1';

export const strategyLessons = [
  {
    id: 's-imbalances',
    track: 'strategy',
    title: 'Read the Position: Imbalances',
    coach: 'mira',
    summary: 'Find the differences between the two sides — they tell you what to do.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'Most players pick moves by mood: attack when they feel brave, hide when they feel scared. Strong players let the position decide. The trick is to spot the imbalances — the important differences between your position and your opponent\'s.',
      },
      {
        type: 'recap',
        title: 'The 10 imbalances',
        numbered: true,
        text: 'Whenever you\'re unsure what to do, check the position against this list:',
        items: [
          { title: 'Minor pieces', text: 'Is one side\'s bishop or knight clearly better than the other?' },
          { title: 'Pawn structure', text: 'Weak pawns, passed pawns, doubled or isolated pawns.' },
          { title: 'Space', text: 'Who controls more of the board?' },
          { title: 'Material', text: 'Who has more, and does it matter right now?' },
          { title: 'Key files', text: 'Open files are roads for rooks.' },
          { title: 'Weak squares', text: 'Holes that the enemy pawns can no longer guard.' },
          { title: 'Development', text: 'Who has more pieces out and ready?' },
          { title: 'Initiative', text: 'Who is making the threats and setting the agenda?' },
          { title: 'King safety', text: 'Whose king is easier to attack?' },
          { title: 'Statics vs. dynamics', text: 'Long-lasting advantages versus short-term energy.' },
        ],
      },
      {
        type: 'quiz',
        fen: KNIGHT_VS_BISHOP,
        question: 'Let\'s practise. What\'s the biggest imbalance in this position?',
        options: [
          { text: 'White\'s knight on d5 is far better than Black\'s bishop on e7', correct: true, why: 'The knight sits on a protected central square. The bishop is stuck behind its own pawns on dark squares.' },
          { text: 'Material — White is a pawn up', why: 'Count again: material is level. The difference is in the quality of the pieces.' },
          { text: 'Black has more space', why: 'Neither side has a real space advantage here. Look at the minor pieces.' },
        ],
      },
      {
        type: 'talk',
        text: 'Here\'s a simple habit before you calculate anything: first check for any crude threats against you. Then name the imbalances for BOTH sides out loud (in your head). Only then ask: "Which move makes my imbalances stronger, or weakens theirs?"',
      },
      {
        type: 'quiz',
        question: 'You notice your opponent has a weak, isolated pawn on an open file. What does that imbalance tell you to do?',
        options: [
          { text: 'Aim your rooks (and other pieces) at that pawn', correct: true, why: 'A fixed weakness on an open file is a target. Pile up on it.' },
          { text: 'Trade off all the rooks', why: 'Rooks are the best pieces for attacking a pawn on an open file. Keep them.' },
          { text: 'Ignore it and push your kingside pawns', why: 'That ignores the clearest imbalance on the board.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your opponent has a big lead in development, but you have an extra pawn. What should YOU aim for?',
        options: [
          { text: 'Close things up, finish developing and survive the short-term pressure', correct: true, why: 'A lead in development fades if it isn\'t used quickly. Your extra pawn is a long-term plus.' },
          { text: 'Open the position as fast as possible', why: 'Opening lines helps the side with more pieces out — that\'s your opponent.' },
          { text: 'Give the pawn back immediately', why: 'Only if it\'s necessary. Usually you try to consolidate and keep it.' },
        ],
      },
    ],
  },
  {
    id: 's-minor-pieces',
    track: 'strategy',
    title: 'Bishops vs. Knights',
    coach: 'lin',
    summary: 'Which minor piece is better depends on the pawns. Learn to tell.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        fen: KNIGHT_VS_BISHOP,
        highlights: ['d5'],
        text: 'Knights are short-range pieces. They need safe, advanced squares where enemy pawns can\'t chase them away — "support points" like d5 here, protected by the e4 pawn. A knight on such a square can be stronger than a rook.',
      },
      {
        type: 'talk',
        fen: KNIGHT_VS_BISHOP,
        highlights: ['e7', 'd6', 'e5'],
        text: 'Bishops love open diagonals. Black\'s bishop is "bad" — its own pawns on d6 and e5 stand on its colour and block it. It\'s little more than a tall pawn defending them.',
      },
      {
        type: 'quiz',
        question: 'When are bishops usually stronger than knights?',
        options: [
          { text: 'In open positions with pawns on both sides of the board', correct: true, why: 'Long diagonals let bishops switch wings quickly. Knights are slow over long distances.' },
          { text: 'In locked positions full of pawns', why: 'Closed positions block bishops and give knights stable squares.' },
          { text: 'Never — knights are always better', why: 'Both pieces are worth about 3 points. The pawns decide which one shines.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You have the two bishops against bishop and knight. What should you usually do?',
        options: [
          { text: 'Open the position so both bishops get long diagonals', correct: true, why: 'The bishop pair is at its best on an open board.' },
          { text: 'Lock the pawns so nothing can move', why: 'That helps the knight. Open lines help the bishops.' },
          { text: 'Trade one of the bishops straight away', why: 'That throws away the advantage. Your opponent wants that trade, not you.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Only one bishop each, on opposite colours. What\'s true?',
        options: [
          { text: 'In an endgame they often draw; in the middlegame they help the attacker', correct: true, why: 'Each bishop rules squares the other can\'t touch. Defending is easy in the endgame, but an attacker\'s bishop can\'t be opposed.' },
          { text: 'They always lead to a win for the side with more pawns', why: 'Even two extra pawns are often not enough in pure opposite-coloured bishop endings.' },
          { text: 'They cancel out, so they don\'t matter', why: 'They can\'t trade each other off — which is exactly why they matter.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your pawns are fixed on light squares. Which bishop do you want to keep?',
        options: [
          { text: 'The dark-squared bishop', correct: true, why: 'It works on the squares your pawns don\'t cover — the two complement each other.' },
          { text: 'The light-squared bishop', why: 'It would be blocked by your own pawns. That\'s a "bad" bishop.' },
          { text: 'It makes no difference', why: 'Pawn colour decides a bishop\'s scope. It makes a big difference.' },
        ],
      },
    ],
  },
  {
    id: 's-rooks',
    track: 'strategy',
    title: 'Roads for Rooks',
    coach: 'rook',
    summary: 'Open files, the 7th rank and how to create a file when there isn\'t one.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Rooks are useless behind closed pawns. They need open files (no pawns) or half-open files (only enemy pawns). If there\'s no open file, make one — a pawn exchange (a "pawn break") opens the road.',
      },
      {
        type: 'move',
        fen: '6k1/pp3pp1/7p/8/8/8/PP3PPP/3R2K1 w - - 0 1',
        prompt: 'The d-file is open. Use it to invade the 7th rank, where Black\'s pawns are waiting.',
        line: ['d1d7'],
        wrong: { d1d8: 'Check, but the king just steps to h7 and your rook has nothing to attack on the back row.' },
        hint: 'Go down the open file to the row where Black\'s pawns are standing.',
        success: 'A rook on the 7th attacks pawns from the side, where they can\'t protect each other. Strong players call it a "pig" on the 7th.',
      },
      {
        type: 'quiz',
        question: 'There are no open files. How do you create one for your rooks?',
        options: [
          { text: 'With a pawn break — push a pawn so it can be exchanged', correct: true, why: 'When pawns trade, the file they stood on opens up.' },
          { text: 'Move the rook back and forth until a file opens', why: 'Files don\'t open by themselves. You need a pawn exchange.' },
          { text: 'Trade off the rooks', why: 'That just gives up on using them.' },
        ],
      },
      {
        type: 'quiz',
        question: 'Your opponent controls the only open file. What\'s a good way to fight back?',
        options: [
          { text: 'Put your own rook on that file to challenge it, or cover the entry squares', correct: true, why: 'Contest the file, or make sure the enemy rook has nowhere useful to land.' },
          { text: 'Ignore it — files don\'t matter', why: 'An enemy rook reaching your 7th rank can be decisive.' },
          { text: 'Push pawns on the other wing', why: 'That doesn\'t stop the invasion.' },
        ],
      },
    ],
  },
  {
    id: 's-targets',
    track: 'strategy',
    title: 'Weak Pawns and Holes',
    coach: 'viktor',
    summary: 'Isolated, backward and doubled pawns — and the squares they leave behind.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'A weak pawn is one that can\'t easily be defended by another pawn. It must be guarded by pieces instead — and pieces stuck defending aren\'t doing anything else. Players who hunt for these targets win a lot of games.',
      },
      {
        type: 'find',
        fen: ISOLATED,
        prompt: 'Tap Black\'s isolated pawn — the one with no friendly pawns on the files next to it.',
        targets: ['d5'],
        hint: 'Look for a pawn with empty files on both sides.',
        success: 'The d5 pawn has no neighbours on the c- or e-file. No pawn can ever protect it.',
      },
      {
        type: 'talk',
        fen: ISOLATED,
        highlights: ['d4'],
        text: 'The square in front of an isolated pawn is a perfect home for an enemy piece — no pawn can chase it away. Blockade on d4, then attack the pawn with everything.',
      },
      {
        type: 'find',
        fen: BACKWARD,
        prompt: 'Now tap Black\'s backward pawn: it\'s behind its neighbour and can\'t safely move forward.',
        targets: ['d6'],
        hint: 'One black pawn has been left behind its friend on e5.',
        success: 'd6 can\'t advance (d5 is guarded by White\'s c4 and e4 pawns), and no black pawn can protect it.',
      },
      {
        type: 'talk',
        fen: BACKWARD,
        highlights: ['d5'],
        text: 'Notice d5 — a "hole". No black pawn can ever attack it again. A white knight on d5 would be a monster. Every pawn move leaves squares behind it that the pawn can never guard again.',
      },
      {
        type: 'quiz',
        question: 'Why are doubled pawns (two pawns of the same colour on one file) often weak?',
        options: [
          { text: 'They can\'t protect each other, and the front one blocks the back one', correct: true, why: 'They also can\'t be used to create a passed pawn easily.' },
          { text: 'They\'re against the rules', why: 'They\'re legal — just usually a weakness.' },
          { text: 'They are always lost immediately', why: 'Not always. Sometimes they control useful squares or open a file. But they\'re often a long-term target.' },
        ],
      },
    ],
  },
  {
    id: 's-space',
    track: 'strategy',
    title: 'Space: Squeeze or Break Free',
    coach: 'kai',
    summary: 'How to use extra space — and how to survive when you\'re cramped.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Space means the squares your pawns and pieces control. Pawns far up the board give your pieces room to move and leave your opponent\'s pieces tripping over each other.',
      },
      {
        type: 'quiz',
        question: 'You have a big space advantage. What should you avoid?',
        options: [
          { text: 'Trading lots of pieces', correct: true, why: 'Each trade gives the cramped side more room to breathe.' },
          { text: 'Slowly improving your pieces', why: 'That\'s exactly how you use space: improve while they suffer.' },
          { text: 'Gaining even more space', why: 'More space is usually good — as long as you don\'t create weak squares.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You\'re the cramped side. Which two ideas help most?',
        options: [
          { text: 'Exchange pieces and prepare pawn breaks', correct: true, why: 'Trades free up room; a pawn break challenges the space-gaining pawns.' },
          { text: 'Wait passively and shuffle pieces', why: 'Passive waiting lets your opponent squeeze you further.' },
          { text: 'Attack on the side where your opponent has more space', why: 'That\'s where they\'re strongest. Break where it helps you most.' },
        ],
      },
      {
        type: 'quiz',
        question: 'What\'s the hidden downside of pushing pawns forward to gain space?',
        options: [
          { text: 'It leaves weak squares behind, and advanced pawns can become targets', correct: true, why: 'A pawn that moves forward can never go back to guard the squares it passed.' },
          { text: 'There is no downside', why: 'Every pawn move has a cost — the squares it leaves behind.' },
          { text: 'It loses material', why: 'Not by itself, but it can create targets.' },
        ],
      },
    ],
  },
  {
    id: 's-statics-dynamics',
    track: 'strategy',
    title: 'Long-Term vs. Short-Term',
    coach: 'elena',
    summary: 'Static advantages last; dynamic ones fade. Know which game you\'re playing.',
    minutes: 5,
    steps: [
      {
        type: 'talk',
        text: 'Some advantages last a long time: an extra pawn, a better pawn structure, a good knight against a bad bishop. Those are static. Others are fleeting: a lead in development, an attack, the initiative. Those are dynamic — use them quickly or they disappear.',
      },
      {
        type: 'quiz',
        question: 'Which of these is a DYNAMIC advantage?',
        options: [
          { text: 'A lead in development', correct: true, why: 'Once your opponent finishes developing, it\'s gone. Strike while it lasts.' },
          { text: 'An extra pawn', why: 'An extra pawn stays — that\'s a static plus.' },
          { text: 'Your opponent\'s doubled pawns', why: 'Pawn weaknesses tend to last. That\'s static.' },
        ],
      },
      {
        type: 'quiz',
        question: 'You sacrificed a pawn for a big lead in development. What must you do?',
        options: [
          { text: 'Play energetically — open lines and create threats now', correct: true, why: 'If you play slowly, your opponent catches up and is simply a pawn ahead.' },
          { text: 'Play quiet moves and wait for a better moment', why: 'Waiting lets the dynamic advantage fade.' },
          { text: 'Trade queens to reduce risk', why: 'Trading pieces usually kills your attacking chances and leaves you a pawn down.' },
        ],
      },
      {
        type: 'quiz',
        question: 'A free pawn is on offer, but taking it lets your opponent develop quickly. How should you decide?',
        options: [
          { text: 'Calculate whether you can survive the pressure — if yes, take it', correct: true, why: 'Material is a lasting plus. Don\'t be scared to take it, but check the dynamic price first.' },
          { text: 'Never take pawns in the opening', why: 'Too fearful. Many good players grab material and then defend carefully.' },
          { text: 'Always take everything offered', why: 'Too greedy. Sometimes the attack is worth much more than a pawn.' },
        ],
      },
    ],
  },
  {
    id: 's-passed-pawns',
    track: 'strategy',
    title: 'Passed Pawns and Blockades',
    coach: 'lin',
    summary: 'Create passed pawns, push them with support — or stop them cold.',
    minutes: 6,
    steps: [
      {
        type: 'talk',
        text: 'A passed pawn is a baby queen. It gets stronger the further it advances and the more pieces help it. On the defending side, the best way to stop it is a blockade: put a piece directly in front of it.',
      },
      {
        type: 'move',
        fen: BREAKTHROUGH,
        prompt: 'Three pawns against three, and both kings are far away. Break through and make a queen!',
        line: ['b5b6', 'c7b6', 'a5a6', 'b7a6', 'c5c6'],
        wrong: { c5b6: 'After ...axb6 axb6, your last pawn is stuck behind Black\'s b7 pawn. Sacrifice again instead!' },
        hint: 'Sacrifice the middle pawn first. Then sacrifice another to clear the way for the last one.',
        success: 'The classic breakthrough! Two pawns sacrificed, and the third walks to the queening square.',
      },
      {
        type: 'quiz',
        question: 'Which piece makes the best blockader in front of a passed pawn?',
        options: [
          { text: 'The knight', correct: true, why: 'A blockading knight still attacks squares in every direction, and it\'s hard to dislodge.' },
          { text: 'The queen', why: 'The queen is too valuable to sit still — any attack on her breaks the blockade.' },
          { text: 'The king, always', why: 'The king is great in endgames, but in the middlegame it\'s too exposed.' },
        ],
      },
      {
        type: 'quiz',
        question: 'When is a passed pawn almost useless?',
        options: [
          { text: 'When it\'s firmly blockaded and nothing can support it', correct: true, why: 'A stuck passer just ties up one of your pieces defending it.' },
          { text: 'When it\'s protected by another pawn', why: 'A protected passer is usually very strong.' },
          { text: 'When it\'s on the 6th rank', why: 'That\'s when it\'s most dangerous!' },
        ],
      },
      {
        type: 'quiz',
        question: 'Who usually helps a passed pawn advance best in the endgame?',
        options: [
          { text: 'Its own king, walking in front of or beside it', correct: true, why: 'In the endgame the king is a fighting piece. It shepherds the pawn home.' },
          { text: 'Nobody — pawns should advance alone', why: 'Lonely passers get rounded up. Give it friends.' },
          { text: 'Only the queen', why: 'Any piece can help, and the king is often best in endgames.' },
        ],
      },
    ],
  },
];
