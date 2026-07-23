"use client";

import Link from "next/link";
import {
  Bell,
  Check,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/date";
import type { Notification } from "@/types/notification";

interface NotificationItemProps {
  readonly notification: Notification;
  readonly loading?: boolean;
  readonly onMarkRead?: (
    notification: Notification
  ) => void | Promise<void>;
}

export function NotificationItem({
  loading = false,
  notification,
  onMarkRead,
}: NotificationItemProps): React.JSX.Element {
  const content = (
    <div className="min-w-0 flex-1">
     <div className="flex flex-wrap items-center gap-3">
      <h3 className="font-medium text-foreground">
        {notification.title}
      </h3>

    {!notification.read ? (
      <span
       aria-label="Unread"
       className="size-2 rounded-full bg-[var(--color-gold-500)]
shadow-[var(--shadow-gold-glow)]"
      />

    ) : null}
   </div>

   <p className="mt-2 text-sm leading-6 text-muted">
    {notification.body}
   </p>

    <p className="mt-3 text-xs text-muted">
     {formatDateTime(
       notification.createdAt
     )}
    </p>
   </div>
 );

 return (
  <article
    className={cn(
      "flex gap-4 rounded-[var(--radius-md)] border p-5",
      "transition-[border-color,background-color] duration-[var(--duration-base)]",
      notification.read
        ? "border-border bg-card"
        : "border-[color:rgb(200_169_106_/_0.35)] bg-[color:rgb(200_169_106_/_0.06)]"
    )}
  >
    <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-border bg-background text-[var(--color-gold-600)]">
      <Bell
        aria-hidden={true}
        className="size-5"
      />
    </span>

   {notification.actionURL ? (
    <Link
     href={
       notification.actionURL
     }
     className="min-w-0 flex-1"
    >
     {content}
    </Link>
   ):(
    content

      )}

    {!notification.read &&
    onMarkRead ? (
      <Button
        variant="ghost"
        size="sm"
        disabled={loading}
        onClick={() => {
          void onMarkRead(
            notification
          );
        }}
      >
        <Check
          aria-hidden={true}
          className="size-4"
        />
        Mark Read
      </Button>
    ) : null}
   </article>
 );
}
