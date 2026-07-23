import { DATE } from "@/constants/date";

type DateInput = Date | string | number;

const dateFormatter = new Intl.DateTimeFormat(DATE.LOCALE, {
 day: "2-digit",
 month: "short",

  year: "numeric",
  timeZone: DATE.TIMEZONE,
});

const dateTimeFormatter = new Intl.DateTimeFormat(DATE.LOCALE, {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: DATE.TIMEZONE,
});

const timeFormatter = new Intl.DateTimeFormat(DATE.LOCALE, {
  hour: "2-digit",
  minute: "2-digit",
  hour12: true,
  timeZone: DATE.TIMEZONE,
});

function toValidDate(input: DateInput): Date | null {
 const date = input instanceof Date ? input : new Date(input);

    return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(input: DateInput): string {
 const date = toValidDate(input);

    return date ? dateFormatter.format(date) : "";
}

export function formatDateTime(input: DateInput): string {
 const date = toValidDate(input);

    return date ? dateTimeFormatter.format(date) : "";
}

export function formatTime(input: DateInput): string {
 const date = toValidDate(input);

    return date ? timeFormatter.format(date) : "";
}

export function toISOString(input: DateInput): string {
 const date = toValidDate(input);

    if (!date) {
      throw new TypeError("Invalid date value.");
    }

    return date.toISOString();
}

export function isPastDate(input: DateInput): boolean {
 const date = toValidDate(input);

    return date ? date.getTime() < Date.now() : false;
}

export function isFutureDate(input: DateInput): boolean {
 const date = toValidDate(input);

    return date ? date.getTime() > Date.now() : false;
}

export function addDays(input: DateInput, days: number): Date {
 const date = toValidDate(input);

    if (!date || !Number.isInteger(days)) {
      throw new TypeError("Invalid date or day count.");
    }

    const result = new Date(date);
    result.setUTCDate(result.getUTCDate() + days);

    return result;
}
