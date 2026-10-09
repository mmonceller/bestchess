import { parentPort, workerData } from 'node:worker_threads';
import { checkLine } from './checkLine.js';

for (const job of workerData.jobs) {
  let result;
  try {
    result = checkLine(job.fen, job.moves, { timeMs: workerData.timeMs });
  } catch (e) {
    result = { ok: false, reason: e.message };
  }
  parentPort.postMessage({ number: job.number, ...result });
}
