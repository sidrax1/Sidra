import {
  HttpsError,
} from "firebase-functions/v2/https";

import type {
  CalculateServicePartnerSettlementInput,
  CreateServicePartnerSettlementInput,
  MarkServicePartnerSettlementFailedInput,
  MarkServicePartnerSettlementPaidInput,
  ReviewServicePartnerSettlementInput,
  ServicePartnerSettlementCycle,
  ServicePartnerSettlementPaymentMethod,
} from "./servicePartnerSettlementTypes";

function invalid(
  message: string,
  details?: unknown
): never {
  throw new HttpsError(
    "invalid-argument",
    message,
    details
  );
}

function requireObject(
  value: unknown,
  label: string
): Record<string, unknown> {
  if (
    typeof value !== "object" ||
    value === null ||
    Array.isArray(value)
  ) {
    invalid(
      `${label} must be an object.`
    );
  }

  return value as Record<
    string,
    unknown
  >;
}

function requireString(
  value: unknown,
  label: string,
  minimumLength = 1,
  maximumLength = 2000
): string {
  if (
    typeof value !== "string"
  ) {
    invalid(
      `${label} must be a string.`
    );
  }

  const normalized =
    value.trim();

  if (
    normalized.length <
      minimumLength ||
    normalized.length >
      maximumLength
  ) {
    invalid(
      `${label} must contain between ${minimumLength} and ${maximumLength} characters.`
    );
  }

  return normalized;
}

function optionalString(
  value: unknown,
  label: string,
  maximumLength = 2000
): string | undefined {
  if (
    value === undefined ||
    value === null ||
    value === ""
  ) {
    return undefined;
  }

  return requireString(
    value,
    label,
    1,
    maximumLength
  );
}

function parseISODate(
  value: unknown,
  label: string
): string {
  const normalized =
    requireString(
      value,
      label,
      20,
      40
    );

  const timestamp =
    Date.parse(normalized);

  if (
    Number.isNaN(timestamp)
  ) {
    invalid(
      `${label} must be a valid ISO date-time value.`
    );
  }

  return new Date(
    timestamp
  ).toISOString();
}

function validateCycle(
  value: unknown
): ServicePartnerSettlementCycle {
  const cycle =
    requireString(
      value,
      "Settlement cycle"
    ) as ServicePartnerSettlementCycle;

  if (
    ![
      "weekly",
      "fortnightly",
      "monthly",
      "manual",
    ].includes(cycle)
  ) {
    invalid(
      "Settlement cycle is invalid."
    );
  }

  return cycle;
}

function validatePaymentMethod(
  value: unknown
): ServicePartnerSettlementPaymentMethod {
  const paymentMethod =
    requireString(
      value,
      "Payment method"
    ) as ServicePartnerSettlementPaymentMethod;

  if (
    ![
      "bankTransfer",
      "upi",
      "manualBankTransfer",
    ].includes(
      paymentMethod
    )
  ) {
    invalid(
      "Settlement payment method is invalid."
    );
  }

  return paymentMethod;
}

function validatePeriod(
  input: Record<string, unknown>
): {
  readonly periodStart: string;
  readonly periodEnd: string;
} {
  const periodStart =
    parseISODate(
      input.periodStart,
      "Settlement period start"
    );

  const periodEnd =
    parseISODate(
      input.periodEnd,
      "Settlement period end"
    );

  const startTimestamp =
    Date.parse(periodStart);

  const endTimestamp =
    Date.parse(periodEnd);

  if (
    startTimestamp >=
    endTimestamp
  ) {
    invalid(
      "Settlement period end must be after the start date."
    );
  }

  if (
    endTimestamp >
    Date.now()
  ) {
    invalid(
      "Settlement period cannot end in the future."
    );
  }

  const periodLengthDays =
    Math.ceil(
      (endTimestamp -
        startTimestamp) /
        86_400_000
    );

  if (
    periodLengthDays > 370
  ) {
    invalid(
      "Settlement period cannot exceed 370 days."
    );
  }

  return {
    periodStart,
    periodEnd,
  };
}

export function validateCalculateSettlementInput(
  value: unknown
): CalculateServicePartnerSettlementInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const period =
    validatePeriod(input);

  return {
    partnerId:
      requireString(
        input.partnerId,
        "Partner ID",
        1,
        200
      ),
    periodStart:
      period.periodStart,
    periodEnd:
      period.periodEnd,
    cycle:
      validateCycle(
        input.cycle
      ),
    includePendingAdjustments:
      input.includePendingAdjustments ===
        undefined
        ? true
        : Boolean(
            input.includePendingAdjustments
          ),
  };
}

export function validateCreateSettlementInput(
  value: unknown
): CreateServicePartnerSettlementInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const calculation =
    validateCalculateSettlementInput(
      input
    );

  return {
    ...calculation,
    reviewNote:
      optionalString(
        input.reviewNote,
        "Review note",
        2000
      ),
  };
}

export function validateReviewSettlementInput(
  value: unknown
): ReviewServicePartnerSettlementInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const decision =
    requireString(
      input.decision,
      "Settlement decision"
    );

  if (
    ![
      "approve",
      "hold",
      "cancel",
    ].includes(decision)
  ) {
    invalid(
      "Settlement review decision is invalid."
    );
  }

  return {
    settlementId:
      requireString(
        input.settlementId,
        "Settlement ID",
        1,
        200
      ),
    decision:
      decision as ReviewServicePartnerSettlementInput["decision"],
    note:
      requireString(
        input.note,
        "Review note",
        10,
        2500
      ),
  };
}

export function validateMarkSettlementPaidInput(
  value: unknown
): MarkServicePartnerSettlementPaidInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  return {
    settlementId:
      requireString(
        input.settlementId,
        "Settlement ID",
        1,
        200
      ),
    paymentMethod:
      validatePaymentMethod(
        input.paymentMethod
      ),
    paymentReference:
      requireString(
        input.paymentReference,
        "Payment reference",
        3,
        200
      ),
    paymentProvider:
      optionalString(
        input.paymentProvider,
        "Payment provider",
        120
      ),
    paidAt:
      input.paidAt
        ? parseISODate(
            input.paidAt,
            "Paid date"
          )
        : undefined,
  };
}

export function validateMarkSettlementFailedInput(
  value: unknown
): MarkServicePartnerSettlementFailedInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  return {
    settlementId:
      requireString(
        input.settlementId,
        "Settlement ID",
        1,
        200
      ),
    failureReason:
      requireString(
        input.failureReason,
        "Payment failure reason",
        10,
        2000
      ),
  };
}
