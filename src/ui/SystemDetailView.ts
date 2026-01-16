import { Container } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { SystemDiscoveryState } from '@stores/useDiscoveryStore';
import { SystemInfoPanel } from '@ui/SystemInfoPanel';
import { SystemVisualizer } from '@ui/SystemVisualizer';
import { Button } from '@ui/components/Button';
import { THEME } from '@ui/theme';

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
    
    this.renderVisuals(system);
    this.renderUI(system);
  }

  private clear(): void {
    this.container.removeChildren();
  }

  private renderVisuals(system: StarSystem): void {
    const visualizer = new SystemVisualizer(system);
    visualizer.position.set(this.screenWidth / 2 - 200, this.screenHeight / 2);
    this.container.addChild(visualizer);
  }

  private renderUI(system: StarSystem): void {
    const systemState = this.getSystemState(system.id);
    const connectedSystems = this.getConnectedSystemNames(system.id);

    // Info Panel
    const infoPanel = new SystemInfoPanel(system, systemState, connectedSystems);
    infoPanel.position.set(this.screenWidth / 2 + 100, this.screenHeight / 2 - 200);
    this.container.addChild(infoPanel);

    // Back Button
    const backButton = new Button({
      text: '← Back to Galaxy',
      width: 150,
      height: 40,
      onPress: () => this.onBackToGalaxy(),
    });
    backButton.position.set(20, this.screenHeight - 60);
    this.container.addChild(backButton);

    // Scan Button (only if not scanned)
    if (systemState !== SystemDiscoveryState.SCANNED) {
      const scanButton = new Button({
        text: '🔬 Scan System',
        width: 200,
        height: 50,
        isPrimary: true,
        fontSize: THEME.typography.size.medium,
        onPress: () => this.onScanSystem(system.id),
      });
      scanButton.position.set(this.screenWidth / 2 - 100, 30);
      this.container.addChild(scanButton);
    }
  }

  /**
   * Update screen dimensions (on window resize)
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;

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