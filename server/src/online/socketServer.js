import { WebSocketServer } from 'ws';
import { createRoom, getRoom, allRooms, sweepRooms } from './roomRegistry.js';
import { userFromToken } from '../auth/sessions.js';

const ABANDON_MS = 60_000;
const UCI = /^[a-h][1-8][a-h][1-8][qrbn]?$/;

function send(ws, msg) {
  if (ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
}

function broadcast(room) {
  for (const c of ['w', 'b']) {
    const seat = room.seats[c];
    if (!seat) continue;
    const state = { ...room.stateFor(c), canClaim: canClaim(room, c) };
    for (const ws of seat.sockets) send(ws, { t: 'state', state });
  }
  const specState = room.stateFor('spectator');
  for (const ws of room.spectators) send(ws, { t: 'state', state: specState });
}

function canClaim(room, color) {
  if (room.status !== 'playing') return false;
  const opp = room.seats[color === 'w' ? 'b' : 'w'];
  return Boolean(opp && opp.sockets.size === 0 && opp.disconnectedAt && Date.now() - opp.disconnectedAt > ABANDON_MS);
}

function identify(msg) {
  const user = userFromToken(msg.token);
  const name = user ? user.username : String(msg.name || 'Guest').trim().slice(0, 20) || 'Guest';
  return {
    playerKey: String(msg.playerKey || '').slice(0, 64) || Math.random().toString(36).slice(2),
    resumeKey: String(msg.resumeKey || '').slice(0, 64) || null,
    name,
    userId: user?.id ?? null,
    rating: user?.rating ?? null,
  };
}

function attach(ws, room, msg) {
  detach(ws);
  const player = identify(msg);
  const color = room.seat(player);
  ws.room = room;
  ws.color = color;
  if (color === 'spectator') room.spectators.add(ws);
  else {
    room.seats[color].sockets.add(ws);
    room.seats[color].disconnectedAt = null;
  }
  room.lastActivity = Date.now();
  broadcast(room);
}

function detach(ws) {
  const room = ws.room;
  if (!room) return;
  if (ws.color === 'spectator') room.spectators.delete(ws);
  else {
    const seat = room.seats[ws.color];
    seat?.sockets.delete(ws);
    if (seat && seat.sockets.size === 0) seat.disconnectedAt = Date.now();
  }
  ws.room = null;
  broadcast(room);
}

const actions = {
  create(ws, msg) {
    const room = createRoom(msg.options);
    send(ws, { t: 'created', code: room.code });
    attach(ws, room, msg);
  },
  join(ws, msg) {
    const room = getRoom(msg.code);
    if (!room) return send(ws, { t: 'error', code: 'not-found', message: 'No game with that code. Check the code and try again.' });
    attach(ws, room, msg);
  },
  move(ws, msg, room) {
    if (!UCI.test(msg.uci || '')) throw new Error('Bad move format.');
    room.move(ws.color, msg.uci);
  },
  resign: (ws, msg, room) => room.resign(ws.color),
  'draw-offer': (ws, msg, room) => room.offerDraw(ws.color),
  'draw-decline': (ws, msg, room) => room.declineDraw(ws.color),
  rematch: (ws, msg, room) => room.requestRematch(ws.color),
  claim(ws, msg, room) {
    if (canClaim(room, ws.color)) room.finish(ws.color, 'abandonment');
  },
  chat(ws, msg, room) {
    room.addChat(ws.color, msg.text);
  },
  leave: (ws) => detach(ws),
};

export function attachSocketServer(server) {
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws) => {
    ws.isAlive = true;
    ws.on('pong', () => { ws.isAlive = true; });
    ws.on('message', (raw) => {
      let msg;
      try { msg = JSON.parse(raw); } catch { return; }
      const handler = actions[msg.t];
      if (!handler) return;
      const needsSeat = !['create', 'join', 'leave'].includes(msg.t);
      const room = ws.room;
      if (needsSeat && (!room || ws.color === 'spectator')) return send(ws, { t: 'error', message: 'You are not seated in a game.' });
      try {
        handler(ws, msg, room);
        if (needsSeat) broadcast(room);
      } catch (e) {
        send(ws, { t: 'error', message: e.message });
        if (room) send(ws, { t: 'state', state: { ...room.stateFor(ws.color), canClaim: canClaim(room, ws.color) } });
      }
    });
    ws.on('close', () => detach(ws));
  });

  const tick = setInterval(() => {
    for (const room of allRooms()) {
      if (room.checkFlag()) broadcast(room);
    }
  }, 500);

  const heartbeat = setInterval(() => {
    for (const ws of wss.clients) {
      if (!ws.isAlive) { ws.terminate(); continue; }
      ws.isAlive = false;
      ws.ping();
    }
    sweepRooms();
    for (const room of allRooms()) {
      if (['w', 'b'].some((c) => canClaim(room, c))) broadcast(room);
    }
  }, 15_000);

  wss.on('close', () => { clearInterval(tick); clearInterval(heartbeat); });
  return wss;
}
