/* Tiny synthesized sounds (no audio files to download). */
let ctx = null;
let enabled = true;

export function setSoundEnabled(v) { enabled = v; }

function tone(freq, duration, type = 'sine', gain = 0.08) {
  if (!enabled) return;
  try {
    ctx ||= new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    g.gain.setValueAtTime(gain, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch {
    /* audio unavailable */
  }
}

export const sounds = {
  move: () => tone(420, 0.08, 'triangle'),
  capture: () => { tone(260, 0.1, 'square', 0.05); tone(180, 0.12, 'triangle'); },
  check: () => tone(740, 0.15, 'sawtooth', 0.04),
  good: () => { tone(660, 0.1); setTimeout(() => tone(880, 0.14), 90); },
  bad: () => tone(160, 0.22, 'sawtooth', 0.05),
  end: () => { tone(523, 0.12); setTimeout(() => tone(659, 0.12), 110); setTimeout(() => tone(784, 0.2), 220); },
};

export function playMoveSound(move) {
  if (!move) return;
  if (move.san?.includes('+') || move.san?.includes('#')) sounds.check();
  else if (move.captured) sounds.capture();
  else sounds.move();
}
