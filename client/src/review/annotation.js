/*
 * Review grades written with the notation-guide marks and colours:
 * !  best or excellent (a good move)
 * !! a best move that sacrifices material (brilliant)
 * !? good — an interesting try, with something a little more precise available
 * ?! inaccuracy (doubtful)
 * ?  mistake
 * ?? blunder
 */
const MARK = {
  best: '!',
  excellent: '!',
  good: '!?',
  inaccuracy: '?!',
  mistake: '?',
  blunder: '??',
};

export function annotationFor(move) {
  if (!move || move.kind === 'forced') return '';
  if (move.kind === 'best' && move.tags?.includes('sacrifice')) return '!!';
  return MARK[move.kind] || '';
}
