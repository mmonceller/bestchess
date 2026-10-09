/*
 * Promise wrapper around the engine Web Worker. A search can't be interrupted from outside,
 * so cancel() terminates the worker and the next call spawns a fresh one. A worker that
 * crashes, fails to load or stops answering is replaced the same way, so callers never hang.
 */
let worker = null;
let nextId = 1;
const pending = new Map();

const timeoutFor = (timeMs = 3500) => Math.max(20000, timeMs * 6);

function settle(id, fn) {
  const p = pending.get(id);
  if (!p) return;
  pending.delete(id);
  clearTimeout(p.timer);
  fn(p);
}

function reset(reason) {
  if (worker) worker.terminate();
  worker = null;
  for (const id of [...pending.keys()]) settle(id, (p) => p.reject(new Error(reason)));
}

function getWorker() {
  if (worker) return worker;
  worker = new Worker(new URL('./worker/engine.worker.js', import.meta.url), { type: 'module' });
  worker.onmessage = (e) => {
    const { id, result, error } = e.data;
    settle(id, (p) => (error ? p.reject(new Error(error)) : p.resolve(result)));
  };
  worker.onerror = (e) => {
    e.preventDefault?.();
    reset('engine crashed');
  };
  worker.onmessageerror = () => reset('engine crashed');
  return worker;
}

function call(type, payload) {
  return new Promise((resolve, reject) => {
    const id = nextId++;
    const timer = setTimeout(() => reset('engine timed out'), timeoutFor(payload.timeMs));
    pending.set(id, { resolve, reject, timer });
    try {
      getWorker().postMessage({ id, type, payload });
    } catch (err) {
      settle(id, (p) => p.reject(err));
    }
  });
}

export const engine = {
  move: (fen, level, history = []) => call('move', { fen, level, history }),
  analyse: (fen, { timeMs = 1200, history = [] } = {}) => call('analyse', { fen, timeMs, history }),
  grade: (fen, uci, timeMs = 1200, preferred = null) => call('grade', { fen, uci, timeMs, preferred }),
  review: (fen, uci, timeMs = 900) => call('review', { fen, uci, timeMs }),
  evaluate: (fen, timeMs = 600) => call('evaluate', { fen, timeMs }),
  cancel() {
    reset('cancelled');
  },
};
