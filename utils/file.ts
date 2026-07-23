export function getFileExtension(fileName: string): string {
  const normalized = fileName.trim();

    const index = normalized.lastIndexOf(".");

    if (index <= 0 || index === normalized.length - 1) {
      return "";
    }

    return normalized.slice(index + 1).toLowerCase();
}

export function removeFileExtension(fileName: string): string {
 const index = fileName.lastIndexOf(".");

    return index > 0 ? fileName.slice(0, index) : fileName;
}

export function sanitizeFileName(fileName: string): string {
 const extension = getFileExtension(fileName);
 const base = removeFileExtension(fileName)
  .normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80);

    const safeBase = base || "file";

    return extension ? `${safeBase}.${extension}` : safeBase;
}

export function bytesToReadableSize(bytes: number): string {
 if (!Number.isFinite(bytes) || bytes < 0) {
   throw new RangeError("bytes must be a non-negative number.");
 }

    if (bytes === 0) {
      return "0 B";
    }

    const units = ["B", "KB", "MB", "GB", "TB"];
    const unitIndex = Math.min(
      Math.floor(Math.log(bytes) / Math.log(1024)),
      units.length - 1
    );

 const value = bytes / 1024 ** unitIndex;

 return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}
