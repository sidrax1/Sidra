import {
  Timestamp,
  type Transaction,
} from "firebase-admin/firestore";

import {
  firestore,
  type AuthenticatedActor,
} from "./servicePartnerRepository";
import type {
  CreateServicePartnerEventInput,
  SerializedServicePartnerEvent,
  ServicePartnerEventDocument,
} from "./servicePartnerEventTypes";

export async function createServicePartnerEvent(
  actor: AuthenticatedActor,
  input: CreateServicePartnerEventInput,
  transaction?: Transaction
): Promise<string> {
  const reference =
    firestore
      .collection(
        "servicePartnerEvents"
      )
      .doc();

  const now =
    Timestamp.now();

  const document: ServicePartnerEventDocument =
    {
      eventType:
        input.eventType,
      entityType:
        input.entityType,
      entityId:
        input.entityId,
      partnerId:
        input.partnerId,
      applicationId:
        input.applicationId,
      assignmentId:
        input.assignmentId,
      actorId: actor.uid,
      actorEmail:
        actor.email,
      actorRole:
        actor.role,
      title:
        input.title,
      description:
        input.description,
      severity:
        input.severity,
      metadata:
        input.metadata ?? {},
      occurredAt: now,
      createdAt: now,
    };

  if (transaction) {
    transaction.create(
      reference,
      document
    );
  } else {
    await reference.create(
      document
    );
  }

  return reference.id;
}

export function serializeServicePartnerEvent(
  id: string,
  document: ServicePartnerEventDocument
): SerializedServicePartnerEvent {
  return {
    id,
    eventType:
      document.eventType,
    entityType:
      document.entityType,
    entityId:
      document.entityId,
    partnerId:
      document.partnerId,
    applicationId:
      document.applicationId,
    assignmentId:
      document.assignmentId,
    actorId:
      document.actorId,
    actorEmail:
      document.actorEmail,
    actorRole:
      document.actorRole,
    title: document.title,
    description:
      document.description,
    severity:
      document.severity,
    metadata:
      document.metadata,
    occurredAt:
      document.occurredAt
        .toDate()
        .toISOString(),
    createdAt:
      document.createdAt
        .toDate()
        .toISOString(),
  };
}
