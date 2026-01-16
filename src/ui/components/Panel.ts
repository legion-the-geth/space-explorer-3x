import { Container, Graphics } from 'pixi.js';
import { THEME } from '@ui/theme';

export interface PanelOptions {
  width: number;
  height: number;
  padding?: number;
  backgroundColor?: number;
  backgroundAlpha?: number;
  borderColor?: number;
  borderWidth?: number;
}

/**
 * A standard UI panel with background and border
 */
export class Panel extends Container {
  protected background: Graphics;
  protected panelWidth: number;
  protected panelHeight: number;
  protected padding: number;

  constructor(options: PanelOptions) {
    super();

    this.panelWidth = options.width;
    this.panelHeight = options.height;
    this.padding = options.padding ?? THEME.layout.padding;

    this.background = new Graphics();
    this.addChild(this.background);

    this.draw(options);
  }

  private draw(options: PanelOptions): void {
    const bgColor = options.backgroundColor ?? THEME.colors.panelBackground;
    const bgAlpha = options.backgroundAlpha ?? THEME.colors.panelBackgroundAlpha;
    const borderColor = options.borderColor ?? THEME.colors.border;
    const borderWidth = options.borderWidth ?? THEME.layout.borderWidth;

    this.background.clear();
    this.background.rect(0, 0, this.panelWidth, this.panelHeight);
    this.background.fill({ color: bgColor, alpha: bgAlpha });
    this.background.stroke({ width: borderWidth, color: borderColor });
  }

  /**
   * Resize the panel
   */
  public resize(width: number, height: number): void {
    this.panelWidth = width;
    this.panelHeight = height;
    // Note: This uses default theme values since we don't store the initial options
    this.draw({ width, height });
  }

  public get contentWidth(): number {
    return this.panelWidth - (this.padding * 2);
  }

  public get innerPadding(): number {
    return this.padding;
  }
}
