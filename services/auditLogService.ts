import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { COLLECTIONS } from "@/constants/collections";
import { getFirebaseFirestore } from "@/firebase/firestore";
import type { AuditLog } from "@/types/audit-log";

export interface AuditLogFilters {
  readonly actorId?: string;
  readonly entityType?: string;
  readonly entityId?: string;
  readonly studioId?: string;
  readonly action?: string;
}

export async function getAuditLogs(
  filters: AuditLogFilters = {},
  maximumResults = 100
): Promise<AuditLog[]> {
  const constraints = [
    ...(
      filters.actorId
        ?[
            where(
              "actorId",
              "==",
              filters.actorId
            ),
          ]

   : []
),
...(
  filters.entityType
    ?[
        where(
          "entityType",
          "==",
          filters.entityType
        ),
      ]
    : []
),
...(
  filters.entityId
    ?[
        where(
          "entityId",
          "==",
          filters.entityId
        ),
      ]
    : []
),
...(
  filters.studioId
    ?[
        where(
          "studioId",
          "==",
          filters.studioId
        ),
      ]
    : []
),
...(
  filters.action
    ?[
        where(
          "action",
          "==",
          filters.action
        ),
      ]

      : []
   ),
   orderBy("createdAt", "desc"),
   limit(
     Math.min(
       Math.max(
         maximumResults,
         1
       ),
       250
     )
   ),
 ];

 const snapshot = await getDocs(
   query(
     collection(
       getFirebaseFirestore(),
       COLLECTIONS.AUDIT_LOGS
     ),
     ...constraints
   )
 );

 return snapshot.docs.map(
   (auditDocument) =>
    ({
      id: auditDocument.id,
      ...auditDocument.data(),
    }) as AuditLog
 );
}
