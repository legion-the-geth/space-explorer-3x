/**
 * Planet types
 */
export type PlanetType = 'Rocky' | 'Gas Giant' | 'Ice' | 'Desert' | 'Ocean' | 'Lava';

/**
 * Planet interface
 */
export interface Planet {
  name: string;
  type: PlanetType;
  distance: number; // Distance from star (AU)
  radius: number; // Radius in Earth radii
  mass: number; // Mass in Earth masses
}
