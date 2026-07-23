export function createIdempotencyKey(
  namespace: string,
  entityId: string,
  operation: string
): string {
  const parts = [namespace, entityId, operation].map((part) =>
    part
     .trim()
     .toLowerCase()
     .replace(/[^a-z0-9_-]+/g, "-")
     .replace(/^-+|-+$/g, "")
  );

 if (parts.some((part) => part.length === 0)) {
   throw new Error(
     "namespace, entityId and operation are required."
   );
 }

    return parts.join(":");
}

export function createRequestFingerprint(
  values: readonly string[]
): string {
  const normalized = values.map((value) => value.trim()).join("|");

    let hash = 2166136261;

    for (let index = 0; index < normalized.length; index += 1) {
      hash ^= normalized.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    return (hash >>> 0).toString(16).padStart(8, "0");
}
