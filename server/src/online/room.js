import { Chess } from 'chess.js';

const TIME_CONTROLS = new Set([0, 1, 3, 5, 10, 15, 30]);
const other = (c) => (c === 'w' ? 'b' : 'w');

export function normalizeOptions(o = {}) {
  const minutes = TIME_CONTROLS.has(Number(o.minutes)) ? Number(o.minutes) : 10;
  const increment = Math.max(0, Math.min(30, Number(o.increment) || 0));
  const color = ['w', 'b', 'random'].includes(o.color) ? o.color : 'random';
  return { minutes, increment, color, allowHints: Boolean(o.allowHints) };
}

/* One online game identified by a join code. Holds authoritative game state and clocks. */
export class Room {
  constructor(code, options) {
    this.code = code;
    this.options = normalizeOptions(options);
    this.seats = { w: null, b: null };
    this.spectators = new Set();
    this.chat = [];
    this.lastActivity = Date.now();
    this.onFinish = null;
    this.resetGame();
  }

  resetGame() {
    this.chess = new Chess();
    this.status = 'waiting';
    this.result = null;
    this.drawOffer = null;
    this.rematch = { w: false, b: false };
    this.lastMove = null;
    this.recorded = false;
    this.recordIds = { w: null, b: null };
    const ms = this.options.minutes * 60_000;
    this.clocks = { w: ms, b: ms };
    this.turnStartedAt = null;
    if (this.seats.w && this.seats.b) this.start();
  }

  hasClock() {
    return this.options.minutes > 0;
  }

  /*
   * Seats a player, honouring reconnects by playerKey. A player who closed their tab can
   * reclaim an empty seat with the key it was held by (`resumeKey`) or with their account.
   * Returns the assigned color or 'spectator'.
   */
  seat(player) {
    const refresh = (c) => {
      Object.assign(this.seats[c], { playerKey: player.playerKey, name: player.name, userId: player.userId ?? this.seats[c].userId, rating: player.rating ?? this.seats[c].rating });
      return c;
    };
    const held = ['w', 'b'].find((c) => this.seats[c]?.playerKey === player.playerKey);
    if (held) return refresh(held);
    const reclaim = ['w', 'b'].find((c) => {
      const s = this.seats[c];
      return s && !s.sockets.size
        && ((player.resumeKey && s.playerKey === player.resumeKey) || (player.userId && s.userId === player.userId));
    });
    if (reclaim) return refresh(reclaim);
    const free = ['w', 'b'].filter((c) => !this.seats[c]);
    if (!free.length) return 'spectator';
    let color = free[0];
    if (free.length === 2) {
      const pref = this.options.color;
      color = pref === 'random' ? (Math.random() < 0.5 ? 'w' : 'b') : pref;
    }
    this.seats[color] = { ...player, sockets: new Set() };
    if (this.seats.w && this.seats.b && this.status === 'waiting') this.start();
    return color;
  }

  start() {
    this.status = 'playing';
    this.turnStartedAt = Date.now();
    this.chess.setHeader('Event', 'BestChess online');
    this.chess.setHeader('White', this.seats.w.name);
    this.chess.setHeader('Black', this.seats.b.name);
  }

  /* Clock value for `color` right now, including time elapsed in the current turn. */
  liveClock(color) {
    if (!this.hasClock()) return null;
    let t = this.clocks[color];
    if (this.status === 'playing' && this.chess.turn() === color && this.chess.history().length >= 2) {
      t -= Date.now() - this.turnStartedAt;
    }
    return Math.max(0, t);
  }

  move(color, uci) {
    if (this.status !== 'playing') throw new Error('The game is not in progress.');
    if (this.chess.turn() !== color) throw new Error('Not your turn.');
    const moveObj = { from: uci.slice(0, 2), to: uci.slice(2, 4), promotion: uci[4] || 'q' };
    let move;
    try { move = this.chess.move(moveObj); } catch { throw new Error('Illegal move.'); }

    const now = Date.now();
    /* Clocks start after each side has made its first move. */
    if (this.hasClock() && this.chess.history().length > 2) {
      this.clocks[color] = Math.max(0, this.clocks[color] - (now - this.turnStartedAt)) + this.options.increment * 1000;
    }
    this.turnStartedAt = now;
    this.lastMove = { from: move.from, to: move.to };
    this.drawOffer = null;
    this.lastActivity = now;

    if (this.chess.isCheckmate()) this.finish(color, 'checkmate');
    else if (this.chess.isStalemate()) this.finish(null, 'stalemate');
    else if (this.chess.isInsufficientMaterial()) this.finish(null, 'insufficient material');
    else if (this.chess.isThreefoldRepetition()) this.finish(null, 'repetition');
    else if (this.chess.isDrawByFiftyMoves()) this.finish(null, '50-move rule');
    return move;
  }

  checkFlag() {
    if (this.status !== 'playing' || !this.hasClock()) return false;
    const c = this.chess.turn();
    if (this.liveClock(c) > 0) return false;
    this.clocks[c] = 0;
    this.finish(other(c), 'timeout');
    return true;
  }

  resign(color) {
    if (this.status !== 'playing') return;
    this.finish(other(color), 'resignation');
  }

  offerDraw(color) {
    if (this.status !== 'playing') return;
    if (this.drawOffer === other(color)) this.finish(null, 'agreement');
    else this.drawOffer = color;
  }

  declineDraw(color) {
    if (this.drawOffer === other(color)) this.drawOffer = null;
  }

  requestRematch(color) {
    if (this.status !== 'over') return;
    this.rematch[color] = true;
    if (this.rematch.w && this.rematch.b) {
      const { w, b } = this.seats;
      this.seats = { w: b, b: w };
      this.resetGame();
    }
  }

  finish(winner, reason) {
    if (this.hasClock()) {
      const c = this.chess.turn();
      this.clocks[c] = this.liveClock(c);
    }
    this.status = 'over';
    this.result = { winner, reason };
    this.chess.setHeader('Result', winner === 'w' ? '1-0' : winner === 'b' ? '0-1' : '1/2-1/2');
    this.drawOffer = null;
    if (this.onFinish) this.onFinish(this);
  }

  addChat(color, text) {
    const seat = this.seats[color];
    const clean = String(text || '').trim().slice(0, 200);
    if (!seat || !clean) return null;
    const msg = { from: seat.name, color, text: clean, at: Date.now() };
    this.chat.push(msg);
    if (this.chat.length > 50) this.chat.shift();
    return msg;
  }

  stateFor(you) {
    const seatInfo = (c) => {
      const s = this.seats[c];
      return s ? { name: s.name, rating: s.rating ?? null, connected: s.sockets.size > 0, registered: Boolean(s.userId) } : null;
    };
    return {
      code: this.code,
      you,
      options: this.options,
      status: this.status,
      result: this.result,
      fen: this.chess.fen(),
      pgn: this.chess.pgn(),
      history: this.chess.history(),
      turn: this.chess.turn(),
      lastMove: this.lastMove,
      white: seatInfo('w'),
      black: seatInfo('b'),
      clocks: this.hasClock() ? { w: this.liveClock('w'), b: this.liveClock('b') } : null,
      clockRunning: this.status === 'playing' && this.hasClock() && this.chess.history().length >= 2,
      drawOffer: this.drawOffer,
      rematch: this.rematch,
      chat: this.chat.slice(-30),
      gameId: this.recordIds[you] || null,
    };
  }
}
