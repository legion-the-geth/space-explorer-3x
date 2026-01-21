import { Container, Graphics } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { Planet } from '@game/Planet';
import { PLANET_TYPE_COLORS, PLANET_TYPE_SIZES } from '@game/generation/constants';

export interface SystemVisualizerProps {
  system: StarSystem;
  onPlanetClick?: (planet: Planet) => void;
  onBackgroundClick?: () => void;
}

/**
 * Visual representation of a star system in the detail view
 * Displays star, orbits, and planets
 */
export class SystemVisualizer extends Container {
  private orbitsContainer: Container;
  private planetsContainer: Container;
  private starGraphic!: Graphics;
  private glowGraphic!: Graphics;

  // Visual configuration
  private readonly STAR_RADIUS = 50;
  private readonly ORBIT_START_RADIUS = 90;
  private readonly ORBIT_GAP = 55;

  constructor({ system, onPlanetClick, onBackgroundClick }: SystemVisualizerProps) {
    super();

    // 1. Background interaction layer (catch clicks to deselect)
    const backgroundHit = new Graphics();
    backgroundHit.rect(-1000, -1000, 2000, 2000); // Large hit area
    backgroundHit.fill({ color: 0x000000, alpha: 0.001 }); // transparent but interactive
    backgroundHit.eventMode = 'static';
    backgroundHit.cursor = 'default';
    backgroundHit.on('pointerdown', () => onBackgroundClick?.());
    this.addChild(backgroundHit);

    // 2. Initialize containers
    this.orbitsContainer = new Container();
    this.planetsContainer = new Container();

    // Add layers in order
    this.addChild(this.orbitsContainer);
    // Star will be added directly to this
    this.addChild(this.planetsContainer);

    // 3. Render
    this.renderStar(system, onBackgroundClick);

    if (system.planets && system.planets.length > 0) {
      this.renderPlanets(system.planets, onPlanetClick);
    }
  }

  private renderStar(system: StarSystem, onStarClick?: () => void): void {
    const color = system.star.color;

    // Glow
    this.glowGraphic = new Graphics();
    this.glowGraphic.circle(0, 0, this.STAR_RADIUS * 1.4); // Smaller glow to avoid overlap with first orbit (90)
    this.glowGraphic.fill({ color, alpha: 0.3 }); // Slightly more visible but smaller
    this.addChild(this.glowGraphic);

    // Star Body
    this.starGraphic = new Graphics();
    this.starGraphic.circle(0, 0, this.STAR_RADIUS);
    this.starGraphic.fill({ color });

    // Star is interactive (behaves like background click/reset)
    this.starGraphic.eventMode = 'static';
    this.starGraphic.cursor = 'pointer';
    this.starGraphic.on('pointerdown', (e) => {
      e.stopPropagation();
      onStarClick?.();
    });

    this.addChild(this.starGraphic);
  }

  private renderPlanets(planets: Planet[], onPlanetClick?: (planet: Planet) => void): void {
    planets.forEach((planet, index) => {
      // Calculate visual position
      // We use a linear progression for visibility, not physical distance
      const orbitRadius = this.ORBIT_START_RADIUS + (index * this.ORBIT_GAP);

      // Draw Orbit Path
      const orbit = new Graphics();
      orbit.circle(0, 0, orbitRadius);
      orbit.stroke({ width: 1, color: 0xFFFFFF, alpha: 0.1 });
      this.orbitsContainer.addChild(orbit);

      // Planet visual properties
      const color = PLANET_TYPE_COLORS[planet.type] || 0xAAAAAA;
      const size = PLANET_TYPE_SIZES[planet.type] || 8;

      // Fixed pseudo-random angle based on name so it doesn't move on refresh
      // (Simple hash from string)
      const angleHash = planet.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const angle = (angleHash % 360) * (Math.PI / 180);

      const x = Math.cos(angle) * orbitRadius;
      const y = Math.sin(angle) * orbitRadius;

      // Draw Planet
      const planetGraphic = new Graphics();
      planetGraphic.circle(0, 0, size);
      planetGraphic.fill({ color });
      planetGraphic.position.set(x, y);

      // Interaction
      planetGraphic.eventMode = 'static';
      planetGraphic.cursor = 'pointer';

      // Hover effects
      planetGraphic.on('pointerenter', () => {
        planetGraphic.scale.set(1.4);
        planetGraphic.alpha = 1;
      });
      planetGraphic.on('pointerleave', () => {
        planetGraphic.scale.set(1.0);
      });

      // Click
      planetGraphic.on('pointerdown', (e) => {
        e.stopPropagation(); // Stop bubbling to background
        onPlanetClick?.(planet);
      });

      this.planetsContainer.addChild(planetGraphic);
    });
  }
}
