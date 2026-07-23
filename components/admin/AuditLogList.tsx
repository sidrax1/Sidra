import { AuditLogCard } from "@/components/admin/AuditLogCard";
import { EmptyState } from "@/components/ui/EmptyState";
import type { AuditLog } from "@/types/audit-log";

interface AuditLogListProps {
  readonly logs: readonly AuditLog[];
  readonly actorNames?: Readonly<Record<string, string>>;
}

export function AuditLogList({
  actorNames,
  logs,
}: AuditLogListProps): React.JSX.Element {
  if (logs.length === 0) {
    return (
      <EmptyState
        title="No audit activity"
        description="Administrative and security-sensitive actions will appear here."
      />
    );
  }

 return (
   <div className="grid gap-4">
    {logs.map((log) => (
      <AuditLogCard
        key={log.id}
        log={log}
        actorName={actorNames?.[log.actorId]}
      />
    ))}
   </div>
 );
}
