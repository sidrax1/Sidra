import {
  HttpsError,
} from "firebase-functions/v2/https";

import type {
  AssignServicePartnerInput,
  CreateServicePartnerApplicationInput,
  ReviewServicePartnerApplicationInput,
  ServicePartnerAddress,
  ServicePartnerCapability,
  ServicePartnerContact,
  ServicePartnerStatus,
  ServicePartnerType,
  UpdateServiceAssignmentStatusInput,
  UpdateServicePartnerAvailabilityInput,
  UpdateServicePartnerStatusInput,
} from "./servicePartnerTypes";

const servicePartnerTypes =
  new Set<ServicePartnerType>([
    "repairStudio",
    "inspectionCentre",
    "logisticsPartner",
    "installationPartner",
    "restorationSpecialist",
    "qualityAssuranceCentre",
    "multiServicePartner",
  ]);

const serviceCapabilities =
  new Set<ServicePartnerCapability>([
    "productInspection",
    "resinRepair",
    "surfaceRestoration",
    "structuralRepair",
    "hardwareReplacement",
    "electricalRepair",
    "customisationCorrection",
    "pickup",
    "reverseLogistics",
    "replacementDelivery",
    "onSiteService",
    "remoteAssessment",
    "qualityCertification",
    "securePackaging",
  ]);

const partnerStatuses =
  new Set<ServicePartnerStatus>([
    "pendingVerification",
    "active",
    "temporarilyUnavailable",
    "suspended",
    "rejected",
    "archived",
  ]);

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
  maximumLength = 5000
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
  maximumLength = 5000
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

function requireInteger(
  value: unknown,
  label: string,
  minimum: number,
  maximum: number
): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < minimum ||
    value > maximum
  ) {
    invalid(
      `${label} must be an integer between ${minimum} and ${maximum}.`
    );
  }

  return value;
}

function requireBoolean(
  value: unknown,
  label: string
): boolean {
  if (
    typeof value !== "boolean"
  ) {
    invalid(
      `${label} must be a boolean.`
    );
  }

  return value;
}

function validatePhoneNumber(
  value: unknown,
  label: string
): string {
  const normalized =
    requireString(
      value,
      label,
      10,
      10
    );

  if (
    !/^[6-9]\d{9}$/.test(
      normalized
    )
  ) {
    invalid(
      `${label} must be a valid Indian mobile number.`
    );
  }

  return normalized;
}

function validateEmail(
  value: unknown,
  label: string
): string {
  const normalized =
    requireString(
      value,
      label,
      3,
      254
    ).toLowerCase();

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      normalized
    )
  ) {
    invalid(
      `${label} must be a valid email address.`
    );
  }

  return normalized;
}

function validateDateTime(
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

function validateAddress(
  value: unknown
): ServicePartnerAddress {
  const address =
    requireObject(
      value,
      "registeredAddress"
    );

  const postalCode =
    requireString(
      address.postalCode,
      "Postal code",
      6,
      6
    );

  if (
    !/^[1-9]\d{5}$/.test(
      postalCode
    )
  ) {
    invalid(
      "Postal code must be a valid six-digit Indian postal code."
    );
  }

  if (
    address.countryCode !== "IN"
  ) {
    invalid(
      "Only Indian service-partner addresses are currently supported."
    );
  }

  return {
    fullName: requireString(
      address.fullName,
      "Address contact name",
      2,
      120
    ),
    phoneNumber:
      validatePhoneNumber(
        address.phoneNumber,
        "Address phone number"
      ),
    addressLine1:
      requireString(
        address.addressLine1,
        "Address line 1",
        5,
        200
      ),
    addressLine2:
      optionalString(
        address.addressLine2,
        "Address line 2",
        200
      ),
    landmark:
      optionalString(
        address.landmark,
        "Landmark",
        160
      ),
    city: requireString(
      address.city,
      "City",
      2,
      100
    ),
    district:
      optionalString(
        address.district,
        "District",
        100
      ),
    state: requireString(
      address.state,
      "State",
      2,
      100
    ),
    postalCode,
    countryCode: "IN",
  };
}

function validateContact(
  value: unknown
): ServicePartnerContact {
  const contact =
    requireObject(
      value,
      "contact"
    );

  const websiteURL =
    optionalString(
      contact.websiteURL,
      "Website URL",
      500
    );

  if (websiteURL) {
    try {
      const parsedURL =
        new URL(websiteURL);

      if (
        ![
          "https:",
          "http:",
        ].includes(
          parsedURL.protocol
        )
      ) {
        invalid(
          "Website URL must use HTTP or HTTPS."
        );
      }
    } catch {
      invalid(
        "Website URL is invalid."
      );
    }
  }

  return {
    contactName:
      requireString(
        contact.contactName,
        "Contact name",
        2,
        120
      ),
    designation:
      optionalString(
        contact.designation,
        "Designation",
        120
      ),
    email: validateEmail(
      contact.email,
      "Contact email"
    ),
    phoneNumber:
      validatePhoneNumber(
        contact.phoneNumber,
        "Contact phone number"
      ),
    alternatePhoneNumber:
      contact.alternatePhoneNumber
        ? validatePhoneNumber(
            contact.alternatePhoneNumber,
            "Alternate phone number"
          )
        : undefined,
    websiteURL,
  };
}

function validateStringArray(
  value: unknown,
  label: string,
  minimumItems: number,
  maximumItems: number
): readonly string[] {
  if (!Array.isArray(value)) {
    invalid(
      `${label} must be an array.`
    );
  }

  if (
    value.length <
      minimumItems ||
    value.length >
      maximumItems
  ) {
    invalid(
      `${label} must contain between ${minimumItems} and ${maximumItems} items.`
    );
  }

  const normalized =
    value.map(
      (
        item,
        index
      ) =>
        requireString(
          item,
          `${label} item ${index + 1}`,
          1,
          500
        )
    );

  if (
    new Set(
      normalized.map((item) =>
        item.toLowerCase()
      )
    ).size !==
    normalized.length
  ) {
    invalid(
      `${label} cannot contain duplicate values.`
    );
  }

  return normalized;
}

export function validateCreateApplicationInput(
  value: unknown
): CreateServicePartnerApplicationInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const partnerType =
    requireString(
      input.partnerType,
      "Partner type"
    ) as ServicePartnerType;

  if (
    !servicePartnerTypes.has(
      partnerType
    )
  ) {
    invalid(
      "Partner type is invalid."
    );
  }

  const capabilities =
    validateStringArray(
      input.capabilities,
      "Capabilities",
      1,
      14
    ) as readonly ServicePartnerCapability[];

  for (const capability of
    capabilities) {
    if (
      !serviceCapabilities.has(
        capability
      )
    ) {
      invalid(
        `Unsupported service capability: ${capability}.`
      );
    }
  }

  return {
    legalName: requireString(
      input.legalName,
      "Legal name",
      2,
      180
    ),
    displayName:
      requireString(
        input.displayName,
        "Display name",
        2,
        120
      ),
    partnerType,
    description:
      requireString(
        input.description,
        "Business description",
        50,
        5000
      ),
    contact: validateContact(
      input.contact
    ),
    registeredAddress:
      validateAddress(
        input.registeredAddress
      ),
    capabilities,
    coverageStates:
      validateStringArray(
        input.coverageStates,
        "Coverage states",
        1,
        36
      ),
    documentPaths:
      validateStringArray(
        input.documentPaths,
        "Document paths",
        1,
        25
      ),
  };
}

export function validateReviewApplicationInput(
  value: unknown
): ReviewServicePartnerApplicationInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const decision =
    requireString(
      input.decision,
      "Decision"
    );

  if (
    ![
      "approve",
      "requestInformation",
      "reject",
    ].includes(decision)
  ) {
    invalid(
      "Application decision is invalid."
    );
  }

  return {
    applicationId:
      requireString(
        input.applicationId,
        "Application ID",
        1,
        200
      ),
    decision:
      decision as ReviewServicePartnerApplicationInput["decision"],
    reviewerNote:
      requireString(
        input.reviewerNote,
        "Reviewer note",
        20,
        3000
      ),
    riskScore:
      requireInteger(
        input.riskScore,
        "Risk score",
        0,
        100
      ),
  };
}

export function validateUpdateStatusInput(
  value: unknown
): UpdateServicePartnerStatusInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const status =
    requireString(
      input.status,
      "Partner status"
    ) as ServicePartnerStatus;

  if (
    !partnerStatuses.has(
      status
    )
  ) {
    invalid(
      "Partner status is invalid."
    );
  }

  return {
    partnerId:
      requireString(
        input.partnerId,
        "Partner ID",
        1,
        200
      ),
    status,
    reason: requireString(
      input.reason,
      "Status reason",
      10,
      2500
    ),
  };
}

export function validateAvailabilityInput(
  value: unknown
): UpdateServicePartnerAvailabilityInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  return {
    partnerId:
      requireString(
        input.partnerId,
        "Partner ID",
        1,
        200
      ),
    acceptingAssignments:
      requireBoolean(
        input.acceptingAssignments,
        "Accepting assignments"
      ),
    maximumConcurrentAssignments:
      requireInteger(
        input.maximumConcurrentAssignments,
        "Maximum concurrent assignments",
        1,
        500
      ),
    reason:
      optionalString(
        input.reason,
        "Availability reason",
        1000
      ),
  };
}

export function validateAssignPartnerInput(
  value: unknown
): AssignServicePartnerInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const capability =
    requireString(
      input.capability,
      "Capability"
    ) as ServicePartnerCapability;

  if (
    !serviceCapabilities.has(
      capability
    )
  ) {
    invalid(
      "Assignment capability is invalid."
    );
  }

  const sourceType =
    requireString(
      input.sourceType,
      "Source type"
    );

  if (
    ![
      "warrantyClaim",
      "returnInspection",
      "disputeInspection",
      "repairRequest",
      "qualityAudit",
    ].includes(sourceType)
  ) {
    invalid(
      "Assignment source type is invalid."
    );
  }

  const priority =
    requireString(
      input.priority,
      "Priority"
    );

  if (
    ![
      "low",
      "normal",
      "high",
      "urgent",
    ].includes(priority)
  ) {
    invalid(
      "Assignment priority is invalid."
    );
  }

  const responseDueAt =
    validateDateTime(
      input.responseDueAt,
      "Response deadline"
    );

  const completionDueAt =
    input.completionDueAt
      ? validateDateTime(
          input.completionDueAt,
          "Completion deadline"
        )
      : undefined;

  if (
    Date.parse(
      responseDueAt
    ) <= Date.now()
  ) {
    invalid(
      "Response deadline must be in the future."
    );
  }

  if (
    completionDueAt &&
    Date.parse(
      completionDueAt
    ) <=
      Date.parse(
        responseDueAt
      )
  ) {
    invalid(
      "Completion deadline must be after the response deadline."
    );
  }

  const approvedCostPaise =
    requireInteger(
      input.approvedCostPaise,
      "Approved cost",
      0,
      100_000_000
    );

  const platformPayablePaise =
    requireInteger(
      input.platformPayablePaise,
      "Partner payable",
      0,
      100_000_000
    );

  if (
    platformPayablePaise >
    approvedCostPaise
  ) {
    invalid(
      "Partner payable cannot exceed the approved service cost."
    );
  }

  return {
    partnerId:
      requireString(
        input.partnerId,
        "Partner ID",
        1,
        200
      ),
    sourceType:
      sourceType as AssignServicePartnerInput["sourceType"],
    sourceId:
      requireString(
        input.sourceId,
        "Source ID",
        1,
        200
      ),
    customerId:
      requireString(
        input.customerId,
        "Customer ID",
        1,
        200
      ),
    studioId:
      requireString(
        input.studioId,
        "Studio ID",
        1,
        200
      ),
    capability,
    priority:
      priority as AssignServicePartnerInput["priority"],
    title: requireString(
      input.title,
      "Assignment title",
      5,
      180
    ),
    description:
      requireString(
        input.description,
        "Assignment description",
        20,
        4000
      ),
    responseDueAt,
    completionDueAt,
    estimatedCostPaise:
      requireInteger(
        input.estimatedCostPaise,
        "Estimated cost",
        0,
        100_000_000
      ),
    approvedCostPaise,
    customerPayablePaise:
      requireInteger(
        input.customerPayablePaise,
        "Customer payable",
        0,
        100_000_000
      ),
    platformPayablePaise,
  };
}

export function validateAssignmentStatusInput(
  value: unknown
): UpdateServiceAssignmentStatusInput {
  const input =
    requireObject(
      value,
      "Request data"
    );

  const status =
    requireString(
      input.status,
      "Assignment status"
    );

  if (
    ![
      "accepted",
      "declined",
      "scheduled",
      "inProgress",
      "completed",
      "cancelled",
    ].includes(status)
  ) {
    invalid(
      "Assignment status is invalid."
    );
  }

  const scheduledAt =
    input.scheduledAt
      ? validateDateTime(
          input.scheduledAt,
          "Scheduled date"
        )
      : undefined;

  const completionNote =
    optionalString(
      input.completionNote,
      "Completion note",
      3000
    );

  if (
    status === "scheduled" &&
    !scheduledAt
  ) {
    invalid(
      "Scheduled date is required when scheduling an assignment."
    );
  }

  if (
    status === "completed" &&
    (!completionNote ||
      completionNote.length <
        10)
  ) {
    invalid(
      "A detailed completion note is required."
    );
  }

  return {
    assignmentId:
      requireString(
        input.assignmentId,
        "Assignment ID",
        1,
        200
      ),
    status:
      status as UpdateServiceAssignmentStatusInput["status"],
    note: requireString(
      input.note,
      "Activity note",
      5,
      2500
    ),
    scheduledAt,
    completionNote,
  };
}
