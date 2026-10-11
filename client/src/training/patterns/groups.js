import { PATTERNS, PATTERN_IDS } from './patterns.js';

/* Focus chips and the mastery list fold these into one row. Puzzles still store the specific id. */
export const GROUPS = {
  checkmate: {
    name: 'Checkmate Patterns',
    icon: 'crown',
    color: '#ff5d73',
    clue: 'A known mating picture. Which pieces trap the king?',
    lesson: 'Named mates are pictures. Once you have seen the shape, you will spot it over the board.',
  },
};

export const groupOf = (id) => PATTERNS[id]?.group || null;
export const groupInfo = (id) => GROUPS[id] || null;
export const isGroup = (id) => Boolean(GROUPS[id]);

export const membersOf = (groupId) => PATTERN_IDS.filter((id) => PATTERNS[id].group === groupId);

export const groupUnlock = (groupId) => {
  const members = membersOf(groupId);
  return members.length ? Math.min(...members.map((id) => PATTERNS[id].unlock)) : 0;
};

/* Chip / mastery rows in trainer order: a group appears once, in place of its first member. */
export function focusCatalog() {
  const out = [];
  const seen = new Set();
  for (const id of PATTERN_IDS) {
    const group = PATTERNS[id].group;
    if (group) {
      if (seen.has(group)) continue;
      seen.add(group);
      out.push({ id: group, kind: 'group', unlock: groupUnlock(group), ...GROUPS[group] });
    } else {
      out.push({ id, kind: 'pattern', unlock: PATTERNS[id].unlock, ...PATTERNS[id] });
    }
  }
  return out;
}

export const focusInfo = (id) => GROUPS[id] || PATTERNS[id];

export const patternsInFocus = (focus) => {
  if (!focus) return null;
  if (GROUPS[focus]) return membersOf(focus);
  return [focus];
};

export const mateName = (patternId) => (PATTERNS[patternId]?.group === 'checkmate' ? PATTERNS[patternId].name : null);

const emptyStats = () => ({ seen: 0, solved: 0 });

/* Totals for a chip / mastery row. A group adds every member's stored seen/solved. */
export function focusStats(patterns, focusId) {
  const store = patterns || {};
  if (!GROUPS[focusId]) return store[focusId] || emptyStats();
  return membersOf(focusId).reduce((acc, id) => {
    const s = store[id] || emptyStats();
    acc.seen += s.seen || 0;
    acc.solved += s.solved || 0;
    return acc;
  }, emptyStats());
}

/* Member rows that already have attempts — older mate1 / back-rank / named-mate scores. */
export function recordedMembers(patterns, groupId) {
  return membersOf(groupId)
    .map((id) => {
      const s = patterns?.[id] || emptyStats();
      return { id, name: PATTERNS[id].name, seen: s.seen || 0, solved: s.solved || 0 };
    })
    .filter((s) => s.seen > 0)
    .sort((a, b) => b.seen - a.seen || a.name.localeCompare(b.name));
}
