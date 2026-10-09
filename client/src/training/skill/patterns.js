import { TAG_LESSONS } from '../hints/lessonLinks.js';

/* Plain names for the ideas the engine recognises in moves (tags from explainMove). */
export const PATTERNS = {
  mate: { name: 'Finding checkmates', icon: 'crown' },
  fork: { name: 'Forks', icon: 'knight' },
  pin: { name: 'Pins', icon: 'bishop' },
  freePiece: { name: 'Taking free pieces', icon: 'target' },
  winMaterial: { name: 'Winning material', icon: 'gem' },
  sacrifice: { name: 'Sacrifices', icon: 'fire' },
  desperado: { name: 'Desperado grabs', icon: 'fire' },
  trade: { name: 'Trading when ahead', icon: 'draw' },
  promotion: { name: 'Promoting pawns', icon: 'queen' },
  passedPawn: { name: 'Pushing passed pawns', icon: 'pawn' },
  check: { name: 'Useful checks', icon: 'king' },
  attack: { name: 'Attacking with tempo', icon: 'swords' },
  rescue: { name: 'Saving attacked pieces', icon: 'warning' },
  protect: { name: 'Defending your pieces', icon: 'lock' },
  castle: { name: 'Castling on time', icon: 'rook' },
  center: { name: 'Controlling the center', icon: 'grid' },
  develop: { name: 'Developing pieces', icon: 'knight' },
  activeKing: { name: 'Using the king in endgames', icon: 'king' },
  openFile: { name: 'Rooks on open files', icon: 'rook' },
  space: { name: 'Gaining space', icon: 'map' },
  improve: { name: 'Improving your worst piece', icon: 'sparkle' },
  rookBehindPasser: { name: 'Rooks behind passed pawns', icon: 'rook' },
  cutOff: { name: 'Cutting off the king', icon: 'rook' },
  opposition: { name: 'Opposition', icon: 'king' },
  blockade: { name: 'Blockading pawns', icon: 'lock' },
  outpost: { name: 'Outposts for pieces', icon: 'knight' },
};

const MIN_APPLIED = 2;
const MAX_SHOWN = 6;

/*
 * Splits pattern stats ({ tag, applied, missed, games }) into ideas the player uses well
 * and ideas they keep missing. A strength is used at least twice and twice as often as it's
 * missed; anything missed about as often as it's used (or more) needs work.
 */
export function splitPatterns(list) {
  const known = list.filter((p) => PATTERNS[p.tag]);
  const strengths = known
    .filter((p) => p.applied >= MIN_APPLIED && p.applied >= p.missed * 2)
    .sort((a, b) => b.applied - a.applied || b.games - a.games)
    .slice(0, MAX_SHOWN);
  const workOn = known
    .filter((p) => p.missed > 0 && p.missed * 2 > p.applied)
    .sort((a, b) => b.missed - a.missed || a.applied - b.applied)
    .slice(0, MAX_SHOWN);
  return { strengths, workOn };
}

/* The lesson that teaches a pattern, if there is one. */
export const lessonForPattern = (tag) => TAG_LESSONS[tag]?.find((l) => !l.when)?.lesson || TAG_LESSONS[tag]?.[0]?.lesson || null;
