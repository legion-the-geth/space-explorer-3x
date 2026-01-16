import { Container } from 'pixi.js';
import { StarSystem } from '@game/StarSystem';
import { SystemDiscoveryState } from '@stores/useDiscoveryStore';
import { ConnectedSystemInfo, SystemInfoPanel } from '@ui/SystemInfoPanel';
import { SystemVisualizer } from '@ui/SystemVisualizer';
import { Button } from '@ui/components/Button';
import { THEME } from '@ui/theme';

export interface SystemDetailViewConfig {
  screenWidth: number;
  screenHeight: number;
  currentPlayerSystemId: string;
  onBackToGalaxy: () => void;
  onScanSystem: (systemId: string) => void;
  onJumpToSystem: (systemId: string) => void;
  onShowSystemDetails: (systemId: string) => void;
  getSystemState: (systemId: string) => SystemDiscoveryState;
  getConnectedSystemNames: (systemId: string) => ConnectedSystemInfo[];
  isSystemJumpable: (systemId: string) => boolean;
}

/**
 * Detailed view of a star system
 * Shows the star and its information panel
 */
export class SystemDetailView {
  private container: Container;
  private screenWidth: number;
  private screenHeight: number;
  private currentPlayerSystemId: string;
  private onBackToGalaxy: () => void;
  private onScanSystem: (systemId: string) => void;
  private onJumpToSystem: (systemId: string) => void;
  private onShowSystemDetails: (systemId: string) => void;
  private getSystemState: (systemId: string) => SystemDiscoveryState;
  private getConnectedSystemNames: (systemId: string) => ConnectedSystemInfo[];
  private isSystemJumpable: (systemId: string) => boolean;

  private currentSystem?: StarSystem;

  constructor(config: SystemDetailViewConfig) {
    this.container = new Container();
    this.screenWidth = config.screenWidth;
    this.screenHeight = config.screenHeight;
    this.currentPlayerSystemId = config.currentPlayerSystemId;
    this.onBackToGalaxy = config.onBackToGalaxy;
    this.onScanSystem = config.onScanSystem;
    this.onJumpToSystem = config.onJumpToSystem;
    this.onShowSystemDetails = config.onShowSystemDetails;
    this.getSystemState = config.getSystemState;
    this.getConnectedSystemNames = config.getConnectedSystemNames;
    this.isSystemJumpable = config.isSystemJumpable;
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
    const infoPanel = new SystemInfoPanel(
      system,
      systemState,
      connectedSystems,
      (targetId) => this.onShowSystemDetails(targetId)
    );
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

        // Scan Button (only if not scanned AND player is at this system)

        const isAtSystem = system.id === this.currentPlayerSystemId;

        

        if (systemState !== SystemDiscoveryState.SCANNED && isAtSystem) {

          const scanButton = new Button({

            text: '🔬 Scan System',

            width: 200,

            height: 50,

            isPrimary: true,

            fontSize: THEME.typography.size.medium,

            onPress: () => this.onScanSystem(system.id),

          });

          scanButton.position.set(this.screenWidth / 2 - 210, 30);

          this.container.addChild(scanButton);

        }

    

        // Jump Button (only if jumpable)

        if (this.isSystemJumpable(system.id)) {

          const jumpButton = new Button({

            text: '🚀 Jump to System',

            width: 200,

            height: 50,

            isPrimary: true,

            fontSize: THEME.typography.size.medium,

            onPress: () => this.onJumpToSystem(system.id),

          });

          

          // Position depends on whether Scan button is present

          const showScan = systemState !== SystemDiscoveryState.SCANNED && isAtSystem;

          const xPos = showScan ? this.screenWidth / 2 + 10 : this.screenWidth / 2 - 100;

          jumpButton.position.set(xPos, 30);

          this.container.addChild(jumpButton);

        }

      }

    

      /**

       * Update player position (to refresh UI options)

       */

      public setPlayerPosition(systemId: string): void {

        this.currentPlayerSystemId = systemId;

        if (this.currentSystem) {

          // Refresh UI to update buttons

          this.showSystem(this.currentSystem);

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
