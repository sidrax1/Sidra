function escapeCsvCell(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

    const text =
     typeof value === "object"
       ? JSON.stringify(value)
       : String(value);

    if (
      text.includes(",") ||
      text.includes('"') ||
      text.includes("\n")
    ){
      return `"${text.replace(/"/g, '""')}"`;
    }

    return text;
}

export function recordsToCsv(
  records: readonly Record<string, unknown>[]
): string {

    if (records.length === 0) {
      return "";
    }

    const headers = Array.from(
      new Set(records.flatMap((record) => Object.keys(record)))
    );

    const rows = records.map((record) =>
      headers.map((header) => escapeCsvCell(record[header])).join(",")
    );

    return [
      headers.map(escapeCsvCell).join(","),
      ...rows,
    ].join("\n");
}
