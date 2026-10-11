import WebSocket from 'ws';
import { Chess } from 'chess.js';

/*
 * Dev helper: starts an online game between an account (white) and a signed-out friend, plays a
 * short opening, and leaves it on the account's move. The friend stays connected and answers each
 * move with a random legal one, which also keeps the in-memory room alive. Stop with Ctrl+C.
 * Usage: node scripts/dev/seedOnlineGuestGame.js [username] [password] [guestName]
 */
const BASE = process.env.BASE || 'http://localhost:3001';
const WS = BASE.replace('http', 'ws') + '/ws';
const [username = 'master1', password = 'chess123', guestName = 'Guest2009'] = process.argv.slice(2);
const OPENING = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6'];
const REPLY_MS = 1500;

async function login() {
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`login: ${data.error || res.status}`);
  return data.token;
}

function connect(identity) {
  const ws = new WebSocket(WS);
  const listeners = new Set();
  ws.on('message', (raw) => { const msg = JSON.parse(raw); listeners.forEach((l) => l(msg)); });
  return {
    ws,
    opened: new Promise((r) => ws.on('open', r)),
    send: (m) => ws.send(JSON.stringify({ ...m, ...identity })),
    on: (l) => listeners.add(l),
    once: (pred) => new Promise((resolve) => {
      const l = (m) => { if (pred(m)) { listeners.delete(l); resolve(m); } };
      listeners.add(l);
    }),
  };
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const token = await login();
const host = connect({ token, playerKey: `seed-host-${Date.now().toString(36)}` });
const guest = connect({ playerKey: `seed-guest-${Date.now().toString(36)}`, name: guestName });
await Promise.all([host.opened, guest.opened]);

host.send({ t: 'create', options: { minutes: 0, increment: 0, color: 'w', inviteMinutes: 60 } });
const { code } = await host.once((m) => m.t === 'created');
guest.send({ t: 'join', code });
await guest.once((m) => m.t === 'state' && m.state.status === 'playing');

for (const [i, uci] of OPENING.entries()) {
  (i % 2 ? guest : host).send({ t: 'move', uci });
  await wait(150);
}
host.ws.close();

let replying = false;
guest.on(async (m) => {
  if (m.t !== 'state' || m.state.status !== 'playing' || m.state.turn !== 'b' || replying) return;
  replying = true;
  await wait(REPLY_MS);
  const chess = new Chess(m.state.fen);
  const moves = chess.moves({ verbose: true });
  const mv = moves[Math.floor(Math.random() * moves.length)];
  if (mv) guest.send({ t: 'move', uci: mv.from + mv.to + (mv.promotion || '') });
  replying = false;
});
guest.on((m) => { if (m.t === 'state' && m.state.status === 'over') console.log('Game over:', m.state.result); });

console.log(`Game ${code}: ${username} (white, to move) vs ${guestName} (signed out). Keep this running; Ctrl+C to stop.`);
