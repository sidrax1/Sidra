const SENSITIVE_KEYS = new Set([
  "authorization",
  "cookie",
  "password",
  "privatekey",
  "secret",
  "session",
  "token",
]);

function shouldRedact(key: string): boolean {
 const normalized = key.toLowerCase().replace(/[^a-z]/g, "");

    return Array.from(SENSITIVE_KEYS).some((sensitiveKey) =>
      normalized.includes(sensitiveKey)
    );
}

export function redactSensitiveData(

  value: unknown
): unknown {
  if (Array.isArray(value)) {
    return value.map(redactSensitiveData);
  }

 if (typeof value === "object" && value !== null) {
   return Object.fromEntries(
     Object.entries(value).map(([key, entry]) => [
       key,
       shouldRedact(key) ? "[REDACTED]" : redactSensitiveData(entry),
     ])
   );
 }

  return value;
}
