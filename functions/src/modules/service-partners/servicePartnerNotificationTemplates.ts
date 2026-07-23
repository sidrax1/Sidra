export interface ServicePartnerNotificationTemplate {
  readonly title: string;
  readonly body: string;
  readonly type: string;
  readonly actionURL: string;
}

interface TemplateContext {
  readonly partnerId?: string;
  readonly partnerName?: string;
  readonly partnerNumber?: string;
  readonly assignmentId?: string;
  readonly assignmentNumber?: string;
  readonly applicationId?: string;
  readonly applicationNumber?: string;
}

function requiredValue(
  value: string | undefined,
  label: string
): string {
  if (!value?.trim()) {
    throw new Error(
      `${label} is required for this notification template.`
    );
  }

  return value.trim();
}

export function buildPartnerApprovedNotification(
  context: TemplateContext
): ServicePartnerNotificationTemplate {
  const partnerNumber =
    requiredValue(
      context.partnerNumber,
      "Partner number"
    );

  return {
    title:
      "Service Partner Approved",
    body: `Your Sidra service-partner profile ${partnerNumber} has been approved and activated.`,
    type:
      "servicePartnerApproved",
    actionURL: "/partner",
  };
}

export function buildAssignmentCreatedNotification(
  context: TemplateContext
): ServicePartnerNotificationTemplate {
  const assignmentId =
    requiredValue(
      context.assignmentId,
      "Assignment ID"
    );

  const assignmentNumber =
    requiredValue(
      context.assignmentNumber,
      "Assignment number"
    );

  return {
    title:
      "New Service Assignment",
    body: `Assignment ${assignmentNumber} is ready for your review.`,
    type:
      "servicePartnerAssignmentCreated",
    actionURL:
      `/partner/assignments/${assignmentId}`,
  };
}

export function buildAssignmentStatusNotification(
  context: TemplateContext,
  status: string
): ServicePartnerNotificationTemplate {
  const assignmentId =
    requiredValue(
      context.assignmentId,
      "Assignment ID"
    );

  const assignmentNumber =
    requiredValue(
      context.assignmentNumber,
      "Assignment number"
    );

  const normalizedStatus =
    status
      .replace(
        /([A-Z])/g,
        " $1"
      )
      .trim()
      .toLowerCase();

  return {
    title:
      "Service Assignment Updated",
    body: `Assignment ${assignmentNumber} is now ${normalizedStatus}.`,
    type:
      "servicePartnerAssignmentStatusUpdated",
    actionURL:
      `/account/service-assignments/${assignmentId}`,
  };
}

export function buildInformationRequiredNotification(
  context: TemplateContext
): ServicePartnerNotificationTemplate {
  const applicationId =
    requiredValue(
      context.applicationId,
      "Application ID"
    );

  const applicationNumber =
    requiredValue(
      context.applicationNumber,
      "Application number"
    );

  return {
    title:
      "Additional Information Required",
    body: `Application ${applicationNumber} requires additional documents or clarification.`,
    type:
      "servicePartnerApplicationInformationRequired",
    actionURL:
      `/account/service-partner-applications/${applicationId}`,
  };
}

export function buildVerificationExpiryNotification(
  context: TemplateContext,
  remainingDays: number
): ServicePartnerNotificationTemplate {
  const partnerId =
    requiredValue(
      context.partnerId,
      "Partner ID"
    );

  const partnerName =
    requiredValue(
      context.partnerName,
      "Partner name"
    );

  return {
    title:
      "Verification Expiry Reminder",
    body:
      remainingDays <= 0
        ? `${partnerName}'s service-partner verification has expired.`
        : `${partnerName}'s verification expires in ${remainingDays} day${
            remainingDays === 1
              ? ""
              : "s"
          }.`,
    type:
      "servicePartnerVerificationExpiry",
    actionURL:
      `/admin/service-partners/${partnerId}/verification`,
  };
}
