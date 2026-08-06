/**
 * Crypto & ID Utilities
 */

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
};

export const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).toUpperCase();
};

export const generateAnchorHash = (): string => {
  return `anchor_${Math.random().toString(36).substr(2, 12)}_${Date.now()}`;
};
