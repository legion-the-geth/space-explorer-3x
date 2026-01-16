import seedrandom from 'seedrandom';

/**
 * Seeded random number generator wrapper
 * Ensures deterministic generation based on seed
 */
export class SeededRandom {
  private rng: seedrandom.PRNG;

  constructor(seed: string) {
    this.rng = seedrandom(seed);
  }

  /**
   * Random float between 0 (inclusive) and 1 (exclusive)
   */
  public random(): number {
    return this.rng();
  }

  /**
   * Random integer between min (inclusive) and max (inclusive)
   */
  public randomInt(min: number, max: number): number {
    return Math.floor(this.random() * (max - min + 1)) + min;
  }

  /**
   * Random float between min (inclusive) and max (exclusive)
   */
  public range(min: number, max: number): number {
    return this.random() * (max - min) + min;
  }

  /**
   * Weighted random choice
   * @param weights Object with keys and their probability weights
   * @returns Selected key based on weighted probability
   */
  public weightedChoice<T extends string>(weights: Record<T, number>): T {
    const total = Object.values(weights).reduce((sum: number, w) => sum + (w as number), 0);
    let random = this.random() * (total as number);

    for (const [key, weight] of Object.entries(weights)) {
      random -= weight as number;
      if (random <= 0) {
        return key as T;
      }
    }

    // Fallback (should never happen)
    return Object.keys(weights)[0] as T;
  }

  /**
   * Gaussian (normal) distribution
   * Uses Box-Muller transform
   */
  public gaussian(mean: number = 0, stdDev: number = 1): number {
    const u1 = this.random();
    const u2 = this.random();
    const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}
