import { db, save } from '../../db/store.js';
import { skillFromRecords } from '../skill/skillRating.js';
import { gameNote } from './notes.js';
import { appendPointRow, changeAmount } from './write.js';

const OPENING_NOTE = 'Starting balance when point history began.';

/*
 * Once, on the database this server is using (the hosted database after deploy):
 * rewrite every account's skill points to the current formula.
 * The opening row is the rating when history began. Each later row is a game that
 * earned or lost skill points after that. A later startup leaves those rows alone.
 */
export function reviseSkillHistory() {
  if (!db.flags || typeof db.flags !== 'object' || Array.isArray(db.flags)) db.flags = {};
  if (db.flags.skillHistoryRevisedAt) return { revised: false, users: 0, rows: 0 };
  const openedAt = db.flags.pointLogOpenedAt || 0;
  if (!Array.isArray(db.pointLog)) db.pointLog = [];

  let users = 0;
  let rows = 0;
  for (const user of db.users) {
    users += 1;
    const games = db.games.filter((g) => g.userId === user.id).sort((a, b) => a.date - b.date);
    const opening = db.pointLog.find((row) => row.userId === user.id && row.kind === 'skill' && row.opening);
    const atOpen = skillFromRecords(games.filter((g) => g.date <= openedAt));
    if (opening) {
      opening.delta = atOpen ?? 0;
      opening.balance = atOpen;
      opening.note = atOpen == null ? `${OPENING_NOTE} None yet.` : OPENING_NOTE;
    }
    db.pointLog = db.pointLog.filter((row) => !(row.userId === user.id && row.kind === 'skill' && !row.opening));
    let before = opening ? atOpen : null;
    const start = opening ? openedAt : 0;
    for (const game of games) {
      if (game.date <= start) continue;
      const after = skillFromRecords(games.filter((g) => g.date <= game.date));
      const delta = changeAmount(before, after);
      if (delta == null || delta === 0) {
        before = after;
        continue;
      }
      appendPointRow({
        userId: user.id,
        kind: 'skill',
        delta,
        balance: after ?? null,
        note: gameNote('skill', { result: game.result, opponent: game.opponent, before, after, delta }),
        at: game.date,
      }, { trim: false });
      rows += 1;
      before = after;
    }
  }

  db.flags.skillHistoryRevisedAt = Date.now();
  save();
  return { revised: true, users, rows };
}
