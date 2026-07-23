import { SessionCard, type UserSession } from "@/components/account/SessionCard";
import { EmptyState } from "@/components/ui/EmptyState";

interface SessionListProps {
  readonly sessions: readonly UserSession[];
  readonly loading?: boolean;
  readonly onRevoke?: (
    session: UserSession
  ) => void | Promise<void>;
}

export function SessionList({

  loading = false,
  onRevoke,
  sessions,
}: SessionListProps): React.JSX.Element {
  if (sessions.length === 0) {
    return (
      <EmptyState
       title="No active sessions"
       description="No signed-in devices were found for this account."
      />
    );
  }

 return (
   <div className="grid gap-4">
    {sessions.map((session) => (
      <SessionCard
        key={session.id}
        session={session}
        loading={loading}
        onRevoke={onRevoke}
      />
    ))}
   </div>
 );
}
