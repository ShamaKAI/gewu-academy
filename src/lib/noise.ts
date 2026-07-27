export class Noise {
  private seed: number;
  private perm: Uint8Array;

  constructor(seed?: number) {
    this.seed = seed ?? Math.random() * 10000;
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this.perm[i] = i;

    let s = this.seed;
    for (let i = 255; i > 0; i--) {
      s = (s * 16807 + 0) % 2147483647;
      const j = s % (i + 1);
      [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
    }
    for (let i = 0; i < 256; i++) this.perm[i + 256] = this.perm[i];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(a: number, b: number, t: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 3;
    const u = h < 2 ? x : y;
    const v = h < 2 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x: number, y: number): number {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    const u = this.fade(xf);
    const v = this.fade(yf);
    const p = this.perm;
    const a = p[p[X] + Y];
    const b = p[p[X + 1] + Y];
    const c = p[p[X] + Y + 1];
    const d = p[p[X + 1] + Y + 1];
    return this.lerp(
      this.lerp(this.grad(a, xf, yf), this.grad(b, xf - 1, yf), u),
      this.lerp(this.grad(c, xf, yf - 1), this.grad(d, xf - 1, yf - 1), u),
      v
    );
  }

  fbm(x: number, y: number, octaves: number = 4): number {
    let val = 0, amp = 1, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      val += this.noise2D(x * freq, y * freq) * amp;
      max += amp;
      amp *= 0.5;
      freq *= 2;
    }
    return val / max;
  }
}
