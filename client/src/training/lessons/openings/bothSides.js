import {
  CARO_D5,
  D4,
  D4D5,
  E4,
  E4E5,
  E4E5_NF3_NC6,
  FRENCH_ADV,
  FRENCH_D5,
  ITALIAN,
  KID,
  LONDON,
  LONDON_SETUP,
  QG,
  RUY,
  SIC,
  SLAV,
} from './positions.js';

/* Scripted opening line: student plays even plies, the coach replies the odd ones. */
const play = (fen, prompt, line, hint, success, extra = {}) => ({
  type: 'move',
  teach: true,
  fen,
  prompt,
  line,
  hint,
  success,
  ...extra,
});

const see = (fen, text, extra = {}) => ({ type: 'talk', fen, text, ...extra });

/*
 * Hands-on follow-up to Openings Are a Race: play each named opening, then
 * sit on the other side and meet it. Kai — less talking, more pieces moving.
 */
export const openingSidesLesson = {
  id: 'b-opening-sides',
  track: 'beginner',
  title: 'Both Sides of the Opening',
  coach: 'kai',
  summary: 'Play the first moves of the big openings as White, then sit as Black and meet them — and the other way around.',
  minutes: 12,
  steps: [
    {
      type: 'talk',
      text: 'Last lesson was names and styles. This one is the board. You play the first moves of each opening as the side that chose it — then flip seats and meet it. Same three questions. Hands on the pieces. Go!',
    },

    see(
      ITALIAN,
      'Italian Game. White\'s bishop on c4 aims at f7 — Black\'s weakest square. The knight on f3 hits e5. Both sides can castle next.',
      { orientation: 'white', arrows: [['c4', 'f7'], ['f3', 'e5']], highlights: ['c4', 'f7'] },
    ),
    play(
      E4E5,
      'You are White. Play the Italian: knight out, then bishop to c4.',
      ['g1f3', 'b8c6', 'f1c4'],
      'First the king\'s knight toward the center. Then the bishop slides to c4.',
      'That\'s the Italian. Bishop staring at f7, king ready to castle.',
    ),
    play(
      ITALIAN,
      'Now you are Black. Meet the Italian the calm way: bishop to c5, then the knight to f6.',
      ['f8c5', 'c2c3', 'g8f6'],
      'Copy White a little — bishop out toward the center, then the other knight.',
      'Giuoco Piano — the "quiet game". Both sides developed. You can also meet it with ...Nf6 (Two Knights) if you want a fight.',
      { accept: { 0: ['f8c5', 'g8f6'] } },
    ),

    see(
      RUY,
      'Ruy Lopez. Same first two moves as the Italian, but the bishop nags the knight on c6 — the piece that defends e5.',
      { orientation: 'white', arrows: [['b5', 'c6'], ['c6', 'e5']], highlights: ['b5', 'c6'] },
    ),
    play(
      E4E5_NF3_NC6,
      'You are White. Play the Ruy Lopez: bishop to b5.',
      ['f1b5'],
      'The bishop goes to b5, not c4. It eyes the knight that guards e5.',
      'Ruy Lopez. Pressure on c6 already.',
    ),
    play(
      RUY,
      'You are Black. Kick the bishop with ...a6, then develop the knight to f6.',
      ['a7a6', 'b5a4', 'g8f6'],
      'Poke the bishop with the a-pawn. After it slides back, bring out your king\'s knight.',
      'The Morphy Defence. The bishop is still annoying, but your pieces are coming out and e5 is safe.',
    ),

    see(
      QG,
      'Queen\'s Gambit. White offers the c-pawn to pull Black\'s d-pawn off the center. Take it and you usually can\'t keep it.',
      { orientation: 'white', arrows: [['c4', 'd5']], highlights: ['c4', 'd5'] },
    ),
    play(
      D4D5,
      'You are White. Play the Queen\'s Gambit: offer the c-pawn.',
      ['c2c4'],
      'The c-pawn steps two squares and attacks d5.',
      'Queen\'s Gambit. You are fighting for the center from the side.',
    ),
    play(
      QG,
      'You are Black. Decline it the solid way: support d5 with ...e6.',
      ['e7e6'],
      'Do not grab c4 yet. Put a pawn on e6 so d5 has a friend.',
      'Queen\'s Gambit Declined. Sturdy — just remember the bishop on c8 is a little boxed in.',
      {
        wrong: {
          d5c4: 'If you take on c4, White can grab the center with e4. Decline it for now.',
          c7c6: 'That\'s the Slav — we play that in a minute. For the Queen\'s Gambit Declined, support d5 with ...e6.',
        },
      },
    ),

    see(
      LONDON_SETUP,
      'London System. Same house almost every game: bishop already outside the pawn chain on f4, pawn on e3. Low memory, solid as a brick.',
      { orientation: 'white', arrows: [['f4', 'c7'], ['e3', 'd4']], highlights: ['f4', 'e3'] },
    ),
    play(
      D4D5,
      'You are White. Build the London: bishop to f4, then e3.',
      ['c1f4', 'g8f6', 'e2e3'],
      'Get the dark-squared bishop out BEFORE you close the door with e3.',
      'London house is up. Next you can play Nf3, c3, and castle.',
    ),
    play(
      LONDON,
      'You are Black. Develop the knight, then chip the center with ...c5.',
      ['g8f6', 'e2e3', 'c7c5'],
      'Knight to f6 first. After White plays e3, hit d4 with the c-pawn.',
      'That\'s how you meet a system: develop, then break the center so White cannot sit forever.',
    ),

    see(
      SIC,
      'Sicilian Defense. Black fights for the center from the side. The c-pawn stops White from having a free d4 later — unless White forces it open.',
      { orientation: 'black', arrows: [['c5', 'd4']], highlights: ['c5', 'e4'] },
    ),
    play(
      E4,
      'You are Black. Answer 1.e4 with the Sicilian: ...c5.',
      ['c7c5'],
      'The c-pawn, not the e-pawn. Fight from the side.',
      'Sicilian. Unbalanced already — both sides will get attacking chances.',
    ),
    play(
      SIC,
      'You are White. Meet the Sicilian the open way: knight to f3, then blast the center with d4.',
      ['g1f3', 'd7d6', 'd2d4'],
      'Knight first, then the d-pawn two squares. You offer a pawn trade to open the middle.',
      'Open Sicilian. After ...cxd4 you recapture with the knight and both sides have room to attack.',
    ),

    see(
      CARO_D5,
      'Caro-Kann. Black supports ...d5 with the c-pawn, so the light-squared bishop can still come out later. Solid as a rock.',
      { orientation: 'black', arrows: [['c6', 'd5'], ['d5', 'e4']], highlights: ['c6', 'd5'] },
    ),
    play(
      E4,
      'You are Black. Play the Caro-Kann: ...c6, then ...d5.',
      ['c7c6', 'd2d4', 'd7d5'],
      'c-pawn one square first, then hit e4 with ...d5.',
      'Caro-Kann. Your bishop on c8 still has a door.',
    ),
    play(
      CARO_D5,
      'You are White. Meet the Caro the classical way: develop the queen\'s knight.',
      ['b1c3'],
      'The knight to c3 defends e4 and keeps the center under pressure.',
      'Classical Caro. You can also take on d5 or push e5 — same idea: do not let Black freewheel.',
      { accept: { 0: ['b1c3', 'e4d5', 'e4e5'] } },
    ),

    see(
      FRENCH_ADV,
      'French Defense, Advance. White\'s pawn chain d4–e5 grabs space. Black\'s bishop on c8 is sleepy — so Black chips the base with ...c5.',
      { orientation: 'black', arrows: [['e5', 'd6'], ['c7', 'c5']], highlights: ['e5', 'd4', 'c5'] },
    ),
    play(
      E4,
      'You are Black. Play the French: ...e6, then ...d5.',
      ['e7e6', 'd2d4', 'd7d5'],
      'e-pawn one square, then hit the center.',
      'French. Sturdy chain coming. Plan how to free that c8-bishop later.',
    ),
    play(
      FRENCH_D5,
      'You are White. Meet the French by clamping space: push e5.',
      ['e4e5'],
      'The e-pawn steps onto e5 and shuts the door on Black\'s king\'s knight.',
      'Advance French. You have space. Black will hit d4 with ...c5 — expect it.',
      { accept: { 0: ['e4e5', 'b1c3', 'b1d2'] } },
    ),
    play(
      FRENCH_ADV,
      'Back to Black. Chip the pawn chain: ...c5.',
      ['c7c5'],
      'The c-pawn attacks d4 — the base of White\'s chain.',
      'That\'s the French idea. You gave White space, now you lean on the chain.',
    ),

    see(
      SLAV,
      'Slav Defense. Same Queen\'s Gambit start, but Black guards d5 with ...c6 so the light-squared bishop stays free.',
      { orientation: 'black', arrows: [['c6', 'd5']], highlights: ['c6', 'd5', 'c8'] },
    ),
    play(
      QG,
      'You are Black. Meet 2.c4 with the Slav: ...c6.',
      ['c7c6'],
      'c-pawn one square. It holds d5 and leaves the bishop a path.',
      'Slav. Rock-solid. Next you can develop knights and slide the bishop out before ...e6.',
    ),
    play(
      SLAV,
      'You are White. Meet the Slav by developing: knight to f3, then the other knight to c3.',
      ['g1f3', 'g8f6', 'b1c3'],
      'King\'s knight first, then the queen\'s knight. Keep an eye on d5 and e4.',
      'Both sides developed. No panic — the Slav is a long, careful fight.',
    ),

    see(
      KID,
      'King\'s Indian. Black let White take the center, tucked a bishop on g7, and will strike later on the flanks. Hypermodern.',
      { orientation: 'black', arrows: [['g7', 'd4'], ['g8', 'f6']], highlights: ['g7', 'd4', 'c4'] },
    ),
    play(
      D4,
      'You are Black. Play the King\'s Indian: knight, then ...g6 and bishop to g7.',
      ['g8f6', 'c2c4', 'g7g6', 'b1c3', 'f8g7'],
      'Knight first so White cannot play e4 for free. Then fianchetto the bishop.',
      'King\'s Indian house. You look cramped — on purpose. The strike comes later.',
    ),
    play(
      KID,
      'You are White. Take the space they offered: push e4.',
      ['e2e4'],
      'The e-pawn two squares. You own d4, c4 and e4.',
      'Big center. Enjoy it — but keep watching for ...c5 or ...e5 when Black is ready.',
    ),

    {
      type: 'recap',
      title: 'Play it, then meet it',
      text: 'One White start, one answer to 1.e4, one answer to 1.d4. You just tried them from both chairs:',
      items: [
        { label: 'Bc4', title: 'Italian', text: 'White aims at f7. Black answers ...Bc5 or ...Nf6 and castles.' },
        { label: 'Bb5', title: 'Ruy Lopez', text: 'White nags the knight on c6. Black kicks with ...a6 and develops.' },
        { label: 'c4', title: 'Queen\'s Gambit', text: 'White offers a side pawn. Black declines with ...e6 or the Slav ...c6.' },
        { label: 'Bf4', title: 'London', text: 'White builds the same house. Black develops, then breaks with ...c5.' },
        { label: 'c5', title: 'Sicilian', text: 'Black fights from the side. White opens the middle with Nf3 and d4.' },
        { label: 'c6', title: 'Caro-Kann', text: 'Black hits e4 safely. White develops (Nc3) or takes on d5.' },
        { label: 'e6', title: 'French', text: 'Black builds a chain. White can clamp with e5; Black chips with ...c5.' },
        { label: 'g6', title: 'King\'s Indian', text: 'Black lets White take the center, then strikes later from the sides.' },
      ],
    },
    {
      type: 'quiz',
      fen: E4E5_NF3_NC6,
      question: 'White to move after 1.e4 e5 2.Nf3 Nc6. Which move makes the Italian, and which makes the Ruy Lopez?',
      options: [
        { text: '3.Bc4 is the Italian; 3.Bb5 is the Ruy Lopez', correct: true, why: 'Same first two moves. The bishop\'s square decides the name — and the plan.' },
        { text: '3.Bb5 is the Italian; 3.Bc4 is the Ruy Lopez', why: 'Swap them. Italian bishop looks at f7 (c4). Ruy bishop nags the knight (b5).' },
        { text: 'Both are the Sicilian', why: 'The Sicilian starts 1.e4 c5. This position is 1.e4 e5.' },
      ],
    },
    {
      type: 'quiz',
      fen: SIC,
      question: 'Black played the Sicilian (1.e4 c5). How does White usually open the center?',
      options: [
        { text: 'Nf3, then d4', correct: true, why: 'The Open Sicilian: develop the knight, then offer a pawn trade on d4.' },
        { text: 'Give the queen away on move two', why: 'No. You meet it with pieces and a center break, not a gift.' },
        { text: 'Castle without moving a piece', why: 'You still need to develop first. Nf3 is the usual start.' },
      ],
    },
    {
      type: 'quiz',
      fen: FRENCH_ADV,
      question: 'White clamped the French with e5. What should Black do next?',
      options: [
        { text: 'Chip the pawn chain with ...c5', correct: true, why: 'Hit the base (d4). That is how Black gets air and a plan.' },
        { text: 'Push every kingside pawn', why: 'That just hangs pawns in front of your king.' },
        { text: 'Resign — the space disadvantage is fatal', why: 'The French is a counter-punch. Space is White\'s; the break is yours.' },
      ],
    },
  ],
};
