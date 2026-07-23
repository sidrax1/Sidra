export function uniqueBy<T, K>(

  items: readonly T[],
  selector: (item: T) => K
): T[] {
  const seen = new Set<K>();
  const result: T[] = [];

    for (const item of items) {
     const key = selector(item);

        if (!seen.has(key)) {
          seen.add(key);
          result.push(item);
        }
    }

    return result;
}

export function chunkArray<T>(
  items: readonly T[],
  size: number
): T[][] {
  if (!Number.isInteger(size) || size < 1) {
    throw new RangeError("size must be a positive integer.");
  }

    const chunks: T[][] = [];

    for (let index = 0; index < items.length; index += size) {
      chunks.push(items.slice(index, index + size));
    }

    return chunks;
}

export function moveItem<T>(
  items: readonly T[],
  fromIndex: number,
  toIndex: number
): T[] {
  if (
    !Number.isInteger(fromIndex) ||
    !Number.isInteger(toIndex) ||
    fromIndex < 0 ||

      toIndex < 0 ||
      fromIndex >= items.length ||
      toIndex >= items.length
    ){
      throw new RangeError("Invalid array index.");
    }

    const result = [...items];
    const [item] = result.splice(fromIndex, 1);

    if (item === undefined) {
      return result;
    }

    result.splice(toIndex, 0, item);

    return result;
}

export function groupBy<T, K extends PropertyKey>(
  items: readonly T[],
  selector: (item: T) => K
): Record<K, T[]> {
  return items.reduce(
    (groups, item) => {
     const key = selector(item);

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);

        return groups;
      },
      {} as Record<K, T[]>
    );
}
