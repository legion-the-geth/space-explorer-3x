import { SeededRandom } from '@game/generation/SeededRandom';
import { Planet, PlanetType } from '@game/Planet';

/**
 * Planet generator for star systems
 * Generates planets procedurally based on system seed
 */
export class PlanetGenerator {
  /**
   * Generate planets for a star system
   * Returns 0-8 planets with simple properties
   */
  public static generatePlanets(systemSeed: string): Planet[] {
    const rng = new SeededRandom(systemSeed + '_planets');
    const planets: Planet[] = [];

    // Random number of planets (0-8)
    const planetCount = Math.floor(rng.random() * 9);

    for (let i = 0; i < planetCount; i++) {
      const planet = this.generatePlanet(systemSeed, i, rng);
      planets.push(planet);
    }

    return planets;
  }

  private static generatePlanet(
    _systemSeed: string,
    index: number,
    rng: SeededRandom
  ): Planet {
    // Planet types distribution (simple for MVP)
    const typeRoll = rng.random();
    let type: PlanetType;

    if (typeRoll < 0.3) type = 'Rocky';
    else if (typeRoll < 0.5) type = 'Gas Giant';
    else if (typeRoll < 0.65) type = 'Ice';
    else if (typeRoll < 0.8) type = 'Desert';
    else if (typeRoll < 0.9) type = 'Ocean';
    else type = 'Lava';

    // Distance from star (AU) - increases with planet index
    const baseDistance = 0.3 + index * 0.8;
    const distanceVariation = rng.range(-0.2, 0.2);
    const distance = Math.max(0.1, baseDistance + distanceVariation);

    // Radius (Earth radii)
    let radius: number;
    if (type === 'Gas Giant') {
      radius = rng.range(4, 12); // Jupiter-like
    } else if (type === 'Ice') {
      radius = rng.range(0.5, 2);
    } else {
      radius = rng.range(0.4, 1.8); // Earth-like to super-Earth
    }

    // Mass (Earth masses) - correlates with radius
    const mass = Math.pow(radius, 2.5) * rng.range(0.8, 1.2);

    // Planet name (simple for MVP)
    const name = `Planet ${String.fromCharCode(65 + index)}`; // A, B, C, etc.

    return {
      name,
      type,
      distance: Math.round(distance * 100) / 100,
      radius: Math.round(radius * 100) / 100,
      mass: Math.round(mass * 100) / 100,
    };
  }
}
