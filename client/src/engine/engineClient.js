/*
 * Promise wrapper around the engine Web Worker. A search can't be interrupted from outside,
 * so cancel() terminates the worker and the next call spawns a fresh one.
 */
let worker = null;
let nextId = 1;
const pending = new Map();

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker/engine.worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { id, result, error } = e.data;
    const p = pending.get(id);
    if (!p) return;
    pending.delete(id);
    if (error) p.reject(new Error(error));
    else p.resolve(result);
  };
  return worker;
}

function call(type, payload) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    pending.set(id, { resolve, reject });
    getWorker().postMessage({ id, type, payload });
  });
}

export const engine = {
  move: (fen, level, history = []) => call('move', { fen, level, history }),
  analyse: (fen, { timeMs = 1200, history = [] } = {}) => call('analyse', { fen, timeMs, history }),
  grade: (fen, uci, timeMs = 1200, preferred = null) => call('grade', { fen, uci, timeMs, preferred }),
  review: (fen, uci, timeMs = 900) => call('review', { fen, uci, timeMs }),
  evaluate: (fen, timeMs = 600) => call('evaluate', { fen, timeMs }),
  cancel() {
    if (!worker) return;
    worker.terminate();
    worker = null;
    for (const p of pending.values()) p.reject(new Error('cancelled'));
    pending.clear();
  },
};
