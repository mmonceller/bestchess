/*
 * Plain-English definitions for chess words. Lesson text is scanned for these
 * terms and each one becomes tappable, so beginners always have a context clue.
 * An entry may carry a test that spots the word's everyday (non-chess) meaning.
 */

/* "Check the method", "double-check", "checking your move" mean verifying, not attacking a king. */
const CHECK_OBJECT = /^\s+(?:the|these|this|that|those|your|my|our|their|his|her|which|what|whether|if|for|again|out|each|every|it|them|how|where|who|once|before|first\s*\?)\b/i;
const CHECK_KING = /^\s+the\s+(?:\w+\s+)?king\b/i;
function everydayCheck(before, after) {
  if (/(?:double|re|cross)-$|\b(?:blunder|safety|quick|simple|without|of)\s+$/i.test(before)) return true;
  if (/^\s*\?/.test(after)) return true;
  return CHECK_OBJECT.test(after) && !CHECK_KING.test(after);
}

const ENTRIES = [
  ['checkmate', ['checkmate', 'checkmates', 'checkmated', 'checkmating', 'mate in one', 'mate in two'], 'The king is attacked and has no way to escape. The game is over — whoever gives checkmate wins.'],
  ['stalemate', ['stalemate'], 'The player to move has no legal move, but their king is NOT under attack. The game ends in a draw — nobody wins.'],
  ['check', ['check', 'checks', 'checking'], 'The king is being attacked. The player must get the king out of danger on their very next move.', everydayCheck],
  ['fork', ['fork', 'forks', 'forked', 'forking'], 'One piece attacks two (or more) enemy pieces at the same time. Usually only one of them can be saved.'],
  ['pin', ['pin', 'pins', 'pinned', 'pinning'], 'A piece that can\'t move (or shouldn\'t), because a more valuable piece is standing right behind it.'],
  ['skewer', ['skewer', 'skewers', 'skewered'], 'The reverse of a pin: a valuable piece is attacked, and when it steps aside, the piece behind it gets captured.'],
  ['discovered attack', ['discovered attack', 'discovered check', 'discovery', 'discoveries'], 'You move one piece out of the way and the piece behind it suddenly attacks. Two threats in one move!'],
  ['develop', ['develop', 'develops', 'developing', 'development', 'developed', 'undeveloped'], 'Moving your knights and bishops off their starting squares so they can join the game.'],
  ['center', ['center', 'centre', 'central'], 'The four middle squares: d4, e4, d5 and e5. Pieces in the center can reach more of the board.'],
  ['castling', ['castle', 'castles', 'castling', 'castled', 'O-O', 'O-O-O'], 'A special move: the king steps two squares toward a rook, and that rook hops to the king\'s other side. It tucks the king away safely.'],
  ['rank', ['rank', 'ranks', 'row', 'rows'], 'A row of squares going across the board, numbered 1 to 8 (rank 1 is on White\'s side).'],
  ['file', ['file', 'files', 'column', 'columns'], 'A column of squares going up and down the board, lettered a to h.'],
  ['diagonal', ['diagonal', 'diagonals', 'diagonally'], 'A slanted line of squares, all the same color — the path a bishop travels.'],
  ['promotion', ['promotion', 'promote', 'promotes', 'promoted', 'promoting'], 'When a pawn reaches the far side of the board, it turns into a queen, rook, bishop or knight (almost always a queen).'],
  ['en passant', ['en passant'], 'A special pawn capture. If an enemy pawn jumps two squares and lands right beside your pawn, you may capture it as if it had moved one square — but only on your very next move.'],
  ['tempo', ['tempo', 'tempi'], 'One move\'s worth of time. Losing a tempo means your opponent effectively gets an extra move.'],
  ['threat', ['threat', 'threats', 'threaten', 'threatens', 'threatening'], 'Something your opponent wants to do on their next move — like capture a piece or give checkmate.'],
  ['blunder', ['blunder', 'blunders', 'blundered'], 'A big mistake that loses a piece, or even the whole game.'],
  ['tactic', ['tactic', 'tactics', 'tactical'], 'A short, forcing trick (like a fork or a pin) that wins something.'],
  ['material', ['material'], 'Your pieces and pawns, counted by value: pawn 1, knight 3, bishop 3, rook 5, queen 9.'],
  ['trade', ['trade', 'trades', 'trading', 'exchange', 'exchanges', 'swap'], 'You capture a piece and your opponent captures one of yours back, usually of similar value.'],
  ['sacrifice', ['sacrifice', 'sacrifices', 'sac'], 'Giving away material on purpose to get something better, like a winning attack.'],
  ['loose piece', ['loose', 'hanging', 'unguarded', 'undefended', 'unprotected'], 'A piece that no friendly piece protects. If it\'s attacked, it can be captured for free.'],
  ['defender', ['defender', 'defenders', 'protector', 'guards', 'guarded'], 'A piece that protects another piece: if the protected piece is captured, the defender can capture back.'],
  ['back rank', ['back rank', 'back-rank'], 'The row nearest a player (rank 1 for White, rank 8 for Black). A king stuck there behind its own pawns can be checkmated by a rook or queen.'],
  ['open file', ['open file', 'open files'], 'A column with no pawns on it — a highway for rooks and queens.'],
  ['passed pawn', ['passed pawn', 'passed pawns'], 'A pawn with no enemy pawns in front of it or beside it. Only pieces can stop it from promoting.'],
  ['opposition', ['opposition'], 'Kings facing each other with exactly one square between them. Whoever has to move must step aside.'],
  ['key square', ['key square', 'key squares'], 'A square that guarantees your pawn will promote once your king stands on it.'],
  ['opening', ['opening', 'openings'], 'The first stage of the game (roughly the first 10 moves), when both sides bring out their pieces.'],
  ['middlegame', ['middlegame'], 'The middle stage of the game, after the pieces are out and before most of them are traded.'],
  ['endgame', ['endgame', 'endgames', 'endings'], 'The last stage of the game, when only a few pieces are left on the board.'],
  ['engine', ['engine'], 'A chess computer program. It looks at millions of positions to find the best move.'],
  ['notation', ['notation'], 'The short code used to write down moves, like Nf3 (a knight moves to f3).'],
  ['desperado', ['desperado'], 'A piece that is lost anyway, so it grabs as much as it can before it\'s captured.'],
  ['zwischenzug', ['zwischenzug'], 'German for "in-between move": instead of the expected recapture, you first play an even stronger forcing move.'],
  ['prophylaxis', ['prophylaxis'], 'Stopping your opponent\'s plan before they get to carry it out.'],
  ['pawn chain', ['pawn chain', 'chain'], 'Pawns lined up diagonally, each one protecting the next.'],
  ['tension', ['tension'], 'When pieces or pawns can capture each other, but nobody has done it yet.'],
  ['smothered mate', ['smothered mate', 'smothered'], 'A checkmate by a knight when the king is boxed in by its own pieces.'],
  ['minor piece', ['minor piece', 'minor pieces'], 'A knight or a bishop (each worth about 3 pawns).'],
  ['Lucena', ['Lucena'], 'A famous winning setup in rook endings: you use your rook as a "bridge" to shield your king from checks.'],
  ['Philidor', ['Philidor'], 'A famous way to hold a draw in rook endings: keep your rook on your 6th row so the enemy king can\'t come forward.'],
  ['draw', ['draw', 'drawn', 'drawing'], 'A game that ends with no winner, like stalemate or both sides agreeing.'],
  ['capture', ['capture', 'captures', 'captured', 'capturing'], 'Taking an enemy piece by moving onto its square. The captured piece leaves the board.'],
];

export const GLOSSARY = Object.fromEntries(ENTRIES.map(([term, , def]) => [term, def]));

const variantToTerm = new Map();
for (const [term, variants] of ENTRIES) for (const v of variants) variantToTerm.set(v.toLowerCase(), term);
const everydaySense = new Map(ENTRIES.filter((e) => e[3]).map(([term, , , test]) => [term, test]));

const escape = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const PATTERN = new RegExp(
  `(?<![\\w-])(${[...variantToTerm.keys()].sort((a, b) => b.length - a.length).map(escape).join('|')})(?![\\w-])`,
  'gi',
);

/* Splits text into plain and glossary segments; only the first mention of each term is linked. */
export function splitGlossary(text) {
  const out = [];
  const seen = new Set();
  let last = 0;
  for (const m of text.matchAll(PATTERN)) {
    const term = variantToTerm.get(m[0].toLowerCase());
    if (seen.has(term)) continue;
    const end = m.index + m[0].length;
    if (everydaySense.get(term)?.(text.slice(Math.max(0, m.index - 20), m.index), text.slice(end, end + 30))) continue;
    seen.add(term);
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    out.push({ text: m[0], term });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}
