import type { ReactNode } from "react";

import { AdminUserRow } from "@/components/admin/AdminUserRow";
import { EmptyState } from "@/components/ui/EmptyState";
import type { User } from "@/types/user";

interface AdminUserListProps {
  readonly users: readonly User[];
  readonly loadingUserIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onView: (user: User) => void;
  readonly onChangeRole: (user: User) => void;

    readonly onSuspend: (user: User) => void | Promise<void>;
}

export function AdminUserList({
  emptyAction,
  loadingUserIds,
  onChangeRole,
  onSuspend,
  onView,
  users,
}: AdminUserListProps): React.JSX.Element {
  if (users.length === 0) {
    return (
      <EmptyState
       title="No users found"
       description="No user accounts match the selected filters."
       action={emptyAction}
      />
    );
  }

    return (
      <div className="grid gap-4">
       {users.map((user) => (
         <AdminUserRow
           key={user.id}
           user={user}
           loading={loadingUserIds?.has(user.id) ?? false}
           onView={onView}
           onChangeRole={onChangeRole}
           onSuspend={onSuspend}
         />
       ))}
      </div>
    );
}
