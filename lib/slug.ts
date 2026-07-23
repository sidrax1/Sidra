const MAX_SLUG_LENGTH = 120;

export function createSlug(value: string): string {
  return value
   .normalize("NFKD")
   .replace(/[\u0300-\u036f]/g, "")
   .toLocaleLowerCase("en-IN")
   .replace(/&/g, " and ")
   .replace(/['’]/g, "")
   .replace(/[^a-z0-9]+/g, "-")
   .replace(/^-+|-+$/g, "")
   .replace(/-{2,}/g, "-")
   .slice(0, MAX_SLUG_LENGTH)
   .replace(/-+$/g, "");
}

export function appendSlugSuffix(
  baseSlug: string,
  suffix: string | number
): string {
  const normalizedBase = createSlug(baseSlug);
  const normalizedSuffix = createSlug(String(suffix));

    if (!normalizedBase || !normalizedSuffix) {
      throw new Error("A valid base slug and suffix are required.");
    }

    const reservedLength = normalizedSuffix.length + 1;
    const truncatedBase = normalizedBase
     .slice(0, MAX_SLUG_LENGTH - reservedLength)
     .replace(/-+$/g, "");

    return `${truncatedBase}-${normalizedSuffix}`;
}

export function isValidSlug(value: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value);
}

export function ensureValidSlug(value: string): string {
 const slug = createSlug(value);

    if (!slug) {
      throw new Error("Unable to create a valid slug from the provided value.");
    }

    return slug;
}
