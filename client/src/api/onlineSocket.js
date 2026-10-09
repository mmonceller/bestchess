import { tokenStore } from './http.js';

/*
 * Single shared WebSocket for online play. Reconnects automatically and re-joins the
 * current game so a dropped connection or page refresh keeps your seat.
 */
const PLAYER_KEY = 'bc.playerKey';
const listeners = new Set();
let ws = null;
let currentCode = null;
let queue = [];
let retry = 0;
let status = 'idle';

function playerKey() {
  let key = sessionStorage.getItem(PLAYER_KEY);
  if (!key) {
    key = crypto.randomUUID?.() || Math.random().toString(36).slice(2) + Date.now().toString(36);
    sessionStorage.setItem(PLAYER_KEY, key);
  }
  return key;
}

const emit = (msg) => listeners.forEach((l) => l(msg));

function setStatus(s) {
  status = s;
  emit({ t: 'connection', status: s });
}

function identity(name) {
  return { token: tokenStore.get(), playerKey: playerKey(), name };
}

let guestName = 'Guest';

function connect() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
  const proto = location.protocol === 'https:' ? 'wss' : 'ws';
  ws = new WebSocket(`${proto}://${location.host}/ws`);
  setStatus('connecting');
  ws.onopen = () => {
    retry = 0;
    setStatus('open');
    if (currentCode) ws.send(JSON.stringify({ t: 'join', code: currentCode, ...identity(guestName) }));
    queue.forEach((m) => ws.send(JSON.stringify(m)));
    queue = [];
  };
  ws.onmessage = (e) => {
    let msg;
    try { msg = JSON.parse(e.data); } catch { return; }
    if (msg.t === 'created') currentCode = msg.code;
    emit(msg);
  };
  ws.onclose = () => {
    ws = null;
    setStatus('closed');
    if (currentCode || queue.length) {
      const delay = Math.min(8000, 500 * 2 ** retry++);
      setTimeout(connect, delay);
    }
  };
}

function send(msg) {
  if (ws && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify(msg));
  else {
    queue.push(msg);
    connect();
  }
}

export const online = {
  subscribe(fn) {
    listeners.add(fn);
    return () => listeners.delete(fn);
  },
  status: () => status,
  setName(name) { guestName = name || 'Guest'; },
  create(options) {
    currentCode = null;
    send({ t: 'create', options, ...identity(guestName) });
  },
  join(code) {
    currentCode = code.toUpperCase();
    send({ t: 'join', code: currentCode, ...identity(guestName) });
  },
  leave() {
    if (currentCode) send({ t: 'leave' });
    currentCode = null;
  },
  move: (uci) => send({ t: 'move', uci }),
  resign: () => send({ t: 'resign' }),
  offerDraw: () => send({ t: 'draw-offer' }),
  declineDraw: () => send({ t: 'draw-decline' }),
  rematch: () => send({ t: 'rematch' }),
  claim: () => send({ t: 'claim' }),
  chat: (text) => send({ t: 'chat', text }),
};
