import { Container, Text } from 'pixi.js';
import { Camera } from '@core/Camera';
import { THEME } from '@ui/theme';
import { Panel } from '@ui/components/Panel';

export interface HUDConfig {
  screenWidth: number;
  screenHeight: number;
  camera: Camera;
}

/**
 * Heads-Up Display showing camera coordinates and zoom level
 */
export class HUD {
  private container: Container;
  private camera: Camera;
  private screenWidth: number;
  private screenHeight: number;

  private coordsText: Text;
  private zoomText: Text;
  private controlsText: Text;
  private background: Panel;

  constructor(config: HUDConfig) {
    this.container = new Container();
    this.camera = config.camera;
    this.screenWidth = config.screenWidth;
    this.screenHeight = config.screenHeight;

    // Create background panel
    this.background = new Panel({
      width: 280,
      height: 100,
      backgroundColor: THEME.colors.background,
      backgroundAlpha: 0.85
    });
    this.background.position.set(10, 10);
    this.container.addChild(this.background);

    // Coordinates text
    this.coordsText = new Text({
      text: 'Position: (0, 0)',
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.normal,
        fill: THEME.colors.textPrimary,
      },
    });
    this.coordsText.position.set(20, 20);
    this.container.addChild(this.coordsText);

    // Zoom text
    this.zoomText = new Text({
      text: 'Zoom: 1.00x',
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.normal,
        fill: THEME.colors.textPrimary,
      },
    });
    this.zoomText.position.set(20, 40);
    this.container.addChild(this.zoomText);

    // Controls hint
    this.controlsText = new Text({
      text: 'Controls: Wheel=Zoom | MMB/Space+Drag=Pan',
      style: {
        fontFamily: THEME.typography.fontFamily,
        fontSize: THEME.typography.size.tiny,
        fill: THEME.colors.textMuted,
      },
    });
    this.controlsText.position.set(20, 70);
    this.container.addChild(this.controlsText);
  }

  /**
   * Update HUD with current camera state
   */
  public update(): void {
    // Get world center position
    const worldCenter = this.camera.getWorldCenter(this.screenWidth, this.screenHeight);

    // Update texts
    this.coordsText.text = `Position: (${worldCenter.x.toFixed(1)}, ${worldCenter.y.toFixed(1)})`;
    this.zoomText.text = `Zoom: ${this.camera.zoom.toFixed(2)}x`;
  }

  /**
   * Update screen dimensions (on window resize)
   */
  public resize(width: number, height: number): void {
    this.screenWidth = width;
    this.screenHeight = height;
  }

  /**
   * Get the container to add to stage
   */
  public get displayObject(): Container {
    return this.container;
  }
}
