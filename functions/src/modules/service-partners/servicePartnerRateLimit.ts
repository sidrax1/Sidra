import {
  FieldValue,
  Timestamp,
} from "firebase-admin/firestore";
import {
  HttpsError,
} from "firebase-functions/v2/https";

import {
  firestore,
} from "./servicePartnerRepository";

interface RateLimitOptions {
  readonly actorId: string;
  readonly action: string;
  readonly maximumAttempts: number;
  readonly windowSeconds: number;
}

interface RateLimitDocument {
  readonly attempts: number;
  readonly windowStartedAt: Timestamp;
  readonly expiresAt: Timestamp;
  readonly updatedAt: Timestamp;
}

export async function enforceServicePartnerRateLimit({
  action,
  actorId,
  maximumAttempts,
  windowSeconds,
}: RateLimitOptions): Promise<void> {
  const normalizedAction = action
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .slice(0, 100);

  const reference = firestore
    .collection(
      "servicePartnerRateLimits"
    )
    .doc(
      `${actorId}_${normalizedAction}`
    );

  await firestore.runTransaction(
    async (transaction) => {
      const snapshot =
        await transaction.get(
          reference
        );

      const now = Timestamp.now();
      const windowMilliseconds =
        windowSeconds * 1000;

      if (!snapshot.exists) {
        const expiresAt =
          Timestamp.fromMillis(
            now.toMillis() +
              windowMilliseconds
          );

        transaction.create(
          reference,
          {
            actorId,
            action:
              normalizedAction,
            attempts: 1,
            windowStartedAt:
              now,
            expiresAt,
            createdAt: now,
            updatedAt: now,
          }
        );

        return;
      }

      const current =
        snapshot.data() as RateLimitDocument;

      const windowExpired =
        current.expiresAt.toMillis() <=
        now.toMillis();

      if (windowExpired) {
        const expiresAt =
          Timestamp.fromMillis(
            now.toMillis() +
              windowMilliseconds
          );

        transaction.set(
          reference,
          {
            actorId,
            action:
              normalizedAction,
            attempts: 1,
            windowStartedAt:
              now,
            expiresAt,
            createdAt:
              FieldValue.serverTimestamp(),
            updatedAt: now,
          },
          {
            merge: false,
          }
        );

        return;
      }

      if (
        current.attempts >=
        maximumAttempts
      ) {
        const retryAfterSeconds =
          Math.max(
            Math.ceil(
              (current.expiresAt.toMillis() -
                now.toMillis()) /
                1000
            ),
            1
          );

        throw new HttpsError(
          "resource-exhausted",
          "Too many requests. Please try again later.",
          {
            action:
              normalizedAction,
            retryAfterSeconds,
          }
        );
      }

      transaction.update(
        reference,
        {
          attempts:
            FieldValue.increment(
              1
            ),
          updatedAt: now,
        }
      );
    }
  );
}

export async function clearServicePartnerRateLimit(
  actorId: string,
  action: string
): Promise<void> {
  const normalizedAction = action
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9:_-]+/g, "-")
    .slice(0, 100);

  await firestore
    .collection(
      "servicePartnerRateLimits"
    )
    .doc(
      `${actorId}_${normalizedAction}`
    )
    .delete();
}
