const PIECES = { K: 'king', Q: 'queen', R: 'rook', B: 'bishop', N: 'knight' };

/* Spells out a move in plain words, e.g. "Nf3" -> "the knight moves to f3". */
export function describeSan(san) {
  if (!san) return '';
  const mate = san.includes('#');
  const check = !mate && san.includes('+');
  const clean = san.replace(/[+#!?]/g, '');
  let text;
  if (clean === 'O-O') text = 'castle on the king side';
  else if (clean === 'O-O-O') text = 'castle on the queen side';
  else {
    const m = clean.match(/^([KQRBN])?([a-h]?[1-8]?)(x)?([a-h][1-8])(?:=([QRBN]))?$/);
    if (!m) return '';
    const [, letter, from, capture, to, promo] = m;
    const who = letter ? `the ${PIECES[letter]}` : `the pawn${from ? ` on the ${from}-file` : ''}`;
    text = `${who} ${capture ? 'captures on' : 'moves to'} ${to}`;
    if (promo) text += ` and becomes a ${PIECES[promo]}`;
  }
  if (mate) text += ', with checkmate';
  else if (check) text += ', giving check';
  return text;
}
