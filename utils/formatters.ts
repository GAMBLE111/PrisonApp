/**
 * Format a number with commas for display.
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-AU');
}

/**
 * Convert a camelCase field name to a readable label.
 */
export function fieldToLabel(field: string): string {
  return field
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

/**
 * Truncate a string to a max length.
 */
export function truncate(str: string, maxLen: number = 20): string {
  if (str.length <= maxLen) return str;
  return str.slice(0, maxLen - 1) + '…';
}
