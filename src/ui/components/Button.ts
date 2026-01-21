import { Container, Graphics, Text, TextStyleOptions } from 'pixi.js';
import { THEME } from '@ui/theme';

export interface ButtonOptions {
  text: string;
  width: number;
  height: number;
  onPress: () => void;
  isPrimary?: boolean;
  fontSize?: number;
}

/**
 * A standard UI button with hover states
 */
export class Button extends Container {
  private bg: Graphics;
  private buttonText: Text;
  private options: ButtonOptions;

  constructor(options: ButtonOptions) {
    super();
    this.options = options;

    this.eventMode = 'static';
    this.cursor = 'pointer';

    this.bg = new Graphics();
    this.addChild(this.bg);

    const textStyle: TextStyleOptions = {
      fontFamily: THEME.typography.fontFamily,
      fontSize: options.fontSize ?? THEME.typography.size.normal,
      fill: THEME.colors.textPrimary,
      fontWeight: options.isPrimary ? 'bold' : 'normal',
    };

    this.buttonText = new Text({
      text: options.text,
      style: textStyle,
    });
    this.buttonText.anchor.set(0.5);
    this.buttonText.position.set(options.width / 2, options.height / 2);
    this.addChild(this.buttonText);

    this.draw(false);

    this.on('pointerenter', () => this.draw(true));
    this.on('pointerleave', () => this.draw(false));
    this.on('pointerdown', () => options.onPress());
  }

  private draw(isHover: boolean): void {
    const { isPrimary, width, height } = this.options;

    let bgColor: number;
    let strokeColor: number;

    if (isPrimary) {
      bgColor = isHover ? THEME.colors.button.primaryHover.bg : THEME.colors.button.primary.bg;
      strokeColor = isHover
        ? THEME.colors.button.primaryHover.stroke
        : THEME.colors.button.primary.stroke;
    } else {
      bgColor = isHover ? THEME.colors.button.hover.bg : THEME.colors.button.default.bg;
      strokeColor = isHover ? THEME.colors.button.hover.stroke : THEME.colors.button.default.stroke;
    }

    this.bg.clear();
    this.bg.rect(0, 0, width, height);
    this.bg.fill({ color: bgColor });
    this.bg.stroke({ width: THEME.layout.borderWidth, color: strokeColor });
  }

  public set text(value: string) {
    this.buttonText.text = value;
  }

  public get text(): string {
    return this.buttonText.text;
  }
}
