/*
 * Quiz options are written with the correct answer first, so they're shuffled for display.
 * The order is seeded by the question, so a quiz always looks the same in the lesson and in
 * its review. Returns indices into `step.options`; saved picks keep using those indices.
 */
function hash(text) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function random(seed) {
  let s = seed || 1;
  return () => {
    s ^= s << 13; s ^= s >>> 17; s ^= s << 5;
    return (s >>> 0) / 4294967296;
  };
}

export function optionOrder(step) {
  const order = step.options.map((_, i) => i);
  const next = random(hash(`${step.question}|${step.options.map((o) => o.text).join('|')}`));
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

export const optionLetter = (position) => String.fromCharCode(65 + position);
