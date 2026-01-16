import { Container, Graphics } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';

/**
 * Visual representation of a star system in the detail view
 */
export class SystemVisualizer extends Container {
  private starGraphic: Graphics;
  private glowGraphic: Graphics;

  constructor(system: StarSystem) {
    super();

    const starSize = 80;

    // Glow effect
    this.glowGraphic = new Graphics();
    this.glowGraphic.circle(0, 0, starSize * 1.3);
    this.glowGraphic.fill({ color: system.star.color, alpha: 0.3 });
    this.addChild(this.glowGraphic);

    // Star body
    this.starGraphic = new Graphics();
    this.starGraphic.circle(0, 0, starSize);
    this.starGraphic.fill({ color: system.star.color });
    this.addChild(this.starGraphic);
  }
}
