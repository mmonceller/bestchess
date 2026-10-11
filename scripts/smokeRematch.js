import WebSocket from 'ws';

/*
 * End-to-end check of rematch after one player leaves the game page: Alice asks for a rematch,
 * Bob (a guest, socket closed) sees it in /online/active, rejoins and accepts; colors swap.
 */
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

function client(token, key, name) {
  const ws = new WebSocket(WS);
  const states = [];
  const waiters = [];
  ws.on('message', (raw) => {
    states.push(JSON.parse(raw));
    waiters.splice(0).forEach((w) => w());
  });
  const next = (pred, label = 'message') => new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout waiting for ${label}; last: ${JSON.stringify(states.at(-1))?.slice(0, 300)}`)), 4000);
    const check = () => {
      const m = [...states].reverse().find(pred);
      if (m) { clearTimeout(t); resolve(m); } else waiters.push(check);
    };
    check();
  });
  const opened = new Promise((r) => ws.on('open', r));
  return { ws, next, opened, send: (m) => ws.send(JSON.stringify({ ...m, token, playerKey: key, name })) };
}

const fail = (msg) => { console.log('REMATCH FAILED:', msg); process.exit(1); };
const stamp = Date.now().toString(36);
const a = await api('/auth/register', { username: `rm_${stamp}`, password: 'secret123' });
const bobKey = `kb_${stamp}`;

const A = client(a.token, `ka_${stamp}`);
let B = client(null, bobKey, 'Bob');
await Promise.all([A.opened, B.opened]);
A.send({ t: 'create', options: { minutes: 0, increment: 0, color: 'w' } });
const { code } = await A.next((m) => m.t === 'created', 'step 1');
B.send({ t: 'join', code });
await B.next((m) => m.t === 'state' && m.state.status === 'playing', 'step 2');
B.send({ t: 'resign' });
await A.next((m) => m.t === 'state' && m.state.status === 'over', 'step 3');

/* Bob goes to game review: his socket closes. */
B.ws.close();
await new Promise((r) => setTimeout(r, 200));
A.send({ t: 'rematch' });
await A.next((m) => m.t === 'state' && m.state.rematch?.w, 'step 4');

const bobView = await api('/online/active', { saved: [{ code, key: bobKey }] });
const invite = bobView.games.find((g) => g.code === code);
console.log('bob sees:', invite && { status: invite.status, rematch: invite.rematch, opponent: invite.opponent });
if (invite?.rematch !== 'incoming') fail('bob did not see the rematch invite');

const aliceView = await api('/online/active', { saved: [] }, a.token);
if (aliceView.games.find((g) => g.code === code)?.rematch !== 'sent') fail('alice should see sent');

B = client(null, bobKey, 'Bob');
await B.opened;
B.send({ t: 'join', code });
await B.next((m) => m.t === 'state', 'step 5');
B.send({ t: 'rematch' });
const fresh = await B.next((m) => m.t === 'state' && m.state.status === 'playing', 'step 6');
console.log('new game: bob is', fresh.state.you, '| white:', fresh.state.white?.name);
if (fresh.state.you !== 'w') fail('colors did not swap');
B.send({ t: 'move', uci: 'e2e4' });
const moved = await A.next((m) => m.t === 'state' && m.state.status === 'playing' && /e4/.test(m.state.pgn || ''), 'step 7');
if (!moved) fail('bob could not move as white');

A.ws.close();
B.ws.close();
console.log('REMATCH OK');
setTimeout(() => process.exit(0), 100);
