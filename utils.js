import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

export function clamp(v, a, b) {
  return Math.min(Math.max(v, a), b);
}
export function repeat(n, f) {
  return Array(n).fill(0).map(f);
}

export function normalize(angle, start) {
  return ((angle - start) % 360) + start;
}

export function toLAB(color) {
  const { a, b } = d3.lab(color);
  return [a || 0, b || 0];
}

export function toLCh(color) {
  const { h, c } = d3.lch(color);
  return [normalize(h || 0, -210), c || 0];
}
