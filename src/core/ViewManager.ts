import { Container } from 'pixi.js';

export enum ViewMode {
  Galaxy = 'galaxy',
  System = 'system',
}

export interface ViewManagerConfig {
  onViewChange?: (mode: ViewMode) => void;
}

/**
 * Manages view mode switching between Galaxy and System views
 */
export class ViewManager {
  private currentMode: ViewMode = ViewMode.Galaxy;
  private galaxyContainer: Container;
  private systemContainer: Container;
  private onViewChange?: (mode: ViewMode) => void;

  // Current system being viewed (when in System mode)
  private currentSystemId: string | null = null;

  constructor(config: ViewManagerConfig = {}) {
    this.galaxyContainer = new Container();
    this.systemContainer = new Container();
    this.onViewChange = config.onViewChange;

    // System view is hidden by default
    this.systemContainer.visible = false;
  }

  /**
   * Switch to Galaxy view
   */
  public showGalaxyView(): void {
    this.currentMode = ViewMode.Galaxy;
    this.galaxyContainer.visible = true;
    this.systemContainer.visible = false;
    this.currentSystemId = null;

    this.onViewChange?.(ViewMode.Galaxy);
  }

  /**
   * Switch to System view for a specific system
   */
  public showSystemView(systemId: string): void {
    this.currentMode = ViewMode.System;
    this.galaxyContainer.visible = false;
    this.systemContainer.visible = true;
    this.currentSystemId = systemId;

    this.onViewChange?.(ViewMode.System);
  }

  /**
   * Toggle between views (useful for keyboard shortcuts)
   */
  public toggleView(): void {
    if (this.currentMode === ViewMode.Galaxy) {
      // Can't toggle to System view without a system selected
      return;
    }
    this.showGalaxyView();
  }

  // Getters
  public get mode(): ViewMode {
    return this.currentMode;
  }

  public get galaxy(): Container {
    return this.galaxyContainer;
  }

  public get system(): Container {
    return this.systemContainer;
  }

  public get currentSystem(): string | null {
    return this.currentSystemId;
  }
}
