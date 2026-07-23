export function normalizeBaseUrl(value: string): string {
  const url = new URL(value);

    return url.toString().replace(/\/+$/, "");
}

export function buildUrl(
  baseUrl: string,
  pathname: string,
  query?: Record<
   string,
   string | number | boolean | null | undefined
  >
): string {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = pathname.startsWith("/")
   ? pathname
   : `/${pathname}`;

    const url = new URL(`${normalizedBase}${normalizedPath}`);

    if (query) {
      for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
}

export function isSafeInternalPath(value: string): boolean {
 if (!value.startsWith("/") || value.startsWith("//")) {
   return false;
 }

    try {
      const url = new URL(value, "https://sidra.com");

      return url.origin === "https://sidra.com";
    } catch {
      return false;
    }
}

export function getSafeRedirectPath(
 value: string | null | undefined,
 fallback = "/"

): string {
  if (!value || !isSafeInternalPath(value)) {
    return fallback;
  }

    return value;
}

export function getHostname(value: string): string {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}
