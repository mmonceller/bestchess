/*
 * The trade lesson has two sides: swap pieces when ahead, keep them when behind.
 * Coaching uses this so a trade is judged by that lesson, not by a different idea
 * hiding in the engine's alternative move.
 */
export function tradeLesson(explanation, { loss = 0 } = {}) {
  const tags = explanation?.tags || [];
  if (!tags.includes('trade')) return null;
  if (tags.includes('ahead')) {
    const bad = loss > 300 || tags.includes('tradeBad');
    return { tags: bad ? ['trade', 'ahead', 'tradeBad'] : ['trade', 'ahead'], bad, behind: false };
  }
  if (tags.includes('materialDown')) return { tags: ['trade', 'materialDown'], bad: true, behind: true };
  return null;
}
