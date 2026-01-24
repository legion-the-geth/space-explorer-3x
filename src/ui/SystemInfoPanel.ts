import { Container, Graphics, Text } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { Planet } from '@game/Planet';
import { SystemDiscoveryState } from '@stores/useDiscoveryStore';
import { THEME } from '@ui/theme';
import { Panel } from '@ui/components/Panel';

export interface ConnectedSystemInfo {
  id: string;
  name: string;
}

/**
 * Panel showing detailed information about a star system or selected planet
 */
export class SystemInfoPanel extends Panel {
  private contentContainer: Container;

  // Stored data to restore system view
  private system: StarSystem;
  private systemState: SystemDiscoveryState;
  private connectedSystems: ConnectedSystemInfo[];
  private onSystemClick?: (systemId: string) => void;

  constructor(
    system: StarSystem,
    systemState: SystemDiscoveryState,
    connectedSystems: ConnectedSystemInfo[],
    onSystemClick?: (systemId: string) => void
  ) {
    super({
      width: 350,
      height: 400,
    });

    this.system = system;
    this.systemState = systemState;
    this.connectedSystems = connectedSystems;
    this.onSystemClick = onSystemClick;

    this.contentContainer = new Container();
    this.addChild(this.contentContainer);

    this.showSystemInfo();
  }

  /**
   * Show default system information (Star + list of planets/jumps)
   */
  public showSystemInfo(): void {
    this.contentContainer.removeChildren();

    // Title
    const title = new Text({
      text: this.system.name,
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.large,
        fill: THEME.colors.textPrimary,
        fontWeight: 'bold',
      },
    });
    title.position.set(20, 20);
    this.contentContainer.addChild(title);

    // Status badge
    let statusText = '';
    let statusColor: number = THEME.colors.textPrimary;

    if (this.systemState === SystemDiscoveryState.SCANNED) {
      statusText = 'Scanned';
      statusColor = THEME.colors.success;
    } else if (this.systemState === SystemDiscoveryState.VISITED) {
      statusText = 'Visited';
      statusColor = THEME.colors.warning;
    }

    if (statusText) {
      const status = new Text({
        text: statusText,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: statusColor,
          fontWeight: 'bold',
        },
      });
      status.anchor.set(1, 0);
      status.position.set(330, 22);
      this.contentContainer.addChild(status);
    }

    // Separator
    const separator = new Graphics();
    separator.rect(20, 60, 310, 1);
    separator.fill({ color: THEME.colors.separator });
    this.contentContainer.addChild(separator);

    // Star info
    const star = this.system.star;
    const infoLines = [
      { label: 'Star Type', value: star.type },
      { label: 'Name', value: star.name },
      { label: 'Temperature', value: `${star.temperature} K` },
      { label: 'Mass', value: `${star.mass.toFixed(2)} M☉` },
      { label: 'Radius', value: `${star.radius.toFixed(2)} R☉` },
      { label: 'Position', value: `(${this.system.position.x}, ${this.system.position.y})` },
    ];

    let yOffset = 80;
    infoLines.forEach((line) => {
      const label = new Text({
        text: `${line.label}:`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: THEME.colors.textSecondary,
        },
      });
      label.position.set(30, yOffset);
      this.contentContainer.addChild(label);

      const value = new Text({
        text: line.value,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: THEME.colors.textPrimary,
        },
      });
      value.position.set(30, yOffset + 20);
      this.contentContainer.addChild(value);

      yOffset += 55;
    });

    // Planets Summary (List)
    if (this.system.planets && this.system.planets.length > 0) {
      const planetsSeparator = new Graphics();
      planetsSeparator.rect(20, yOffset, 310, 1);
      planetsSeparator.fill({ color: THEME.colors.separator });
      this.contentContainer.addChild(planetsSeparator);

      yOffset += 20;

      const planetsTitle = new Text({
        text: `Planets (${this.system.planets.length})`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.medium,
          fill: THEME.colors.textPrimary,
          fontWeight: 'bold',
        },
      });
      planetsTitle.position.set(30, yOffset);
      this.contentContainer.addChild(planetsTitle);

      yOffset += 30;

      // Click star/background to see details text helper? 
      const hint = new Text({
        text: '(Select a planet to see details)',
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.small,
          fill: THEME.colors.textMuted,
          fontStyle: 'italic'
        }
      });
      hint.position.set(30, yOffset);
      this.contentContainer.addChild(hint);
      yOffset += 25;

      // We don't list all planets here to save space, relies on Visualizer
    }

    // Jump lines
    if (this.connectedSystems.length > 0) {
      const jumpSeparator = new Graphics();
      jumpSeparator.rect(20, yOffset, 310, 1);
      jumpSeparator.fill({ color: THEME.colors.separator });
      this.contentContainer.addChild(jumpSeparator);

      yOffset += 20;

      const jumpTitle = new Text({
        text: `Jump Lines (${this.connectedSystems.length})`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.medium,
          fill: THEME.colors.textAccent,
          fontWeight: 'bold',
        },
      });
      jumpTitle.position.set(30, yOffset);
      this.contentContainer.addChild(jumpTitle);

      yOffset += 30;

      this.connectedSystems.slice(0, 5).forEach((sysInfo) => {
        const jumpText = new Text({
          text: `→ ${sysInfo.name}`,
          style: {
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.size.small,
            fill: THEME.colors.textSecondary,
          },
        });

        jumpText.position.set(40, yOffset);

        if (this.onSystemClick) {
          jumpText.eventMode = 'static';
          jumpText.cursor = 'pointer';

          jumpText.on('pointerdown', () => this.onSystemClick!(sysInfo.id));

          jumpText.on('pointerenter', () => {
            jumpText.style.fill = THEME.colors.textAccent;
          });

          jumpText.on('pointerleave', () => {
            jumpText.style.fill = THEME.colors.textSecondary;
          });
        }

        this.contentContainer.addChild(jumpText);
        yOffset += 25;
      });
    }

    this.resize(350, Math.max(400, yOffset + 40));
  }

  /**
   * Show details for a specific planet
   */
  public showPlanetDetails(planet: Planet): void {
    this.contentContainer.removeChildren();

    // Planet Name
    const title = new Text({
      text: planet.name,
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.large,
        fill: THEME.colors.textPrimary,
        fontWeight: 'bold',
      },
    });
    title.position.set(20, 20);
    this.contentContainer.addChild(title);

    // Subtitle (Type)
    const typeText = new Text({
      text: planet.type,
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.medium,
        fill: THEME.colors.textAccent,
      }
    });
    typeText.position.set(20, 50);
    this.contentContainer.addChild(typeText);

    // Separator
    const separator = new Graphics();
    separator.rect(20, 80, 310, 1);
    separator.fill({ color: THEME.colors.separator });
    this.contentContainer.addChild(separator);

    // Details properties
    const infoLines = [
      { label: 'Distance', value: `${planet.distance.toFixed(1)} AU` },
      { label: 'Radius', value: `${planet.radius.toFixed(2)} Earths` },
      { label: 'Mass', value: `${planet.mass.toFixed(2)} Earths` },
    ];

    let yOffset = 100;
    infoLines.forEach((line) => {
      const label = new Text({
        text: `${line.label}:`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: THEME.colors.textSecondary,
        },
      });
      label.position.set(30, yOffset);
      this.contentContainer.addChild(label);

      const value = new Text({
        text: line.value,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: THEME.colors.textPrimary,
        },
      });
      value.position.set(30, yOffset + 20);
      this.contentContainer.addChild(value);

      yOffset += 55;
    });

    // Helper to go back
    const backHint = new Text({
      text: '(Click on background to return to system)',
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.small,
        fill: THEME.colors.textMuted,
        fontStyle: 'italic',
        align: 'center'
      }
    });
    backHint.anchor.set(0.5);
    backHint.position.set(175, 400 - 30);
    this.contentContainer.addChild(backHint);
  }
}
