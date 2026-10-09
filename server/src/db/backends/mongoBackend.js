import { MongoClient } from 'mongodb';

/*
 * Stores each record of the in-memory database as its own MongoDB document ({ _id, v }).
 * Lists are keyed by their `id`, maps by their object key. Each write only sends the
 * records that changed since the last successful write.
 */
const COLLECTIONS = {
  users: { list: true, order: 'createdAt' },
  games: { list: true, order: 'date' },
  sessions: { list: false },
  progress: { list: false },
  trainer: { list: false },
};

const entriesOf = (spec, value) => (spec.list
  ? (value || []).map((item) => [item.id, item])
  : Object.entries(value || {}));

export async function createMongoBackend(uri, dbName) {
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15000 });
  await client.connect();
  const mdb = client.db(dbName);
  const saved = Object.fromEntries(Object.keys(COLLECTIONS).map((name) => [name, new Map()]));

  return {
    name: `MongoDB (${dbName})`,

    async load() {
      const data = {};
      for (const [name, spec] of Object.entries(COLLECTIONS)) {
        const docs = await mdb.collection(name).find({}).toArray();
        for (const d of docs) saved[name].set(d._id, JSON.stringify(d.v));
        if (spec.list) {
          data[name] = docs.map((d) => d.v).sort((a, b) => (a[spec.order] || 0) - (b[spec.order] || 0));
        } else {
          data[name] = Object.fromEntries(docs.map((d) => [d._id, d.v]));
        }
      }
      return data;
    },

    async write(data) {
      for (const [name, spec] of Object.entries(COLLECTIONS)) {
        const prev = saved[name];
        const next = new Map();
        const ops = [];
        for (const [key, value] of entriesOf(spec, data[name])) {
          if (key == null) continue;
          const id = String(key);
          const json = JSON.stringify(value);
          next.set(id, json);
          if (prev.get(id) !== json) {
            ops.push({ replaceOne: { filter: { _id: id }, replacement: { v: JSON.parse(json) }, upsert: true } });
          }
        }
        for (const id of prev.keys()) if (!next.has(id)) ops.push({ deleteOne: { filter: { _id: id } } });
        if (ops.length) await mdb.collection(name).bulkWrite(ops, { ordered: false });
        saved[name] = next;
      }
    },

    async close() {
      await client.close();
    },
  };
}
