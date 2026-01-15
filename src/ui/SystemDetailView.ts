import { Container, Graphics, Text } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { SystemDiscoveryState } from '@stores/useDiscoveryStore';

export interface SystemDetailViewConfig {
  screenWidth: number;
  screenHeight: number;
  onBackToGalaxy: () => void;
  onScanSystem: (systemId: string) => void;
  getSystemState: (systemId: string) => SystemDiscoveryState;
  getConnectedSystemNames: (systemId: string) => string[];
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
  private onScanSystem: (systemId: string) => void;
  private getSystemState: (systemId: string) => SystemDiscoveryState;
  private getConnectedSystemNames: (systemId: string) => string[];

  private starGraphic?: Graphics;
  private infoPanel?: Container;
  private currentSystem?: StarSystem;

  constructor(config: SystemDetailViewConfig) {
    this.container = new Container();
    this.screenWidth = config.screenWidth;
    this.screenHeight = config.screenHeight;
    this.onBackToGalaxy = config.onBackToGalaxy;
    this.onScanSystem = config.onScanSystem;
    this.getSystemState = config.getSystemState;
    this.getConnectedSystemNames = config.getConnectedSystemNames;
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
    this.renderScanButton();
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

    // Status badge (aligned to right)
    const systemState = this.getSystemState(this.currentSystem.id);
    let statusText = '';
    let statusColor = 0xffffff;

    if (systemState === SystemDiscoveryState.SCANNED) {
      statusText = 'Scanned';
      statusColor = 0x00ff00; // Green
    } else if (systemState === SystemDiscoveryState.VISITED) {
      statusText = 'Visited';
      statusColor = 0xffa500; // Orange
    }

    if (statusText) {
      const status = new Text({
        text: statusText,
        style: {
          fontFamily: 'Courier New, monospace',
          fontSize: 14,
          fill: statusColor,
          fontWeight: 'bold',
        },
      });
      status.anchor.set(1, 0); // Anchor to top-right
      status.position.set(330, 22); // Align right with padding
      panel.addChild(status);
    }

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

    // Show planets if system has been scanned
    if (this.currentSystem.planets) {
      // Separator
      const planetsSeparator = new Graphics();
      planetsSeparator.rect(20, yOffset, 310, 1);
      planetsSeparator.fill({ color: 0x444444 });
      panel.addChild(planetsSeparator);

      yOffset += 20;

      // Planets title
      const planetsTitle = new Text({
        text: `Planets (${this.currentSystem.planets.length})`,
        style: {
          fontFamily: 'Courier New, monospace',
          fontSize: 16,
          fill: 0xffffff,
          fontWeight: 'bold',
        },
      });
      planetsTitle.position.set(30, yOffset);
      panel.addChild(planetsTitle);

      yOffset += 30;

      // List planets (max 5 visible)
      const planetsToShow = this.currentSystem.planets.slice(0, 5);
      planetsToShow.forEach((planet) => {
        const planetText = new Text({
          text: `${planet.name} (${planet.type})`,
          style: {
            fontFamily: 'Courier New, monospace',
            fontSize: 12,
            fill: 0xaaaaaa,
          },
        });
        planetText.position.set(40, yOffset);
        panel.addChild(planetText);

        yOffset += 20;
      });

      if (this.currentSystem.planets.length > 5) {
        const moreText = new Text({
          text: `... and ${this.currentSystem.planets.length - 5} more`,
          style: {
            fontFamily: 'Courier New, monospace',
            fontSize: 12,
            fill: 0x888888,
            fontStyle: 'italic',
          },
        });
        moreText.position.set(40, yOffset);
        panel.addChild(moreText);
      }

      // Adjust panel height if needed
      bg.clear();
      bg.rect(0, 0, 350, Math.max(400, yOffset + 40));
      bg.fill({ color: 0x1a1a1a, alpha: 0.9 });
      bg.stroke({ width: 2, color: 0x444444 });
    }

    // Show jump lines (connected systems)
    const connectedSystems = this.getConnectedSystemNames(this.currentSystem.id);
    if (connectedSystems.length > 0) {
      // Separator
      const jumpSeparator = new Graphics();
      jumpSeparator.rect(20, yOffset, 310, 1);
      jumpSeparator.fill({ color: 0x444444 });
      panel.addChild(jumpSeparator);

      yOffset += 20;

      // Jump lines title
      const jumpTitle = new Text({
        text: `Jump Lines (${connectedSystems.length})`,
        style: {
          fontFamily: 'Courier New, monospace',
          fontSize: 16,
          fill: 0x00aaff,
          fontWeight: 'bold',
        },
      });
      jumpTitle.position.set(30, yOffset);
      panel.addChild(jumpTitle);

      yOffset += 30;

      // List connected systems (max 5 visible)
      const systemsToShow = connectedSystems.slice(0, 5);
      systemsToShow.forEach((systemName) => {
        const jumpText = new Text({
          text: `→ ${systemName}`,
          style: {
            fontFamily: 'Courier New, monospace',
            fontSize: 12,
            fill: 0xaaaaaa,
          },
        });
        jumpText.position.set(40, yOffset);
        panel.addChild(jumpText);

        yOffset += 20;
      });

      if (connectedSystems.length > 5) {
        const moreJumpText = new Text({
          text: `... and ${connectedSystems.length - 5} more`,
          style: {
            fontFamily: 'Courier New, monospace',
            fontSize: 12,
            fill: 0x888888,
            fontStyle: 'italic',
          },
        });
        moreJumpText.position.set(40, yOffset);
        panel.addChild(moreJumpText);
        yOffset += 20;
      }

      // Adjust panel height again
      bg.clear();
      bg.rect(0, 0, 350, Math.max(400, yOffset + 40));
      bg.fill({ color: 0x1a1a1a, alpha: 0.9 });
      bg.stroke({ width: 2, color: 0x444444 });
    }

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

    // Position in bottom-left corner
    button.position.set(20, this.screenHeight - 60);

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

  private renderScanButton(): void {
    if (!this.currentSystem) return;

    // Don't show scan button if system is already scanned
    const systemState = this.getSystemState(this.currentSystem.id);
    if (systemState === SystemDiscoveryState.SCANNED) {
      return;
    }

    const button = new Container();
    button.eventMode = 'static';
    button.cursor = 'pointer';

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 200, 50);
    bg.fill({ color: 0x0066cc });
    bg.stroke({ width: 2, color: 0x0088ff });
    button.addChild(bg);

    // Text
    const text = new Text({
      text: '🔬 Scan System',
      style: {
        fontFamily: 'Courier New, monospace',
        fontSize: 16,
        fill: 0xffffff,
        fontWeight: 'bold',
      },
    });
    text.anchor.set(0.5);
    text.position.set(100, 25);
    button.addChild(text);

    // Position centered at top
    button.position.set(this.screenWidth / 2 - 100, 30);

    // Hover effect
    button.on('pointerenter', () => {
      bg.clear();
      bg.rect(0, 0, 200, 50);
      bg.fill({ color: 0x0088ff });
      bg.stroke({ width: 2, color: 0x00aaff });
    });

    button.on('pointerleave', () => {
      bg.clear();
      bg.rect(0, 0, 200, 50);
      bg.fill({ color: 0x0066cc });
      bg.stroke({ width: 2, color: 0x0088ff });
    });

    button.on('pointerdown', () => {
      this.onScanSystem(this.currentSystem!.id);
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
