/*
 * Quiz options are written with the correct answer first, so they're shuffled for display.
 * Lesson quizzes use an order seeded by the question, so they look the same every time;
 * bonus quizzes reshuffle on every try. Orders are indices into `step.options`, and saved
 * picks keep using those indices whatever order was shown.
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

const quizKey = (step) => `${step.question}|${step.options.map((o) => o.text).join('|')}`;

function shuffle(length, next) {
  const order = Array.from({ length }, (_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(next() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return order;
}

const isOrderFor = (step, order) => Array.isArray(order) && order.length === step.options.length
  && [...order].sort((a, b) => a - b).every((v, i) => v === i);

/* The seeded order, or `saved` when it's a valid order for this quiz (the layout the player actually saw). */
export function optionOrder(step, saved = null) {
  if (isOrderFor(step, saved)) return saved;
  return shuffle(step.options.length, random(hash(quizKey(step))));
}

const lastShown = new Map();

/* A fresh random order for a new try (bonus rounds), never the same as the one shown last time. */
export function freshOptionOrder(step) {
  const previous = (lastShown.get(quizKey(step)) || optionOrder(step)).join();
  let order = shuffle(step.options.length, Math.random);
  for (let i = 0; i < 10 && step.options.length > 1 && order.join() === previous; i++) {
    order = shuffle(step.options.length, Math.random);
  }
  return order;
}

/* Call once an order is on screen, so the next try avoids it. */
export function rememberOptionOrder(step, order) {
  lastShown.set(quizKey(step), order);
}

export const optionLetter = (position) => String.fromCharCode(65 + position);
