"use client";

import Link from "next/link";
import {
  CheckCheck,
} from "lucide-react";

import {
  NotificationCard,
} from "@/components/notifications/NotificationCard";
import {
  Button,
} from "@/components/ui/Button";
import {
  ACCOUNT_ROUTES,
} from "@/constants/routes";
import type {
  Notification,
} from "@/types/notification";

interface NotificationPopoverProps {
  readonly notifications: readonly Notification[];
  readonly unreadCount: number;
  readonly loading?: boolean;
  readonly onMarkRead: (
    notification: Notification
  ) => void | Promise<void>;
  readonly onMarkAllRead: () => void | Promise<void>;
}

export function NotificationPopover({
  loading = false,
  notifications,
  onMarkAllRead,
  onMarkRead,
  unreadCount,
}: NotificationPopoverProps): React.JSX.Element {
  return (
    <section className="w-[min(92vw,440px)] overflow-hidden rounded-[var(--radius-lg)] border
border-border bg-card shadow-[var(--shadow-modal)]">
     <header className="flex items-start justify-between gap-4 border-b border-border p-5">
      <div>
        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em]">

   Notifications
  </h2>

  <p className="mt-1 text-xs text-muted">
   {unreadCount.toLocaleString(
     "en-IN"
   )}{" "}
   unread
  </p>
 </div>

 <Button
  variant="ghost"
  size="sm"
  disabled={
    loading ||
    unreadCount === 0
  }
  onClick={() => {
    void onMarkAllRead();
  }}
 >
  <CheckCheck
    aria-hidden={true}
    className="size-4"
  />
  Mark All Read
 </Button>
</header>

<div className="max-h-[480px] overflow-y-auto p-4">
 {notifications.length > 0 ? (
  <div className="grid gap-3">
    {notifications
     .slice(0, 8)
     .map(
       (
         notification
       ) => (
         <NotificationCard
          key={
            notification.id
          }
          notification={

               notification
              }
              loading={
                loading
              }
              onMarkRead={
                onMarkRead
              }
             />
             )
           )}
         </div>
       ):(
         <p className="py-12 text-center text-sm text-muted">
          No notifications yet.
         </p>
       )}
      </div>

    <footer className="border-t border-border p-4">
     <Button
       asChild
       variant="outline"
       fullWidth
     >
       <Link
        href={
          ACCOUNT_ROUTES.NOTIFICATIONS
        }
       >
        View All Notifications
       </Link>
     </Button>
    </footer>
   </section>
 );
}
