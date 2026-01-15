import { SeededRandom } from './SeededRandom';
import { StarGenerator } from './StarGenerator';
import { StarSystem } from '../StarSystem';
import {
  SECTOR_SIZE,
  STAR_GRID_SPACING,
  STAR_JITTER,
  STAR_SPAWN_PROBABILITY,
} from './constants';

/**
 * Main universe generator
 * Handles star system generation, naming, and positioning
 */
export class UniverseGenerator {
  private universeSeed: string;

  constructor(universeSeed: string) {
    this.universeSeed = universeSeed;
  }

  /**
   * Generate a star system at given coordinates
   * Returns null if no system should exist at this position
   */
  public generateSystemAt(x: number, y: number): StarSystem | null {
    const systemSeed = this.getSystemSeed(x, y);
    const rng = new SeededRandom(systemSeed);

    // Check if a system should spawn here (based on grid position)
    const gridX = Math.round(x / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const gridY = Math.round(y / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const gridSeed = this.getSystemSeed(gridX, gridY);
    const gridRng = new SeededRandom(gridSeed);

    if (gridRng.random() > STAR_SPAWN_PROBABILITY) {
      return null; // No system here
    }

    // Generate star
    const star = StarGenerator.generate(systemSeed);

    // Generate system ID and name
    const systemId = this.generateSystemId(x, y);
    const systemName = this.generateSystemName(x, y, star.type);

    return {
      id: systemId,
      name: systemName,
      position: { x, y },
      star,
    };
  }

  /**
   * Generate systems in a region (for rendering visible area)
   */
  public generateSystemsInRegion(
    minX: number,
    maxX: number,
    minY: number,
    maxY: number
  ): StarSystem[] {
    const systems: StarSystem[] = [];

    // Snap to grid
    const startX = Math.floor(minX / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const endX = Math.ceil(maxX / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const startY = Math.floor(minY / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const endY = Math.ceil(maxY / STAR_GRID_SPACING) * STAR_GRID_SPACING;

    // Generate systems on grid with jitter
    for (let gridX = startX; gridX <= endX; gridX += STAR_GRID_SPACING) {
      for (let gridY = startY; gridY <= endY; gridY += STAR_GRID_SPACING) {
        const systemSeed = this.getSystemSeed(gridX, gridY);
        const rng = new SeededRandom(systemSeed);

        // Check spawn probability
        if (rng.random() > STAR_SPAWN_PROBABILITY) {
          continue;
        }

        // Apply jitter to position
        const jitterX = rng.range(-STAR_JITTER, STAR_JITTER);
        const jitterY = rng.range(-STAR_JITTER, STAR_JITTER);
        const x = gridX + jitterX;
        const y = gridY + jitterY;

        // Generate system
        const system = this.generateSystemAt(x, y);
        if (system) {
          systems.push(system);
        }
      }
    }

    return systems;
  }

  /**
   * Generate spawn system at exact coordinates (no jitter, guaranteed spawn)
   * Used for player starting system at (0, 0)
   */
  public generateSpawnSystem(x: number, y: number): StarSystem {
    const systemSeed = this.getSystemSeed(x, y);

    // Generate star (no spawn probability check, always spawn)
    const star = StarGenerator.generate(systemSeed);

    // Generate system ID and name
    const systemId = this.generateSystemId(x, y);
    const systemName = this.generateSystemName(x, y, star.type);

    return {
      id: systemId,
      name: systemName,
      position: { x, y },
      star,
    };
  }

  /**
   * Generate systems within a circular radius (for fog of war)
   */
  public generateSystemsInRadius(
    centerX: number,
    centerY: number,
    radius: number
  ): StarSystem[] {
    const systems: StarSystem[] = [];

    // Snap to grid (bounding box)
    const startX = Math.floor((centerX - radius) / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const endX = Math.ceil((centerX + radius) / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const startY = Math.floor((centerY - radius) / STAR_GRID_SPACING) * STAR_GRID_SPACING;
    const endY = Math.ceil((centerY + radius) / STAR_GRID_SPACING) * STAR_GRID_SPACING;

    const radiusSquared = radius * radius;

    // Generate systems on grid with jitter
    for (let gridX = startX; gridX <= endX; gridX += STAR_GRID_SPACING) {
      for (let gridY = startY; gridY <= endY; gridY += STAR_GRID_SPACING) {
        const systemSeed = this.getSystemSeed(gridX, gridY);
        const rng = new SeededRandom(systemSeed);

        // Check spawn probability
        if (rng.random() > STAR_SPAWN_PROBABILITY) {
          continue;
        }

        // Apply jitter to position
        const jitterX = rng.range(-STAR_JITTER, STAR_JITTER);
        const jitterY = rng.range(-STAR_JITTER, STAR_JITTER);
        const x = gridX + jitterX;
        const y = gridY + jitterY;

        // Check if system is within radius
        const dx = x - centerX;
        const dy = y - centerY;
        const distanceSquared = dx * dx + dy * dy;

        if (distanceSquared > radiusSquared) {
          continue; // Outside radius
        }

        // Generate system
        const system = this.generateSystemAt(x, y);
        if (system) {
          systems.push(system);
        }
      }
    }

    return systems;
  }

  /**
   * Get sector ID from coordinates
   * Format: A0, B5, AA12, etc.
   */
  private getSectorId(x: number, y: number): string {
    const sectorX = Math.floor(x / SECTOR_SIZE);
    const sectorY = Math.floor(y / SECTOR_SIZE);

    // Convert to base-26 (A-Z, then AA-AZ, BA-BZ, etc.)
    const xLabel = this.toBase26(Math.abs(sectorX));
    const yLabel = Math.abs(sectorY).toString();

    // Add sign prefix for negative sectors
    const xPrefix = sectorX < 0 ? '-' : '';
    const yPrefix = sectorY < 0 ? '-' : '';

    return `${xPrefix}${xLabel}${yPrefix}${yLabel}`;
  }

  /**
   * Convert number to base-26 (A=0, B=1, ..., Z=25, AA=26, AB=27, ...)
   */
  private toBase26(num: number): string {
    let result = '';
    let n = num;

    do {
      result = String.fromCharCode(65 + (n % 26)) + result;
      n = Math.floor(n / 26);
    } while (n > 0);

    return result;
  }

  /**
   * Generate system ID (internal, unique identifier)
   */
  private generateSystemId(x: number, y: number): string {
    // Simple hash of coordinates
    return `sys_${Math.floor(x)}_${Math.floor(y)}`;
  }

  /**
   * Generate system name (player-visible)
   * Format: SEC-A7-M142
   */
  private generateSystemName(x: number, y: number, starType: string): string {
    const sector = this.getSectorId(x, y);

    // Local ID within sector (deterministic based on position)
    const localX = Math.floor(x) % SECTOR_SIZE;
    const localY = Math.floor(y) % SECTOR_SIZE;
    const localHash = Math.abs(localX * 1000 + localY);
    const localId = localHash % 1000;
    const localIdPadded = localId.toString().padStart(3, '0');

    return `SEC-${sector}-${starType}${localIdPadded}`;
  }

  /**
   * Generate deterministic seed for a system based on its coordinates
   */
  private getSystemSeed(x: number, y: number): string {
    // Round to avoid floating point issues
    const roundedX = Math.round(x * 100) / 100;
    const roundedY = Math.round(y * 100) / 100;
    return `${this.universeSeed}_${roundedX}_${roundedY}`;
  }

  /**
   * Future evolution ideas:
   *
   * - generateSectorModifiers(sectorId: string): SectorModifiers
   *   Apply density/type modifiers per sector
   *   Example: "young sector" = more O/B stars, "core sector" = higher density
   *
   * - generateStellarClusters(seed: string): Cluster[]
   *   Create open clusters, globular clusters
   *
   * - generateVoids(seed: string): Void[]
   *   Create low-density regions
   *
   * - generateSpiralArms(seed: string): SpiralArm[]
   *   For a more realistic galactic structure
   *
   * - generateAnomalies(seed: string): Anomaly[]
   *   Special locations (nebulae, black holes, alien artifacts, etc.)
   */
}
