const ALPHANUMERIC =
  "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function secureRandomString(length = 16): string {
 if (!Number.isInteger(length) || length < 1) {
   throw new RangeError("length must be a positive integer.");
 }

    const values = new Uint32Array(length);

    crypto.getRandomValues(values);

    return Array.from(values, (value) =>
      ALPHANUMERIC[value % ALPHANUMERIC.length]
    ).join("");
}

export function createReferenceNumber(
  prefix: string,
  length = 10
): string {
  const normalizedPrefix = prefix
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "");

    if (!normalizedPrefix) {
      throw new Error("A valid prefix is required.");
    }

    return `${normalizedPrefix}-${secureRandomString(length)}`;
}
