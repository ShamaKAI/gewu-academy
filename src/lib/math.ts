export const rand = (min: number, max: number): number =>
  Math.random() * (max - min) + min;

export const lerp = (a: number, b: number, t: number): number =>
  a + (b - a) * t;

export const clamp = (v: number, min: number, max: number): number =>
  Math.max(min, Math.min(max, v));
