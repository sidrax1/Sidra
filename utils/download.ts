export function downloadBlob(
  blob: Blob,
  fileName: string
): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = fileName;
    anchor.rel = "noopener";
    anchor.style.display = "none";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
}

export function downloadText(
  content: string,
  fileName: string,
  mimeType = "text/plain;charset=utf-8"
): void {
  downloadBlob(
    new Blob([content], {
      type: mimeType,
    }),
    fileName

    );
}

export function downloadJson(
  value: unknown,
  fileName: string
): void {
  downloadText(
    JSON.stringify(value, null, 2),
    fileName,
    "application/json;charset=utf-8"
  );
}
