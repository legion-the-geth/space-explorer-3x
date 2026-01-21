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

    const systemState = this.getSystemState(system.id);
    const connectedSystems = this.getConnectedSystemNames(system.id);

    // Layout configuration
    const panelWidth = 350;
    const padding = 20;

    // 1. Create Info Panel (UI Layer)
    // Docked to the RIGHT side
    const infoPanel = new SystemInfoPanel(
      system,
      systemState,
      connectedSystems,
      (targetId) => this.onShowSystemDetails(targetId)
    );
    // Align top-right
    infoPanel.position.set(this.screenWidth - panelWidth - padding, padding);

    // Stretch height to fit screen minus padding
    const panelHeight = this.screenHeight - (padding * 2);
    infoPanel.resize(panelWidth, panelHeight);

    // 2. Create Visualizer with callbacks (Background Layer)
    const visualizer = new SystemVisualizer({
      system,
      onPlanetClick: (planet) => infoPanel.showPlanetDetails(planet),
      onBackgroundClick: () => infoPanel.showSystemInfo(),
    });

    // Center in the REMAINING space (Left side)
    const visualizerAreaWidth = this.screenWidth - panelWidth - (padding * 2);
    visualizer.position.set(visualizerAreaWidth / 2, this.screenHeight / 2);

    // 3. Add to container
    this.container.addChild(visualizer);
    this.container.addChild(infoPanel);

    // 4. Render Buttons (Navigation, Scan, Jump)

    // Calculate button positions centered in the visualizer area
    const buttonCenterX = visualizerAreaWidth / 2;

    // Back Button (Bottom-Left)
    const backButton = new Button({
      text: '← Back to Galaxy',
      width: 150,
      height: 40,
      onPress: () => this.onBackToGalaxy(),
    });
    backButton.position.set(20, this.screenHeight - 60);
    this.container.addChild(backButton);

    const isAtSystem = system.id === this.currentPlayerSystemId;

    // Scan Button
    if (systemState !== SystemDiscoveryState.SCANNED && isAtSystem) {
      const scanButton = new Button({
        text: '🔬 Scan System',
        width: 200,
        height: 50,
        isPrimary: true,
        fontSize: THEME.typography.size.medium,
        onPress: () => this.onScanSystem(system.id),
      });
      scanButton.position.set(buttonCenterX - 100, 30);
      this.container.addChild(scanButton);
    }

    // Jump Button
    if (this.isSystemJumpable(system.id)) {
      const jumpButton = new Button({
        text: '🚀 Jump to System',
        width: 200,
        height: 50,
        isPrimary: true,
        fontSize: THEME.typography.size.medium,
        onPress: () => this.onJumpToSystem(system.id),
      });

      const showScan = systemState !== SystemDiscoveryState.SCANNED && isAtSystem;
      // If scan button exists, offset jump button, otherwise center
      // If both buttons present, shift scan button left (handled by re-positioning logic below if needed, 
      // but simpler: Scan centered-left, Jump centered-right)

      if (showScan) {
        // Reset scan button position for dual display
        const scanBtn = this.container.children.find(c => c instanceof Button && c.text.includes('Scan')) as Button; // naive find
        if (scanBtn) scanBtn.position.set(buttonCenterX - 210, 30);

        jumpButton.position.set(buttonCenterX + 10, 30);
      } else {
        jumpButton.position.set(buttonCenterX - 100, 30);
      }

      this.container.addChild(jumpButton);
    }
  }

  private clear(): void {
    this.container.removeChildren();
  }

  // Removed renderVisuals and renderUI as they are now merged in showSystem
  // to facilitate interaction wiring.

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
   * Update player position (to refresh UI options)
   */
  public setPlayerPosition(systemId: string): void {
    this.currentPlayerSystemId = systemId;
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
