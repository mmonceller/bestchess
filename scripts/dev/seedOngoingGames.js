import WebSocket from 'ws';

/*
 * Dev helper: leaves master1 with unfinished games to resume — two bot matches (written for
 * this browser's localStorage) and an online game vs a signed-out friend.
 * Usage: node scripts/dev/seedOngoingGames.js [username] [password] [guestName]
 */
const BASE = process.env.BASE || 'http://localhost:3001';
const WS = BASE.replace('http', 'ws') + '/ws';
const [username = 'master1', password = 'chess123', guestName = 'Guest2009'] = process.argv.slice(2);
const OPENING = ['e2e4', 'e7e5', 'g1f3', 'b8c6', 'f1c4', 'g8f6'];

export function botGames(name = username, now = Date.now()) {
  return [
    {
      id: 'seed-rookie',
      color: 'w',
      level: 2,
      hints: [],
      movedAt: now,
      pgn: `[Event "BestChess vs Computer"]\n[White "${name}"]\n[Black "Rookie (Lv 2)"]\n[Result "*"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bc4 Nf6 *`,
    },
    {
      id: 'seed-casual',
      color: 'b',
      level: 3,
      hints: [],
      movedAt: now,
      pgn: `[Event "BestChess vs Computer"]\n[White "Casual (Lv 3)"]\n[Black "${name}"]\n[Result "*"]\n\n1. d4 Nf6 2. c4 e6 3. Nc3 Bb4 *`,
    },
  ];
}

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
    once: (pred) => new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error('timeout')), 8000);
      const l = (m) => { if (pred(m)) { clearTimeout(t); listeners.delete(l); resolve(m); } };
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

const games = botGames(username);
console.log(JSON.stringify({ code, guestName, username, games }, null, 2));
console.log(`Online ${code}: ${username} (white, to move) vs ${guestName}. Keep this running; Ctrl+C to stop.`);
