/* Two independent 32-bit Zobrist keys: one indexes the table, the other verifies the hit. */
let seed = 0x9e3779b9;
function rand32() {
  seed ^= seed << 13;
  seed ^= seed >>> 17;
  seed ^= seed << 5;
  return seed | 0;
}

function table(n) {
  const a = new Int32Array(n);
  for (let i = 0; i < n; i++) a[i] = rand32();
  return a;
}

export const Z1 = { piece: table(16 * 128), castle: table(16), ep: table(128), side: rand32() };
export const Z2 = { piece: table(16 * 128), castle: table(16), ep: table(128), side: rand32() };
