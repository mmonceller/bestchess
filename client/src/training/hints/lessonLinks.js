/*
 * Connects the ideas behind an engine hint (tags from explainMove) to lessons.
 * For each tag, lessons are listed from most to least relevant; `say` is what that
 * lesson's coach reminds the player of. `when` limits a link to fitting positions.
 */
export const TAG_LESSONS = {
  mate: [
    { lesson: 'b-queen-box', when: (t) => t.includes('loneKing'), say: 'Use the box method: keep shrinking the king\'s box until it has no squares left.' },
    { lesson: 'f-check', say: 'Checkmate is a check the king cannot escape: no safe square, no block, no capture.' },
  ],
  promotion: [
    { lesson: 'f-pawns', say: 'A pawn that reaches the last row turns into a queen. Small pawn, big reward!' },
  ],
  freePiece: [
    { lesson: 'b-loose-pieces', say: 'Loose pieces drop off. This one has no defender, so take it.' },
    { lesson: 'b-tactics-sprint', say: 'Scan for captures first. A free piece is the easiest win on the board.' },
  ],
  winMaterial: [
    { lesson: 'f-queen-king', say: 'Count the points: you get more than you give, so this trade is good for you.' },
    { lesson: 'b-loose-pieces', say: 'Look for pieces that are attacked more times than they are defended.' },
  ],
  trade: [
    { lesson: 'i-trade-logic', when: (t) => t.includes('ahead'), say: 'You are ahead, so trading pieces makes your extra material count even more.' },
  ],
  desperado: [
    { lesson: 'a-desperado', say: 'Your piece is doomed anyway, so make it die expensive and take something with it.' },
  ],
  fork: [
    { lesson: 'b-forks', say: 'One piece, two targets. Your opponent can only save one of them.' },
    { lesson: 'b-tactics-sprint', say: 'A fork! The same pattern you trained in the sprint.' },
  ],
  pin: [
    { lesson: 'i-pin-pile', say: 'Pin it, then hit it: the pinned piece cannot run, so pile up on it next.' },
  ],
  check: [
    { lesson: 'f-check', say: 'A check forces a reply. Your opponent must move the king, block, or capture.' },
  ],
  attack: [
    { lesson: 'b-tactics-sprint', say: 'Checks, captures and attacks first. This attack makes your opponent react.' },
  ],
  rescue: [
    { lesson: 'b-blunder-filter', say: 'Blunder filter: before anything else, check which of your pieces is under attack.' },
    { lesson: 'i-what-they-want', say: 'Ask what your opponent wants. Right now they want to take that piece.' },
  ],
  protect: [
    { lesson: 'i-what-they-want', say: 'Ask what your opponent wants. This move takes their target away.' },
    { lesson: 'b-blunder-filter', say: 'Blunder filter: make sure nothing of yours is left hanging.' },
  ],
  castle: [
    { lesson: 'b-opening-race', say: 'Openings are a race: castle to tuck your king away and bring a rook into the game.' },
    { lesson: 'f-special', say: 'Castling is the special king move: the king steps two squares and the rook jumps over.' },
    { lesson: 'f-golden-rules', say: 'Golden rule: keep your king safe by castling early.' },
  ],
  center: [
    { lesson: 'b-opening-race', say: 'Openings are a race: grab the center so your pieces have room to come out.' },
    { lesson: 'f-golden-rules', say: 'Golden rule: control the center squares.' },
  ],
  develop: [
    { lesson: 'b-opening-race', say: 'Openings are a race: bring a new piece out with each move.' },
    { lesson: 'f-golden-rules', say: 'Golden rule: get your knights and bishops off the back row.' },
  ],
  passedPawn: [
    { lesson: 'f-pawns', say: 'No enemy pawn can stop this one. Every step brings it closer to becoming a queen.' },
  ],
  activeKing: [
    { lesson: 'i-key-squares', when: (t) => t.includes('pawnEndgame'), say: 'In pawn endings, march the king to the key squares in front of your pawn.' },
    { lesson: 'f-queen-king', say: 'With few pieces left, the king becomes a fighter. Bring it forward.' },
  ],
  openFile: [
    { lesson: 'i-worst-piece', say: 'Fix your worst piece: a rook needs an open file to do its job.' },
  ],
  improve: [
    { lesson: 'i-worst-piece', say: 'Fix your worst piece: when nothing urgent is happening, improve the piece doing the least.' },
  ],
  loneKing: [
    { lesson: 'b-queen-box', say: 'Only the king is left. Use the box method: make its box smaller with every move.' },
  ],
  rookEndgame: [
    { lesson: 'a-lucena', when: (t) => t.includes('materialUp'), say: 'Rook endings: build Lucena\'s bridge so your king can shelter while the pawn promotes.' },
    { lesson: 'a-philidor', when: (t) => t.includes('materialDown'), say: 'Rook endings: build Philidor\'s third-row wall to keep the enemy king out and hold the draw.' },
  ],
  losing: [
    { lesson: 'a-practical', say: 'When you are behind, make it messy. Give your opponent problems to solve.' },
  ],
  ahead: [
    { lesson: 'i-trade-logic', say: 'You are ahead. Trade pieces and keep things simple.' },
  ],
  opening: [
    { lesson: 'b-opening-race', say: 'Openings are a race: develop, castle, and don\'t move the same piece twice.' },
    { lesson: 'f-golden-rules', say: 'Remember the golden rules: center, develop, castle.' },
  ],
};

/* Tags checked before the rest: concrete tactics and recognisable endgames beat generic ideas like "check". */
export const PRIORITY_TAGS = ['mate', 'fork', 'pin', 'desperado', 'freePiece', 'winMaterial', 'promotion', 'loneKing', 'rookEndgame'];

/* How each piece moves, for when the hint is a quiet move by that piece. */
export const PIECE_LESSONS = {
  knight: { lesson: 'f-knight', say: 'The knight jumps in an L shape and can hop over other pieces.' },
  bishop: { lesson: 'f-rook-bishop', say: 'The bishop slides diagonally as far as the path is clear.' },
  rook: { lesson: 'f-rook-bishop', say: 'The rook slides in straight lines, along rows and columns.' },
  queen: { lesson: 'f-queen-king', say: 'The queen moves like a rook and a bishop combined.' },
  king: { lesson: 'f-queen-king', say: 'The king steps one square in any direction.' },
  pawn: { lesson: 'f-pawns', say: 'Pawns move straight ahead but capture one square diagonally.' },
};
