export function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function truncateText(
  value: string,
  maxLength: number,
  suffix = "…"
): string {
  if (!Number.isInteger(maxLength) || maxLength < 1) {
    throw new RangeError("maxLength must be a positive integer.");
  }

    const normalized = normalizeWhitespace(value);

    if (normalized.length <= maxLength) {
      return normalized;
    }

    const availableLength = Math.max(0, maxLength - suffix.length);

    return `${normalized.slice(0, availableLength).trimEnd()}${suffix}`;
}

export function capitalizeFirst(value: string): string {
 const normalized = value.trim();

    if (!normalized) {
      return "";
    }

    return `${normalized.charAt(0).toUpperCase()}${normalized.slice(1)}`;
}

export function titleCase(value: string): string {
  return normalizeWhitespace(value)
   .toLocaleLowerCase("en-IN")
   .replace(/\b\p{L}/gu, (character) =>
     character.toLocaleUpperCase("en-IN")
   );
}

export function getFirstName(displayName: string): string {
  return normalizeWhitespace(displayName).split(" ")[0] ?? "";
}

export function getInitials(

  displayName: string,
  maximumInitials = 2
): string {
  if (!Number.isInteger(maximumInitials) || maximumInitials < 1) {
    throw new RangeError("maximumInitials must be a positive integer.");
  }

    return normalizeWhitespace(displayName)
     .split(" ")
     .filter(Boolean)
     .slice(0, maximumInitials)
     .map((part) => part.charAt(0).toLocaleUpperCase("en-IN"))
     .join("");
}

export function sanitizePlainText(value: string): string {
  return value
    .replace(/<[^>]*>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .trim();
}
