/**
 * UI Theme Configuration
 * Centralizes all visual constants for the application interface.
 */

export const THEME = {
  colors: {
    // Backgrounds
    background: 0x0a0e27,
    panelBackground: 0x1a1a1a,
    panelBackgroundAlpha: 0.9,
    
    // UI Elements
    border: 0x444444,
    separator: 0x444444,
    gridLine: 0xededed,
    gridAxis: 0xffffff,
    
    // Text
    textPrimary: 0xffffff,
    textSecondary: 0xaaaaaa,
    textMuted: 0x888888,
    textAccent: 0x00aaff,
    
    // States
    success: 0x00ff00,
    warning: 0xffa500,
    error: 0xff4444,
    
    // Buttons
    button: {
      default: {
        bg: 0x2a2a2a,
        stroke: 0x555555,
      },
      hover: {
        bg: 0x3a3a3a,
        stroke: 0x777777,
      },
      primary: {
        bg: 0x0066cc,
        stroke: 0x0088ff,
      },
      primaryHover: {
        bg: 0x0088ff,
        stroke: 0x00aaff,
      }
    }
  },
  
  typography: {
    fontFamily: 'Courier New, monospace',
    size: {
      tiny: 11,
      small: 12,
      normal: 14,
      medium: 16,
      large: 24,
    }
  },
  
  layout: {
    padding: 10,
    borderRadius: 4,
    borderWidth: 2,
  }
} as const;

export type Theme = typeof THEME;
