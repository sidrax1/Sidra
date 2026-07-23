export function normalizeSearchText(value: string): string {
  return value
   .normalize("NFKD")
   .replace(/[\u0300-\u036f]/g, "")
   .toLocaleLowerCase("en-IN")
   .replace(/[^a-z0-9\s-]/g, " ")
   .replace(/\s+/g, " ")
   .trim();
}

export function createSearchTokens(
  value: string,
  minimumTokenLength = 2
): string[] {
  const normalized = normalizeSearchText(value);

    if (!normalized) {
      return [];
    }

    return Array.from(
      new Set(
        normalized
         .split(" ")
         .filter((token) => token.length >= minimumTokenLength)
      )
    );
}

export function createSearchPrefixes(
  value: string,
  minimumLength = 2,
  maximumLength = 20
): string[] {
  const normalized = normalizeSearchText(value).replace(/\s+/g, "");

    const upperBound = Math.min(normalized.length, maximumLength);
    const prefixes: string[] = [];

    for (let length = minimumLength; length <= upperBound; length += 1) {

        prefixes.push(normalized.slice(0, length));
    }

    return prefixes;
}
