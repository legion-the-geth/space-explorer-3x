/**
 * Universe generation constants
 */

// ========== SPATIAL SCALE ==========

/**
 * Scale: 1 unit = 0.1 light-year (AL)
 *
 * Examples:
 * - 10 units = 1 AL
 * - 100 units = 10 AL (average star distance)
 * - 3000 units = 300 AL (sector size)
 */
export const UNIT_TO_LIGHTYEAR = 0.1;

/**
 * Sector size in map units (= 300 AL)
 * A sector represents a stellar neighborhood
 */
export const SECTOR_SIZE = 3000;

/**
 * Star generation grid spacing (= 10 AL)
 * Stars are placed on a grid with this spacing, then jittered
 */
export const STAR_GRID_SPACING = 100;

/**
 * Maximum jitter offset for star positions (= 4 AL)
 * Stars can be offset by ±40 units from their grid position
 */
export const STAR_JITTER = 40;

/**
 * Minimum distance between stars (= 2 AL)
 * Used as safety check
 */
export const MIN_STAR_DISTANCE = 20;

/**
 * Probability that a star spawns in a given grid cell
 * 0.8 = 80% chance → average density of ~0.8 stars per 100x100 unit cell
 */
export const STAR_SPAWN_PROBABILITY = 0.8;

/**
 * Visibility radius around the player (= 50 AL)
 * Systems within this radius become VISIBLE (gray dots)
 */
export const VISIBILITY_RADIUS = 500;

// ========== STAR DISTRIBUTIONS ==========

/**
 * Star type distribution (MVP - smoothed for gameplay)
 *
 * Future evolution ideas:
 * - Sector-based modifiers (young sectors = more O/B, old sectors = more M/K)
 * - Exotic types (White Dwarfs, Red Giants, Neutron Stars, Black Holes)
 * - Binary/multiple star systems
 */
export const STAR_TYPE_DISTRIBUTION = {
  M: 45, // Red dwarfs (most common)
  K: 25, // Orange dwarfs (common)
  G: 15, // Yellow stars like Sol (familiar)
  F: 8, // Yellow-white stars
  A: 4, // White stars (rare)
  B: 2, // Blue-white stars (very rare)
  O: 1, // Blue giants (ultra rare, jackpot!)
} as const;

// ========== STAR PROPERTIES ==========

/**
 * Temperature ranges by spectral class (Kelvin)
 */
export const STAR_TEMPERATURE_RANGES = {
  O: { min: 30000, max: 50000 },
  B: { min: 10000, max: 30000 },
  A: { min: 7500, max: 10000 },
  F: { min: 6000, max: 7500 },
  G: { min: 5200, max: 6000 },
  K: { min: 3700, max: 5200 },
  M: { min: 2400, max: 3700 },
} as const;

/**
 * Mass ranges by spectral class (solar masses)
 */
export const STAR_MASS_RANGES = {
  O: { min: 16, max: 100 },
  B: { min: 2.1, max: 16 },
  A: { min: 1.4, max: 2.1 },
  F: { min: 1.04, max: 1.4 },
  G: { min: 0.8, max: 1.04 },
  K: { min: 0.45, max: 0.8 },
  M: { min: 0.08, max: 0.45 },
} as const;

/**
 * Color mapping by temperature (hex)
 */
export function temperatureToColor(temp: number): number {
  if (temp >= 30000) return 0x6b9fff; // Blue
  if (temp >= 10000) return 0xa8c3ff; // Blue-white
  if (temp >= 7500) return 0xffffff; // White
  if (temp >= 6000) return 0xfff4e6; // White-yellow
  if (temp >= 5200) return 0xffeb99; // Yellow
  if (temp >= 3700) return 0xffb366; // Orange
  return 0xff6b4a; // Red
}

/**
 * Display names by spectral class
 */
export const STAR_TYPE_NAMES = {
  O: 'Blue Giant',
  B: 'Blue-White Star',
  A: 'White Star',
  F: 'Yellow-White Star',
  G: 'Yellow Star',
  K: 'Orange Dwarf',
  M: 'Red Dwarf',
} as const;
