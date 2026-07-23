const MIME_EXTENSION_MAP: Readonly<Record<string, string>> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "application/pdf": "pdf",
};

export function getExtensionFromMimeType(
  mimeType: string
): string | null {
  return MIME_EXTENSION_MAP[mimeType.toLowerCase()] ?? null;
}

export function isImageMimeType(mimeType: string): boolean {
  return mimeType.toLowerCase().startsWith("image/");
}

export function isVideoMimeType(mimeType: string): boolean {
  return mimeType.toLowerCase().startsWith("video/");
}

export function isPdfMimeType(mimeType: string): boolean {
  return mimeType.toLowerCase() === "application/pdf";
}

export function isAllowedMimeType(
  mimeType: string,
  allowedTypes: readonly string[]
): boolean {

    return allowedTypes.includes(mimeType.toLowerCase());
}
