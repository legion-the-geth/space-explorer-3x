/**
 * Represents a star system with basic properties
 */
export interface StarSystem {
  id: string;
  name: string;
  position: { x: number; y: number };
  star: StarData;
}

export interface StarData {
  type: StarType;
  name: string;
  mass: number; // Solar masses
  radius: number; // Solar radii
  temperature: number; // Kelvin
  color: number; // Hex color
}

/**
 * Spectral classification of stars
 *
 * MVP: Main sequence stars (O, B, A, F, G, K, M)
 *
 * Future exotic types (commented out for now):
 * - WD: White Dwarf
 * - RG: Red Giant
 * - BH: Black Hole
 * - NS: Neutron Star
 * - BIN: Binary System
 * - EXOTIC: Alien/unknown star types (for creative freedom)
 */
export enum StarType {
  // Main sequence (MVP)
  O = 'O', // Blue giants
  B = 'B', // Blue-white
  A = 'A', // White
  F = 'F', // Yellow-white
  G = 'G', // Yellow (Sol-like)
  K = 'K', // Orange
  M = 'M', // Red dwarfs

  // Future exotic types (uncomment when implementing)
  // WD = 'WD',
  // RG = 'RG',
  // BH = 'BH',
  // NS = 'NS',
  // BIN = 'BIN',
  // EXOTIC = 'EXOTIC',
}

/**
 * Create a test star system (will be replaced by procedural generation)
 */
export function createTestStarSystem(id: string, x: number, y: number, color: number): StarSystem {
  // Map color to star type (temporary)
  const starTypes: Record<number, { type: StarType; temp: number; name: string }> = {
    0xff3b3b: { type: StarType.RedGiant, temp: 3500, name: 'Betelgeuse-like' },
    0xffeb3b: { type: StarType.MainSequence, temp: 5778, name: 'Sol-like' },
    0x3bffff: { type: StarType.BlueGiant, temp: 10000, name: 'Rigel-like' },
    0x3bff3b: { type: StarType.MainSequence, temp: 5500, name: 'Yellow Star' },
    0xff3bff: { type: StarType.WhiteDwarf, temp: 7500, name: 'Sirius B-like' },
    0xffa500: { type: StarType.MainSequence, temp: 5000, name: 'Orange Dwarf' },
    0x9370db: { type: StarType.RedDwarf, temp: 3000, name: 'Proxima-like' },
  };

  const starInfo = starTypes[color] ?? starTypes[0xffeb3b]!;

  return {
    id,
    name: `System ${id}`,
    position: { x, y },
    star: {
      type: starInfo.type,
      name: starInfo.name,
      mass: 1.0,
      radius: 1.0,
      temperature: starInfo.temp,
      color,
    },
  };
}
