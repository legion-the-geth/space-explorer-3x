import { Graphics, Text } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { SystemDiscoveryState } from '@stores/useDiscoveryStore';
import { THEME } from '@ui/theme';
import { Panel } from '@ui/components/Panel';

/**
 * Panel showing detailed information about a star system
 */
export class SystemInfoPanel extends Panel {
  constructor(
    system: StarSystem,
    systemState: SystemDiscoveryState,
    connectedSystems: string[]
  ) {
    super({
      width: 350,
      height: 400,
    });

    this.renderContent(system, systemState, connectedSystems);
  }

  private renderContent(
    system: StarSystem,
    systemState: SystemDiscoveryState,
    connectedSystems: string[]
  ): void {
    // Title
    const title = new Text({
      text: system.name,
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.large,
        fill: THEME.colors.textPrimary,
        fontWeight: 'bold',
      },
    });
    title.position.set(20, 20);
    this.addChild(title);

    // Status badge
    let statusText = '';
    let statusColor: number = THEME.colors.textPrimary;

    if (systemState === SystemDiscoveryState.SCANNED) {
      statusText = 'Scanned';
      statusColor = THEME.colors.success;
    } else if (systemState === SystemDiscoveryState.VISITED) {
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
      this.addChild(status);
    }

    // Separator
    const separator = new Graphics();
    separator.rect(20, 60, 310, 1);
    separator.fill({ color: THEME.colors.separator });
    this.addChild(separator);

    // Star info
    const star = system.star;
    const infoLines = [
      { label: 'Star Type', value: star.type },
      { label: 'Name', value: star.name },
      { label: 'Temperature', value: `${star.temperature} K` },
      { label: 'Mass', value: `${star.mass.toFixed(2)} M☉` },
      { label: 'Radius', value: `${star.radius.toFixed(2)} R☉` },
      { label: 'Position', value: `(${system.position.x}, ${system.position.y})` },
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
      this.addChild(label);

      const value = new Text({
        text: line.value,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.normal,
          fill: THEME.colors.textPrimary,
        },
      });
      value.position.set(30, yOffset + 20);
      this.addChild(value);

      yOffset += 55;
    });

    // Planets
    if (system.planets) {
      const planetsSeparator = new Graphics();
      planetsSeparator.rect(20, yOffset, 310, 1);
      planetsSeparator.fill({ color: THEME.colors.separator });
      this.addChild(planetsSeparator);

      yOffset += 20;

      const planetsTitle = new Text({
        text: `Planets (${system.planets.length})`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.medium,
          fill: THEME.colors.textPrimary,
          fontWeight: 'bold',
        },
      });
      planetsTitle.position.set(30, yOffset);
      this.addChild(planetsTitle);

      yOffset += 30;

      system.planets.slice(0, 5).forEach((planet) => {
        const planetText = new Text({
          text: `${planet.name} (${planet.type})`,
          style: {
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.size.small,
            fill: THEME.colors.textSecondary,
          },
        });
        planetText.position.set(40, yOffset);
        this.addChild(planetText);
        yOffset += 20;
      });

      if (system.planets.length > 5) {
        const moreText = new Text({
          text: `... and ${system.planets.length - 5} more`,
          style: {
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.size.small,
            fill: THEME.colors.textMuted,
            fontStyle: 'italic',
          },
        });
        moreText.position.set(40, yOffset);
        this.addChild(moreText);
        yOffset += 20;
      }
    }

    // Jump lines
    if (connectedSystems.length > 0) {
      const jumpSeparator = new Graphics();
      jumpSeparator.rect(20, yOffset, 310, 1);
      jumpSeparator.fill({ color: THEME.colors.separator });
      this.addChild(jumpSeparator);

      yOffset += 20;

      const jumpTitle = new Text({
        text: `Jump Lines (${connectedSystems.length})`,
        style: {
          fontFamily: THEME.typography.fontFamily,
          fontSize: THEME.typography.size.medium,
          fill: THEME.colors.textAccent,
          fontWeight: 'bold',
        },
      });
      jumpTitle.position.set(30, yOffset);
      this.addChild(jumpTitle);

      yOffset += 30;

      connectedSystems.slice(0, 5).forEach((systemName) => {
        const jumpText = new Text({
          text: `→ ${systemName}`,
          style: {
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.size.small,
            fill: THEME.colors.textSecondary,
          },
        });
        jumpText.position.set(40, yOffset);
        this.addChild(jumpText);
        yOffset += 20;
      });

      if (connectedSystems.length > 5) {
        const moreJumpText = new Text({
          text: `... and ${connectedSystems.length - 5} more`,
          style: {
            fontFamily: THEME.typography.fontFamily,
            fontSize: THEME.typography.size.small,
            fill: THEME.colors.textMuted,
            fontStyle: 'italic',
          },
        });
        moreJumpText.position.set(40, yOffset);
        this.addChild(moreJumpText);
        yOffset += 20;
      }
    }

    // Finalize panel height
    this.resize(350, Math.max(400, yOffset + 40));
  }
}
