/*
 * Board and rules words. An entry without `def` borrows the lesson glossary's definition
 * (`gloss` names the glossary word when it differs from the lower-cased name).
 */
export default [
  { name: 'Rank', aka: ['row'], level: 'beginner', lesson: 'f-board' },
  { name: 'File', aka: ['column'], level: 'beginner', lesson: 'f-board' },
  { name: 'Diagonal', level: 'beginner', lesson: 'f-rook-bishop' },
  { name: 'Capture', aka: ['take'], level: 'beginner' },
  { name: 'Check', level: 'beginner', lesson: 'f-check' },
  { name: 'Checkmate', aka: ['mate'], level: 'beginner', lesson: 'f-check' },
  { name: 'Stalemate', level: 'beginner', lesson: 'f-check' },
  { name: 'Castling', aka: ['castle', 'O-O', 'O-O-O', 'kingside', 'queenside'], level: 'beginner', lesson: 'f-special' },
  { name: 'En passant', level: 'beginner', lesson: 'f-special' },
  { name: 'Promotion', aka: ['queening', 'promote'], level: 'beginner', lesson: 'f-special' },
  {
    name: 'Underpromotion',
    level: 'intermediate',
    def: 'Promoting a pawn to a rook, bishop or knight instead of a queen. It\'s rare, but sometimes a queen would give stalemate, or only a knight gives check.',
  },
  { name: 'Legal move', level: 'beginner', def: 'Any move the rules allow. A move that leaves your own king in check is never legal.' },
  { name: 'Material', aka: ['piece values', 'points'], level: 'beginner', lesson: 'b-loose-pieces' },
  { name: 'Minor piece', level: 'beginner', lesson: 's-minor-pieces' },
  { name: 'Major piece', aka: ['heavy piece'], level: 'beginner', def: 'A rook or a queen (worth about 5 and 9 pawns). They can control whole rows and columns.' },
  { name: 'Notation', aka: ['algebraic notation', 'SAN'], level: 'beginner', lesson: 'f-notation', moves: '1.e4 e5 2.Nf3 Nc6' },
  { name: 'Draw', aka: ['tie'], level: 'beginner' },
  {
    name: 'Threefold repetition',
    aka: ['repetition'],
    level: 'beginner',
    lesson: 'm-tournament',
    def: 'If the exact same position appears three times (not always in a row), with the same player to move, a draw can be claimed. Online it\'s usually drawn automatically; at five times it always is.',
  },
  {
    name: 'Fifty-move rule',
    aka: ['50-move rule'],
    level: 'intermediate',
    lesson: 'm-tournament',
    def: 'If both players make 50 moves in a row with no capture and no pawn move, the game can be claimed as a draw. After 75 moves it\'s drawn automatically. There\'s no other move limit — not even against a lone king.',
  },
  {
    name: 'Insufficient material',
    level: 'beginner',
    def: 'Neither side has enough pieces left to ever give checkmate — like king against king, or king and knight against king. The game is a draw.',
  },
  { name: 'Resign', aka: ['resignation'], level: 'beginner', def: 'Giving up the game before checkmate. Players resign when the position is hopeless.' },
  {
    name: 'Touch-move',
    level: 'beginner',
    lesson: 'm-tournament',
    def: 'An over-the-board rule: if you touch one of your pieces on purpose, you must move it. If you touch an enemy piece, you must capture it if you can.',
  },
];
