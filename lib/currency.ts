import { CURRENCY } from "@/constants/currency";

const inrFormatter = new Intl.NumberFormat(CURRENCY.LOCALE, {
  style: "currency",
  currency: CURRENCY.CODE,
  minimumFractionDigits: 0,
  maximumFractionDigits: CURRENCY.DECIMALS,
});

const compactInrFormatter = new Intl.NumberFormat(CURRENCY.LOCALE, {
  style: "currency",
  currency: CURRENCY.CODE,
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(
  amount: number,
  options?: Intl.NumberFormatOptions
): string {
  if (!Number.isFinite(amount)) {
    return inrFormatter.format(0);
  }

    if (!options) {
      return inrFormatter.format(amount);
    }

    return new Intl.NumberFormat(CURRENCY.LOCALE, {
      style: "currency",
      currency: CURRENCY.CODE,
      minimumFractionDigits: 0,
      maximumFractionDigits: CURRENCY.DECIMALS,
      ...options,
    }).format(amount);
}

export function formatCompactCurrency(amount: number): string {
 if (!Number.isFinite(amount)) {
   return compactInrFormatter.format(0);
 }

    return compactInrFormatter.format(amount);

}

export function rupeesToPaise(amount: number): number {
 if (!Number.isFinite(amount) || amount < 0) {
   throw new RangeError("Amount must be a finite, non-negative number.");
 }

    return Math.round(amount * 100);
}

export function paiseToRupees(amount: number): number {
 if (!Number.isInteger(amount) || amount < 0) {
   throw new RangeError(
     "Paise amount must be a non-negative integer."
   );
 }

    return amount / 100;
}

export function calculatePercentage(
  amount: number,
  percentage: number
): number {
  if (!Number.isFinite(amount) || !Number.isFinite(percentage)) {
    throw new TypeError("Amount and percentage must be finite numbers.");
  }

    return Math.round(((amount * percentage) / 100) * 100) / 100;
}
