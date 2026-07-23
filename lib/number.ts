export function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {

    if (
      !Number.isFinite(value) ||
      !Number.isFinite(minimum) ||
      !Number.isFinite(maximum)
    ){
      throw new TypeError("All values must be finite numbers.");
    }

    if (minimum > maximum) {
      throw new RangeError("minimum cannot be greater than maximum.");
    }

    return Math.min(Math.max(value, minimum), maximum);
}

export function roundTo(
  value: number,
  decimalPlaces = 2
): number {
  if (!Number.isFinite(value)) {
    throw new TypeError("value must be a finite number.");
  }

    if (
      !Number.isInteger(decimalPlaces) ||
      decimalPlaces < 0 ||
      decimalPlaces > 10
    ){
      throw new RangeError(
         "decimalPlaces must be an integer between 0 and 10."
      );
    }

    const multiplier = 10 ** decimalPlaces;

    return Math.round((value + Number.EPSILON) * multiplier) / multiplier;
}

export function calculatePercentageChange(
  previousValue: number,
  currentValue: number
): number {
  if (
    !Number.isFinite(previousValue) ||

      !Number.isFinite(currentValue)
    ){
      throw new TypeError("Values must be finite numbers.");
    }

    if (previousValue === 0) {
      return currentValue === 0 ? 0 : 100;
    }

    return roundTo(
      ((currentValue - previousValue) / Math.abs(previousValue)) * 100
    );
}

export function safeInteger(
  value: unknown,
  fallback = 0
): number {
  const parsed =
   typeof value === "number"
     ? value
     : Number.parseInt(String(value), 10);

    return Number.isSafeInteger(parsed) ? parsed : fallback;
}

export function safeNumber(
  value: unknown,
  fallback = 0
): number {
  const parsed =
   typeof value === "number"
     ? value
     : Number.parseFloat(String(value));

    return Number.isFinite(parsed) ? parsed : fallback;
}
