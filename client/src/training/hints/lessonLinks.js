/*
 * Connects the method behind a move (tags from explainMove) to the lesson that teaches it.
 * Only concrete tactics, techniques and plans are listed. Tags that just describe the
 * position or are catch-alls (check, attack, space, improve, opening, ahead, ...) have no
 * lesson on purpose, and neither do lessons about how the pieces move, so a hint never
 * points to a lesson that doesn't teach what the move does.
 * For each tag, lessons are listed from most to least relevant; `say` is what that
 * lesson's coach reminds the player of. `when` limits a link to fitting positions.
 */
export const TAG_LESSONS = {
  mate: [
    { lesson: 'b-queen-box', when: (t) => t.includes('loneKing'), say: 'Use the box method: keep shrinking the king\'s box until it has no squares left.' },
  ],
  promotion: [
    { lesson: 's-passed-pawns', say: 'This is what passed pawns are for: escort them all the way and they become a queen.' },
  ],
  freePiece: [
    { lesson: 'b-loose-pieces', say: 'Loose pieces drop off. This one has no defender, so take it.' },
    { lesson: 'b-tactics-sprint', say: 'Scan for captures first. A free piece is the easiest win on the board.' },
  ],
  winMaterial: [
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
  skewer: [
    { lesson: 't-skewers', say: 'A skewer is a pin turned around: the valuable piece in front has to move, and the one behind it falls.' },
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
    { lesson: 's-passed-pawns', say: 'A passed pawn is a baby queen. Push it with support from your pieces and king.' },
  ],
  activeKing: [
    { lesson: 'i-key-squares', when: (t) => t.includes('pawnEndgame'), say: 'In pawn endings, march the king to the key squares in front of your pawn.' },
    { lesson: 'e-zugzwang', when: (t) => t.includes('pawnEndgame'), say: 'In pawn endings, make sure your opponent is the one who runs out of good moves.' },
    { lesson: 'e-big-rules', say: 'With few pieces left, the king is a fighter. Bring it toward the middle.' },
  ],
  openFile: [
    { lesson: 's-rooks', say: 'Roads for rooks: take the open file, then aim for the 7th rank.' },
  ],
  rookBehindPasser: [
    { lesson: 'e-rook-rules', say: 'Rule 1 of rook endings: rooks belong behind passed pawns — yours and your opponent\'s.' },
    { lesson: 's-rooks', say: 'Rooks need open roads. Behind a passed pawn, the road gets longer every time the pawn moves.' },
  ],
  cutOff: [
    { lesson: 'e-rook-rules', say: 'Cut the king off: a rook on a file between the king and the pawn works like a wall.' },
    { lesson: 'a-lucena', say: 'Like in the Lucena: first cut the enemy king off, then bring your own king and pawn forward.' },
  ],
  opposition: [
    { lesson: 'i-key-squares', say: 'Use the opposition: kings facing each other with one square between — whoever must move has to step aside.' },
    { lesson: 'e-zugzwang', say: 'The waiting game: put your opponent in a position where every move makes things worse.' },
  ],
  blockade: [
    { lesson: 's-passed-pawns', say: 'Stop a passed pawn with a blockade — put a piece right in front of it. Knights are the best blockaders.' },
    { lesson: 's-targets', say: 'The square in front of a weak pawn is a perfect home for your piece — no pawn can chase it away.' },
  ],
  outpost: [
    { lesson: 's-minor-pieces', say: 'Knights love support points: advanced squares protected by your pawn where enemy pawns can\'t chase them.' },
    { lesson: 'i-worst-piece', say: 'Fix your worst piece: find it a better home, like a safe advanced square for a knight.' },
  ],
};

/* Tags checked first: concrete tactics beat techniques, which beat opening principles. */
export const PRIORITY_TAGS = ['mate', 'fork', 'pin', 'skewer', 'desperado', 'freePiece', 'winMaterial', 'promotion', 'rookBehindPasser', 'cutOff', 'opposition', 'blockade', 'outpost'];
