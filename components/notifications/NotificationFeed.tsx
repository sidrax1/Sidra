import type {
  ReactNode,
} from "react";

import {
  NotificationCard,
} from "@/components/notifications/NotificationCard";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import type {
  Notification,
} from "@/types/notification";

interface NotificationFeedProps {
  readonly notifications: readonly Notification[];
  readonly loadingNotificationIds?: ReadonlySet<string>;
  readonly emptyAction?: ReactNode;
  readonly onMarkRead?: (
    notification: Notification
  ) => void | Promise<void>;
  readonly onDelete?: (
    notification: Notification
  ) => void | Promise<void>;
}

export function NotificationFeed({
 emptyAction,
 loadingNotificationIds,
 notifications,
 onDelete,

  onMarkRead,
}: NotificationFeedProps): React.JSX.Element {
  if (notifications.length === 0) {
    return (
      <EmptyState
       title="You are all caught up"
       description="New account, order and studio updates will appear here."
       action={emptyAction}
      />
    );
  }

 return (
   <div className="grid gap-4">
    {notifications.map(
      (notification) => (
        <NotificationCard
         key={
           notification.id
         }
         notification={
           notification
         }
         loading={
           loadingNotificationIds?.has(
             notification.id
           ) ?? false
         }
         onMarkRead={
           onMarkRead
         }
         onDelete={onDelete}
        />
      )
    )}
   </div>
 );
}
