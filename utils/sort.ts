export type SortDirection = "asc" | "desc";

export function compareStrings(
  left: string,
  right: string,
  direction: SortDirection = "asc"
): number {
  const comparison = left.localeCompare(right, "en-IN", {
    sensitivity: "base",
    numeric: true,
  });

    return direction === "asc" ? comparison : -comparison;
}

export function compareNumbers(
  left: number,
  right: number,
  direction: SortDirection = "asc"
): number {

    const comparison = left - right;

    return direction === "asc" ? comparison : -comparison;
}

export function sortBy<T>(
  items: readonly T[],
  selector: (item: T) => string | number,
  direction: SortDirection = "asc"
): T[] {
  return [...items].sort((left, right) => {
    const leftValue = selector(left);
    const rightValue = selector(right);

      if (
        typeof leftValue === "number" &&
        typeof rightValue === "number"
      ){
        return compareNumbers(leftValue, rightValue, direction);
      }

      return compareStrings(
        String(leftValue),
        String(rightValue),
        direction
      );
    });
}
