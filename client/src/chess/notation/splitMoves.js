const MOVE_SRC = String.raw`(?:O-O-O|O-O|[KQRBN][a-h]?[1-8]?x?[a-h][1-8](?:=?[QRBN])?|[a-h]x[a-h][1-8](?:=?[QRBN])?|[a-h][1-8](?:=?[QRBN])?)[+#]?`;
const TOKEN = new RegExp(String.raw`(\[\[)?(\d+\.(?:\.\.)?\s?)?(${MOVE_SRC})([!?]{1,2})?(\]\])?`, 'g');
const WORDY = /[A-Za-z0-9_\-]/;
const BARE_PAWN = /^[a-h][1-8]$/;

/*
 * Finds moves inside ordinary text. Always recognised: numbered moves ("12.Nf3", "30...Rxh2+"),
 * moves wrapped in [[ ]], and piece moves, captures, castling, promotions and checks.
 * Bare pawn pushes like "e4" only count in `loose` mode (text that is just a line of moves),
 * because in a sentence "e4" usually names a square.
 * `firstColor` names the side of the first move when the text doesn't number it.
 * Returns [{ type: 'text', text } | { type: 'move', san, prefix, color, number }].
 */
export function splitMoves(input, { loose = false, firstColor = null } = {}) {
  const text = String(input);
  const out = [];
  let last = 0;
  let prev = null;
  const pushText = (t) => { if (t) out.push({ type: 'text', text: t }); };
  for (const m of text.matchAll(TOKEN)) {
    const [whole, open, numbered, san, annotation = '', close] = m;
    const start = m.index;
    const end = start + whole.length;
    const before = text[start - 1];
    const after = text[end];
    if ((before && WORDY.test(before)) || (after && WORDY.test(after))) continue;
    const marked = Boolean(open && close);
    if (!marked && !numbered && !loose && BARE_PAWN.test(san)) continue;
    const keepNote = marked || numbered || loose;

    pushText(text.slice(last, start));
    const gap = prev ? text.slice(prev.end, start) : null;
    let color = null;
    let number = null;
    if (numbered) {
      number = Number.parseInt(numbered, 10);
      color = numbered.includes('...') ? 'b' : 'w';
    } else if (prev && prev.color && /^\s+$/.test(gap)) {
      color = prev.color === 'w' ? 'b' : 'w';
      number = prev.color === 'b' && prev.number ? prev.number + 1 : prev.number;
    } else if (!prev && firstColor) {
      color = firstColor;
    }
    out.push({ type: 'move', san: san + (keepNote ? annotation : ''), prefix: numbered ? numbered.trim() : '', color, number });
    if (!keepNote) pushText(annotation);
    prev = { end, color, number };
    last = end;
  }
  pushText(text.slice(last));
  return out;
}
