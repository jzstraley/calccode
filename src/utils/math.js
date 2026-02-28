export function num(x) {
  const n = typeof x === "number" ? x : parseFloat(String(x ?? "").trim());
  return Number.isFinite(n) ? n : NaN;
}

export function clampNum(n, lo, hi) {
  if (!Number.isFinite(n)) return NaN;
  return Math.max(lo, Math.min(hi, n));
}

export function round(n, digits = 0) {
  if (!Number.isFinite(n)) return NaN;
  const p = Math.pow(10, digits);
  return Math.round(n * p) / p;
}