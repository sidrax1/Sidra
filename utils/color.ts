export function isHexColor(value: string): boolean {
  return /^#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(value);
}

export function normalizeHexColor(value: string): string {
  if (!isHexColor(value)) {
    throw new Error("Invalid hexadecimal colour.");
  }

  const normalized = value.toUpperCase();

  if (normalized.length === 4) {
    return `#${normalized[1]}${normalized[1]}${normalized[2]}${normalized[2]}${normalized[3]}${normalized[3]}`;
  }

  return normalized;
}

export function hexToRgb(
  value: string
): { red: number; green: number; blue: number } {
  const normalized = normalizeHexColor(value);

  return {
    red: Number.parseInt(normalized.slice(1, 3), 16),
    green: Number.parseInt(normalized.slice(3, 5), 16),
    blue: Number.parseInt(normalized.slice(5, 7), 16),
  };
}

export function hexToRgba(value: string, alpha: number): string {
  if (!Number.isFinite(alpha) || alpha < 0 || alpha > 1) {
    throw new RangeError("alpha must be between 0 and 1.");
  }

  const { red, green, blue } = hexToRgb(value);

  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}
