import { Camera } from './Camera';

export interface InputManagerConfig {
  canvas: HTMLCanvasElement;
  camera: Camera;
}

/**
 * Handles user input for camera controls
 * - Middle mouse button or Space + Left click for panning
 * - Mouse wheel for zooming
 */
export class InputManager {
  private canvas: HTMLCanvasElement;
  private camera: Camera;

  private isDragging = false;
  private isSpacePressed = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor(config: InputManagerConfig) {
    this.canvas = config.canvas;
    this.camera = config.camera;

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    // Mouse events
    this.canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.addEventListener('wheel', this.onWheel.bind(this), { passive: false });
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault()); // Prevent context menu

    // Keyboard events
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));

    // Prevent space from scrolling the page
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        e.preventDefault();
      }
    });
  }

  private onMouseDown(e: MouseEvent): void {
    // Middle click (button 1) or Space + Left click (button 0)
    if (e.button === 1 || (e.button === 0 && this.isSpacePressed)) {
      this.isDragging = true;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
      this.canvas.style.cursor = 'grabbing';
    }
  }

  private onMouseMove(e: MouseEvent): void {
    if (this.isDragging) {
      const deltaX = e.clientX - this.lastMouseX;
      const deltaY = e.clientY - this.lastMouseY;

      this.camera.pan(deltaX, deltaY);

      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    } else if (this.isSpacePressed) {
      // Show grab cursor when space is pressed but not dragging
      this.canvas.style.cursor = 'grab';
    } else {
      this.canvas.style.cursor = 'default';
    }
  }

  private onMouseUp(e: MouseEvent): void {
    if (e.button === 1 || e.button === 0) {
      this.isDragging = false;
      this.canvas.style.cursor = this.isSpacePressed ? 'grab' : 'default';
    }
  }

  private onWheel(e: WheelEvent): void {
    e.preventDefault();

    // Normalize wheel delta (different browsers handle this differently)
    const delta = -Math.sign(e.deltaY);

    // Zoom towards mouse position
    const rect = this.canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    this.camera.zoomTowards(mouseX, mouseY, delta);
  }

  private onKeyDown(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.isSpacePressed = true;
      if (!this.isDragging) {
        this.canvas.style.cursor = 'grab';
      }
    }
  }

  private onKeyUp(e: KeyboardEvent): void {
    if (e.code === 'Space') {
      this.isSpacePressed = false;
      if (!this.isDragging) {
        this.canvas.style.cursor = 'default';
      }
    }
  }

  /**
   * Cleanup event listeners
   */
  public destroy(): void {
    this.canvas.removeEventListener('mousedown', this.onMouseDown.bind(this));
    this.canvas.removeEventListener('mousemove', this.onMouseMove.bind(this));
    this.canvas.removeEventListener('mouseup', this.onMouseUp.bind(this));
    this.canvas.removeEventListener('wheel', this.onWheel.bind(this));

    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    window.removeEventListener('keyup', this.onKeyUp.bind(this));
  }
}
