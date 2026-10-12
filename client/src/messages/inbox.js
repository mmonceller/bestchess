/* The pinned goals card stands in for the "Today's goals" note, so that note is not a second row. */
export const GOALS_NOTE = "Today's goals";

export function listMessages(messages = []) {
  return messages.filter((message) => message.title !== GOALS_NOTE);
}

/* Same rows the inbox lists under the pinned goals: notes plus unfinished games. */
export function inboxItems(messages = [], pending = []) {
  return [
    ...pending.map((game) => ({ id: game.id, read: Boolean(game.read), at: game.at || 0 })),
    ...listMessages(messages).map((message) => ({ id: message.id, read: Boolean(message.read), at: message.at || 0 })),
  ];
}

export const inboxUnread = (messages, pending) => inboxItems(messages, pending).filter((item) => !item.read).length;
