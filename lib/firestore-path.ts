function normalizeSegment(segment: string): string {
  const value = segment.trim();

    if (
      !value ||
      value.includes("/") ||
      value === "." ||
      value === ".."
    ){
      throw new Error(`Invalid Firestore path segment: ${segment}`);
    }

    return value;
}

export function buildFirestorePath(
  ...segments: readonly string[]
): string {
  if (segments.length === 0) {
    throw new Error("At least one Firestore path segment is required.");
  }

    return segments.map(normalizeSegment).join("/");
}

export function isDocumentPath(path: string): boolean {
 const segments = path.split("/").filter(Boolean);

    return segments.length > 0 && segments.length % 2 === 0;

}

export function isCollectionPath(path: string): boolean {
 const segments = path.split("/").filter(Boolean);

    return segments.length > 0 && segments.length % 2 === 1;
}
