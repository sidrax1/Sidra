interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export interface RateLimitResult {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly resetAt: number;
}

export function checkInMemoryRateLimit(
  key: string,
  limit: number,
  windowMilliseconds: number
): RateLimitResult {
  if (!Number.isInteger(limit) || limit < 1) {
    throw new RangeError("limit must be a positive integer.");

}

if (
  !Number.isInteger(windowMilliseconds) ||
  windowMilliseconds < 1
){
  throw new RangeError(
     "windowMilliseconds must be a positive integer."
  );
}

const now = Date.now();
const current = buckets.get(key);

if (!current || current.resetAt <= now) {
  const resetAt = now + windowMilliseconds;

    buckets.set(key, {
      count: 1,
      resetAt,
    });

    return {
      allowed: true,
      remaining: limit - 1,
      resetAt,
    };
}

if (current.count >= limit) {
  return {
    allowed: false,
    remaining: 0,
    resetAt: current.resetAt,
  };
}

current.count += 1;

return {
  allowed: true,
  remaining: Math.max(0, limit - current.count),
  resetAt: current.resetAt,
};

}
