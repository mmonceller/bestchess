import { parentPort, workerData } from 'node:worker_threads';
import { checkPuzzle } from './checkPuzzle.js';

for (const candidate of workerData.candidates) {
  const { errors } = checkPuzzle(candidate, { timeMs: workerData.timeMs });
  parentPort.postMessage({ id: candidate.id, ok: !errors.length, errors });
}
