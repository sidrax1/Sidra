import {
  Fingerprint,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/date";
import type { AuditLog } from "@/types/audit-log";

interface AuditLogCardProps {
  readonly log: AuditLog;
  readonly actorName?: string;
}

export function AuditLogCard({
  actorName,
  log,
}: AuditLogCardProps): React.JSX.Element {
  return (
    <Card className="p-5">
     <div className="flex items-start gap-4">
       <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
        <ShieldCheck aria-hidden={true} className="size-5" />
       </span>

      <div className="min-w-0 flex-1">
       <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-medium text-foreground">
          {log.action}
        </h3>

        <Badge variant="neutral">{log.entityType}</Badge>
       </div>

       <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
        <span className="inline-flex items-center gap-2">
         <UserRound aria-hidden={true} className="size-3.5" />
         {actorName ?? log.actorId}
        </span>

        <span className="inline-flex items-center gap-2">
         <Fingerprint aria-hidden={true} className="size-3.5" />
         {log.entityId}
        </span>

        <span>{formatDateTime(log.createdAt)}</span>
       </div>

       {log.metadata ? (
         <pre className="mt-4 max-h-48 overflow-auto rounded-md border border-border
bg-background p-4 text-xs leading-6 text-muted">
           {JSON.stringify(log.metadata, null, 2)}
         </pre>
       ) : null}
      </div>
     </div>
    </Card>
  );
}
