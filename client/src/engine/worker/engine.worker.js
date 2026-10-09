import { chooseMove, analyse, gradeMove, reviewMove, evaluatePosition } from '../analysis/api.js';

const handlers = {
  move: ({ fen, level, history }) => chooseMove(fen, level, history),
  analyse: ({ fen, timeMs, history }) => analyse(fen, { timeMs, history }),
  grade: ({ fen, uci, timeMs }) => gradeMove(fen, uci, { timeMs }),
  review: ({ fen, uci, timeMs }) => reviewMove(fen, uci, { timeMs }),
  evaluate: ({ fen, timeMs }) => evaluatePosition(fen, { timeMs }),
};

self.onmessage = (e) => {
  const { id, type, payload } = e.data;
  try {
    const result = handlers[type](payload);
    self.postMessage({ id, result });
  } catch (err) {
    self.postMessage({ id, error: String(err?.message || err) });
  }
};
