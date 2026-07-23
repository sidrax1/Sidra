import { NotificationItem } from "@/components/account/NotificationItem";
import { EmptyState } from "@/components/ui/EmptyState";
import type { Notification } from "@/types/notification";

interface NotificationListProps {
  readonly notifications: readonly Notification[];
  readonly loading?: boolean;
  readonly onMarkRead?: (
    notification: Notification
  ) => void | Promise<void>;
}

export function NotificationList({

  loading = false,
  notifications,
  onMarkRead,
}: NotificationListProps): React.JSX.Element {
  if (notifications.length === 0) {
    return (
      <EmptyState
       title="You are all caught up"
       description="Important order, account and studio updates will appear here."
      />
    );
  }

 return (
   <div className="grid gap-4">
    {notifications.map(
      (notification) => (
        <NotificationItem
         key={
           notification.id
         }
         notification={
           notification
         }
         loading={loading}
         onMarkRead={
           onMarkRead
         }
        />
      )
    )}
   </div>
 );
}
