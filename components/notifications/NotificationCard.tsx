"use client";

import Link from "next/link";
import {
  Bell,
  Check,
  Trash2,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  Notification,
} from "@/types/notification";

interface NotificationCardProps {
  readonly notification: Notification;
  readonly loading?: boolean;
  readonly onMarkRead?: (
    notification: Notification
  ) => void | Promise<void>;
  readonly onDelete?: (
    notification: Notification
  ) => void | Promise<void>;
}

export function NotificationCard({
  loading = false,
  notification,
  onDelete,
  onMarkRead,
}: NotificationCardProps): React.JSX.Element {
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

    <time className="mt-3 block text-xs text-muted">
     {formatDateTime(
       notification.createdAt
     )}
    </time>
   </div>
 );

 return (
  <article
    className={cn(
      "flex gap-4 rounded-[var(--radius-lg)] border p-5",
      "transition-[border-color,background-color,box-shadow]",
      notification.read
        ? "border-border bg-card"
        : "border-[color:rgb(200_169_106_/_0.36)] bg-[color:rgb(200_169_106_/_0.06)]shadow-[var(--shadow-card)]"
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

<div className="flex shrink-0 items-start gap-1">
 {!notification.read &&
 onMarkRead ? (
   <IconButton
     label="Mark notification as read"
     icon={
       <Check aria-hidden={true} />
     }
     appearance="ghost"
     size="sm"
     disabled={loading}
     onClick={() => {
       void onMarkRead(
         notification
       );
     }}
   />
 ) : null}

 {onDelete ? (
  <IconButton
   label="Delete notification"
   icon={
     <Trash2 aria-hidden={true} />
   }
   appearance="ghost"
   size="sm"
   disabled={loading}
   className="text-[var(--color-error)]"
   onClick={() => {
     void onDelete(
       notification
     );
   }}

       />
     ) : null}
    </div>
   </article>
 );
}
