import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const VISIBLE_MIN = 380;
const VISIBLE_MAX = 700;

let interpolator = d3.interpolateRgb;

export function setInterpolator(value) {
  interpolator = value;
}

export const interpolate = (ColorStops) => (lambdaMax) => {
  let prev = null;
  let next = null;
  for (const cur of ColorStops) {
    if (cur.peak <= lambdaMax && (!prev || cur.peak > prev.peak)) {
      prev = cur;
    }
    if (cur.peak >= lambdaMax && (!next || cur.peak < next.peak)) {
      next = cur;
    }
  }

  const color1 = d3.color(prev?.name ?? "#eeeeee");
  const color2 = d3.color(next?.name ?? "#eeeeee");

  const lambda1 = prev?.peak ?? VISIBLE_MIN;
  const lambda2 = next?.peak ?? VISIBLE_MAX;

  const t = Math.min(
    1,
    Math.max(0, (lambdaMax - lambda1) / (lambda2 - lambda1))
  );

  return d3.color(interpolator(color1, color2)(t));
};
