import { Container } from 'pixi.js';

export interface CameraConfig {
  minZoom?: number;
  maxZoom?: number;
  zoomSpeed?: number;
  smoothing?: number;
}

/**
 * Camera system for pan/zoom navigation
 * Manages viewport transformation (position and scale)
 */
export class Camera {
  public container: Container;

  // Current state
  private _x = 0;
  private _y = 0;
  private _zoom = 1;

  // Target state (for smooth interpolation)
  private targetX = 0;
  private targetY = 0;
  private targetZoom = 1;

  // Configuration
  private minZoom: number;
  private maxZoom: number;
  private zoomSpeed: number;
  private smoothing: number;

  constructor(config: CameraConfig = {}) {
    this.container = new Container();

    this.minZoom = config.minZoom ?? 0.1;
    this.maxZoom = config.maxZoom ?? 10;
    this.zoomSpeed = config.zoomSpeed ?? 0.1;
    this.smoothing = config.smoothing ?? 0.15;
  }

  /**
   * Update camera position and zoom with smooth interpolation
   */
  public update(): void {
    // Lerp position
    this._x += (this.targetX - this._x) * this.smoothing;
    this._y += (this.targetY - this._y) * this.smoothing;

    // Lerp zoom
    this._zoom += (this.targetZoom - this._zoom) * this.smoothing;

    // Apply transformations to container
    this.container.position.set(this._x, this._y);
    this.container.scale.set(this._zoom, this._zoom);
  }

  /**
   * Pan the camera by delta
   */
  public pan(deltaX: number, deltaY: number): void {
    this.targetX += deltaX;
    this.targetY += deltaY;
  }

  /**
   * Set absolute camera position
   */
  public setPosition(x: number, y: number): void {
    this.targetX = x;
    this.targetY = y;
  }

  /**
   * Zoom towards a specific point (screen coordinates)
   */
  public zoomTowards(screenX: number, screenY: number, delta: number): void {
    const oldZoom = this.targetZoom;
    const zoomChange = delta * this.zoomSpeed;

    // Calculate new zoom with constraints
    this.targetZoom = Math.max(this.minZoom, Math.min(this.maxZoom, oldZoom + zoomChange));

    // Adjust position to zoom towards the mouse cursor
    const worldX = (screenX - this.targetX) / oldZoom;
    const worldY = (screenY - this.targetY) / oldZoom;

    this.targetX = screenX - worldX * this.targetZoom;
    this.targetY = screenY - worldY * this.targetZoom;
  }

  /**
   * Convert screen coordinates to world coordinates
   */
  public screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this._x) / this._zoom,
      y: (screenY - this._y) / this._zoom,
    };
  }

  /**
   * Convert world coordinates to screen coordinates
   */
  public worldToScreen(worldX: number, worldY: number): { x: number; y: number } {
    return {
      x: worldX * this._zoom + this._x,
      y: worldY * this._zoom + this._y,
    };
  }

  // Getters
  public get x(): number {
    return this._x;
  }

  public get y(): number {
    return this._y;
  }

  public get zoom(): number {
    return this._zoom;
  }

  public get position(): { x: number; y: number } {
    return { x: this._x, y: this._y };
  }

  /**
   * Get current world center position (useful for HUD display)
   */
  public getWorldCenter(screenWidth: number, screenHeight: number): { x: number; y: number } {
    return this.screenToWorld(screenWidth / 2, screenHeight / 2);
  }
}
