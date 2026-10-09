import fs from 'node:fs';
import path from 'node:path';

/* Keeps the whole database in one JSON file. Good for local development. */
export function createFileBackend(file) {
  return {
    name: `file (${file})`,
    async load() {
      try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
      } catch {
        return null;
      }
    },
    async write(data) {
      fs.mkdirSync(path.dirname(file), { recursive: true });
      const tmp = `${file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(data));
      fs.renameSync(tmp, file);
    },
    async close() {},
  };
}
