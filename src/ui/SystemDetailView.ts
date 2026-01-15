import { Container, Graphics, Text } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';

export interface SystemDetailViewConfig {
  screenWidth: number;
  screenHeight: number;
  onBackToGalaxy: () => void;
}

/**
 * Detailed view of a star system
 * Shows the star and its information panel
 */
export class SystemDetailView {
  private container: Container;
  private screenWidth: number;
  private screenHeight: number;
  private onBackToGalaxy: () => void;

  private starGraphic?: Graphics;
  private infoPanel?: Container;
  private currentSystem?: StarSystem;

  constructor(config: SystemDetailViewConfig) {
    this.container = new Container();
    this.screenWidth = config.screenWidth;
    this.screenHeight = config.screenHeight;
    this.onBackToGalaxy = config.onBackToGalaxy;
  }

  /**
   * Display a star system
   */
  public showSystem(system: StarSystem): void {
    this.currentSystem = system;
    this.clear();
    this.renderStar();
    this.renderInfoPanel();
    this.renderBackButton();
  }

  private clear(): void {
    this.container.removeChildren();
    this.starGraphic = undefined;
    this.infoPanel = undefined;
  }

  private renderStar(): void {
    if (!this.currentSystem) return;

    // Draw the star in the center
    const star = new Graphics();
    const starSize = 80; // Large star in detail view
    star.circle(0, 0, starSize);
    star.fill({ color: this.currentSystem.star.color });

    // Add glow effect
    const glow = new Graphics();
    glow.circle(0, 0, starSize * 1.3);
    glow.fill({ color: this.currentSystem.star.color, alpha: 0.3 });

    const starContainer = new Container();
    starContainer.addChild(glow);
    starContainer.addChild(star);
    starContainer.position.set(this.screenWidth / 2 - 200, this.screenHeight / 2);

    this.container.addChild(starContainer);
    this.starGraphic = star;
  }

  private renderInfoPanel(): void {
    if (!this.currentSystem) return;

    const panel = new Container();

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 350, 400);
    bg.fill({ color: 0x1a1a1a, alpha: 0.9 });
    bg.stroke({ width: 2, color: 0x444444 });
    panel.addChild(bg);

    // Title
    const title = new Text({
      text: this.currentSystem.name,
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: 24,
        fill: 0xffffff,
        fontWeight: 'bold',
      },
    });
    title.position.set(20, 20);
    panel.addChild(title);

    // Separator
    const separator = new Graphics();
    separator.rect(20, 60, 310, 1);
    separator.fill({ color: 0x444444 });
    panel.addChild(separator);

    // Star info
    const star = this.currentSystem.star;
    const infoLines = [
      { label: 'Star Type', value: star.type },
      { label: 'Name', value: star.name },
      { label: 'Temperature', value: `${star.temperature} K` },
      { label: 'Mass', value: `${star.mass.toFixed(2)} M☉` },
      { label: 'Radius', value: `${star.radius.toFixed(2)} R☉` },
      { label: 'Position', value: `(${this.currentSystem.position.x}, ${this.currentSystem.position.y})` },
    ];

    let yOffset = 80;
    infoLines.forEach((line) => {
      const label = new Text({
        text: `${line.label}:`,
        style: {
          fontFamily: 'Courier New, monospace',
          fontSize: 14,
          fill: 0xaaaaaa,
        },
      });
      label.position.set(30, yOffset);
      panel.addChild(label);

      const value = new Text({
        text: line.value,
        style: {
          fontFamily: 'Courier New, monospace',
          fontSize: 14,
          fill: 0xffffff,
        },
      });
      value.position.set(30, yOffset + 20);
      panel.addChild(value);

      yOffset += 55;
    });

    panel.position.set(this.screenWidth / 2 + 100, this.screenHeight / 2 - 200);
    this.container.addChild(panel);
    this.infoPanel = panel;
  }

  private renderBackButton(): void {
    const button = new Container();
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 150, 40);
    bg.fill({ color: 0x2a2a2a });
    bg.stroke({ width: 2, color: 0x555555 });
    button.addChild(bg);

    // Text
    const text = new Text({
      text: '← Back to Galaxy',
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: 14,
        fill: 0xffffff,
      },
    });
    text.anchor.set(0.5);
    text.position.set(75, 20);
    button.addChild(text);

    button.position.set(20, 20);

    // Hover effect
    button.on('pointerenter', () => {
      bg.clear();
      bg.rect(0, 0, 150, 40);
      bg.fill({ color: 0x3a3a3a });
      bg.stroke({ width: 2, color: 0x777777 });
    });

    button.on('pointerleave', () => {
      bg.clear();
      bg.rect(0, 0, 150, 40);
      bg.fill({ color: 0x2a2a2a });
      bg.stroke({ width: 2, color: 0x555555 });
    });

    button.on('pointerdown', () => {
      this.onBackToGalaxy();
    });

    this.container.addChild(button);
  }

  /**
   * Update screen dimensions (on window resize)
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

    // Re-render if a system is displayed
    if (this.currentSystem) {
      this.showSystem(this.currentSystem);
    }
  }

  /**
   * Get the container to add to stage
   */
  public get displayObject(): Container {
    return this.container;
  }
}
