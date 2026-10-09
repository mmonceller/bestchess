import { chooseMove, analyse, gradeMove, evaluatePosition } from '../analysis/api.js';

const handlers = {
  move: ({ fen, level, history }) => chooseMove(fen, level, history),
  analyse: ({ fen, timeMs, history }) => analyse(fen, { timeMs, history }),
  grade: ({ fen, uci, timeMs }) => gradeMove(fen, uci, { timeMs }),
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
