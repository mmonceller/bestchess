/*
 * Splits a SAN move ("Nbxd7+", "exd8=Q#", "O-O-O") into coloured parts:
 * piece, from (disambiguation), capture, square, promote, check, mate, castle, annotation.
 */
const CASTLE = /^(O-O-O|O-O|0-0-0|0-0)([+#])?([!?]{1,2})?$/;
const MOVE = /^([KQRBN])?([a-h])?([1-8])?(x)?([a-h][1-8])(=?[QRBN])?(?:e\.p\.)?([+#])?([!?]{1,2})?$/;

export function parseSan(raw) {
  const san = String(raw || '').trim();
  const castle = CASTLE.exec(san);
  if (castle) {
    const long = castle[1].length > 3;
    const parts = [{ kind: 'castle', text: castle[1].replace(/0/g, 'O') }];
    if (castle[2]) parts.push({ kind: castle[2] === '#' ? 'mate' : 'check', text: castle[2] });
    if (castle[3]) parts.push({ kind: 'annotation', text: castle[3] });
    return {
      castle: long ? 'queen' : 'king', piece: 'K', capture: false, to: null, promotion: null,
      check: castle[2] === '+', mate: castle[2] === '#', annotation: castle[3] || null, parts,
    };
  }
  const m = MOVE.exec(san);
  if (!m) return null;
  const [, piece, fromFile, fromRank, x, to, promo, check, annotation] = m;
  const parts = [];
  if (piece) parts.push({ kind: 'piece', text: piece });
  if (fromFile || fromRank) parts.push({ kind: 'from', text: `${fromFile || ''}${fromRank || ''}` });
  if (x) parts.push({ kind: 'capture', text: 'x' });
  parts.push({ kind: 'square', text: to });
  if (promo) parts.push({ kind: 'promote', text: promo });
  if (check) parts.push({ kind: check === '#' ? 'mate' : 'check', text: check });
  if (annotation) parts.push({ kind: 'annotation', text: annotation });
  return {
    castle: null,
    piece: piece || 'P',
    fromFile: fromFile || null,
    fromRank: fromRank || null,
    capture: Boolean(x),
    to,
    promotion: promo ? promo.replace('=', '') : null,
    check: check === '+',
    mate: check === '#',
    annotation: annotation || null,
    parts,
  };
}
