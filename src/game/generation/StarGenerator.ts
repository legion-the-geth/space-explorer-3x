import { SeededRandom } from '@game/generation/SeededRandom';
import { StarData, StarType } from '@game/StarSystem';
import {
  STAR_MASS_RANGES,
  STAR_TEMPERATURE_RANGES,
  STAR_TYPE_DISTRIBUTION,
  STAR_TYPE_NAMES,
  temperatureToColor,
} from '@game/generation/constants';

/**
 * Generates stars with realistic astronomical properties
 */
export class StarGenerator {
  /**
   * Generate a star based on seed
   */
  public static generate(seed: string): StarData {
    const rng = new SeededRandom(seed);

    // Choose spectral class based on distribution
    const spectralClass = rng.weightedChoice(STAR_TYPE_DISTRIBUTION) as StarType;

    // Generate properties based on class
    const temperature = rng.range(
      STAR_TEMPERATURE_RANGES[spectralClass].min,
      STAR_TEMPERATURE_RANGES[spectralClass].max
    );

    const mass = rng.range(
      STAR_MASS_RANGES[spectralClass].min,
      STAR_MASS_RANGES[spectralClass].max
    );

    // Radius derived from mass (rough approximation: R ~ M^0.8)
    const radius = Math.pow(mass, 0.8);

    const color = temperatureToColor(temperature);
    const typeName = STAR_TYPE_NAMES[spectralClass];

    return {
      type: spectralClass,
      name: typeName,
      mass: parseFloat(mass.toFixed(2)),
      radius: parseFloat(radius.toFixed(2)),
      temperature: Math.round(temperature),
      color,
    };
  }

  /**
   * Future evolution ideas (to implement later):
   *
   * - generateBinarySystem(seed: string): BinaryStarData
   *   Generate binary/multiple star systems (10-20% of systems)
   *
   * - generateExoticStar(seed: string, type: ExoticType): ExoticStarData
   *   Types: White Dwarf, Red Giant, Neutron Star, Black Hole
   *
   * - applyAgeModifiers(star: StarData, age: number): StarData
   *   Modify properties based on star age (young vs old)
   *
   * - generateWithMetallicity(seed: string, metallicity: number): StarData
   *   Metallicity affects planet formation probability
   *
   * - generateVariableStar(seed: string): VariableStarData
   *   Pulsating stars, eclipsing binaries, etc.
   */
}
