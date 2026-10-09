import WebSocket from 'ws';

/* End-to-end check: two accounts, create/join by code, play Fool's mate, verify records + ratings. */
const BASE = process.env.BASE || 'http://localhost:3001';
const WS = BASE.replace('http', 'ws') + '/ws';

async function api(path, body, token) {
  const res = await fetch(BASE + '/api' + path, {
    method: body ? 'POST' : 'GET',
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

function client(token, key) {
  const ws = new WebSocket(WS);
  const states = [];
  const waiters = [];
  ws.on('message', (raw) => {
    const msg = JSON.parse(raw);
    states.push(msg);
    waiters.splice(0).forEach((w) => w());
  });
  const next = (pred) => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error('timeout')), 4000);
    const check = () => {
      const m = states.find(pred);
      if (m) { clearTimeout(t); resolve(m); } else waiters.push(check);
    };
    check();
  });
  const opened = new Promise((r) => ws.on('open', r));
  return { ws, next, opened, send: (m) => ws.send(JSON.stringify({ ...m, token, playerKey: key })), states };
}

const stamp = Date.now().toString(36);
const a = await api('/auth/register', { username: `alice_${stamp}`, password: 'secret123' });
const b = await api('/auth/register', { username: `bob_${stamp}`, password: 'secret123' });
console.log('registered', a.user.username, b.user.username);

const A = client(a.token, 'ka');
const B = client(b.token, 'kb');
await Promise.all([A.opened, B.opened]);
A.send({ t: 'create', options: { minutes: 5, increment: 0, color: 'w' } });
const { code } = await A.next((m) => m.t === 'created');
console.log('room code', code);
B.send({ t: 'join', code });
await B.next((m) => m.t === 'state' && m.state.status === 'playing');

for (const [who, uci] of [[A, 'f2f3'], [B, 'e7e5'], [A, 'g2g4'], [B, 'd8h4']]) {
  who.send({ t: 'move', uci });
  await new Promise((r) => setTimeout(r, 80));
}
const end = await A.next((m) => m.t === 'state' && m.state.status === 'over');
console.log('result', end.state.result, 'pgn:', end.state.pgn.split('\n').pop());

await new Promise((r) => setTimeout(r, 400));
const ga = await api('/games', null, a.token);
const gb = await api('/games', null, b.token);
const ma = await api('/auth/me', null, a.token);
const mb = await api('/auth/me', null, b.token);
console.log('alice games', ga.games.map((g) => `${g.result}/${g.reason}/${g.ratingChange}`), 'rating', ma.user.rating);
console.log('bob games', gb.games.map((g) => `${g.result}/${g.reason}/${g.ratingChange}`), 'rating', mb.user.rating);

const bad = await api('/progress/merge', { progress: { 'b-forks': { stars: 3 } } }, a.token);
console.log('progress', bad.progress);
A.ws.close();
B.ws.close();
const ok = end.state.result.winner === 'b' && ga.games[0]?.result === 'loss' && gb.games[0]?.result === 'win' && mb.user.rating > 1200;
console.log(ok ? 'SMOKE OK' : 'SMOKE FAILED');
process.exit(ok ? 0 : 1);
