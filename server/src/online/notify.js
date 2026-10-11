let notify = () => {};

export const setRoomNotify = (fn) => { notify = fn; };
export const notifyRoom = (room) => { if (room) notify(room); };
