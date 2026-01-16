import { Graphics } from 'pixi.js';
import { Camera } from '@core/Camera';
import { THEME } from '@ui/theme';

export interface GridConfig {
  screenWidth: number;
  screenHeight: number;
  camera: Camera;
}

/**
 * Adaptive infinite grid that scales with zoom level
 * Shows appropriate grid density based on camera zoom
 */
export class Grid {
  private graphics: Graphics;
  private camera: Camera;
  private screenWidth: number;
  private screenHeight: number;

  // Grid tiers (different scales for different zoom levels)
  private readonly gridTiers = [
    { minZoom: 0, maxZoom: 0.3, spacing: 1000, alpha: 0.15, lineWidth: 1 },
    { minZoom: 0.3, maxZoom: 1.5, spacing: 100, alpha: 0.2, lineWidth: 1 },
    { minZoom: 1.5, maxZoom: 5, spacing: 10, alpha: 0.25, lineWidth: 1 },
    { minZoom: 5, maxZoom: Infinity, spacing: 1, alpha: 0.3, lineWidth: 1 },
  ];

  constructor(config: GridConfig) {
    this.graphics = new Graphics();
    this.camera = config.camera;
    this.screenWidth = config.screenWidth;
    this.screenHeight = config.screenHeight;
  }

  /**
   * Update grid rendering based on camera position and zoom
   */
  public update(): void {
    this.graphics.clear();

    const zoom = this.camera.zoom;

    // Find appropriate grid tier for current zoom level
    const tier = this.gridTiers.find((t) => zoom >= t.minZoom && zoom < t.maxZoom);
    if (!tier) return;

    // Get visible world bounds
    const topLeft = this.camera.screenToWorld(0, 0);
    const bottomRight = this.camera.screenToWorld(this.screenWidth, this.screenHeight);

    // Calculate grid lines to draw
    const startX = Math.floor(topLeft.x / tier.spacing) * tier.spacing;
    const endX = Math.ceil(bottomRight.x / tier.spacing) * tier.spacing;
    const startY = Math.floor(topLeft.y / tier.spacing) * tier.spacing;
    const endY = Math.ceil(bottomRight.y / tier.spacing) * tier.spacing;

    // Draw vertical lines
    for (let x = startX; x <= endX; x += tier.spacing) {
      const isAxis = x === 0;

      // Choose style based on whether it's an axis
      const strokeColor = isAxis ? THEME.colors.gridAxis : THEME.colors.gridLine;
      const strokeWidth = isAxis ? 2 / zoom : tier.lineWidth / zoom;
      const strokeAlpha = isAxis ? 0.6 : tier.alpha;

      this.graphics.moveTo(x, topLeft.y).lineTo(x, bottomRight.y).stroke({
        width: strokeWidth,
        color: strokeColor,
        alpha: strokeAlpha,
      });
    }

    // Draw horizontal lines
    for (let y = startY; y <= endY; y += tier.spacing) {
      const isAxis = y === 0;

      // Choose style based on whether it's an axis
      const strokeColor = isAxis ? THEME.colors.gridAxis : THEME.colors.gridLine;
      const strokeWidth = isAxis ? 2 / zoom : tier.lineWidth / zoom;
      const strokeAlpha = isAxis ? 0.6 : tier.alpha;

      this.graphics.moveTo(topLeft.x, y).lineTo(bottomRight.x, y).stroke({
        width: strokeWidth,
        color: strokeColor,
        alpha: strokeAlpha,
      });
    }
  }

  /**
   * Update screen dimensions (on window resize)
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Get the Graphics object to add to stage
   */
  public get displayObject(): Graphics {
    return this.graphics;
  }
}
