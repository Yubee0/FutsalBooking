export const STATUS = {
  AVAILABLE: '#4CAF50', // Green
  BOOKED: '#F44336', // Red
  RESERVED: '#FFC107', // Amber
  DEFAULT: '#9E9E9E', // Grey
};

// Player theme
const PLAYER_THEME = {
  PRIMARY: '#2E7D32', // Dark green
  PRIMARY_DARK: '#1B5E20',
  PRIMARY_LIGHT: '#E8F5E9',
  ACCENT: '#4CAF50', // Medium green
};

// Owner theme
const OWNER_THEME = {
  PRIMARY: '#6A1B9A', // Dark purple
  PRIMARY_DARK: '#4A148C',
  PRIMARY_LIGHT: '#F3E5F5',
  ACCENT: '#9C27B0', // Medium purple
};

export const colors = {
  PRIMARY: '#4A90E2',
  PRIMARY_DARK: '#2A70C2',
  PRIMARY_LIGHT: '#E1F0FF',

  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY: '#6C757D',
  GRAY_LIGHT: '#D3D3D3',
  GRAY_DARK: '#343A40',
  BACKGROUND: '#F5F7FA',
  TEXT_PRIMARY: '#212529',
  TEXT_SECONDARY: '#495057',
  BORDER: '#CED4DA',

  // Status colors
  SUCCESS: '#4CAF50',
  ERROR: '#FF4500',
  WARNING: '#FFA500',
  INFO: '#17A2B8',
};

// Theme-specific colors
export const playerColors = {
  ...colors,
  ...PLAYER_THEME,
};

export const ownerColors = {
  ...colors,
  ...OWNER_THEME,
};
