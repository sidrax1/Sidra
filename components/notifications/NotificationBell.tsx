"use client";

import {
  Bell,
} from "lucide-react";

import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  cn,
} from "@/lib/utils";

interface NotificationBellProps {
  readonly unreadCount: number;
  readonly open?: boolean;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onClick: () => void;
}

export function NotificationBell({
  className,
  disabled = false,
  onClick,
  open = false,
  unreadCount,
}: NotificationBellProps): React.JSX.Element {
  return (
   <div

   className={cn(
     "relative inline-flex",
     className
   )}
  >
   <IconButton
     label={`Notifications${
       unreadCount > 0
         ? `, ${unreadCount} unread`
         : ""
     }`}
     icon={
       <Bell aria-hidden={true} />
     }
     appearance={
       open
         ? "default"
         : "ghost"
     }
     disabled={disabled}
     aria-expanded={open}
     onClick={onClick}
   />

     {unreadCount > 0 ? (
       <span className="pointer-events-none absolute -right-1 -top-1 flex min-w-5 items-center
justify-center rounded-full border-2 border-background bg-[var(--color-error)] px-1.5 py-0.5
text-[10px] font-bold leading-none text-white">
         {unreadCount > 99
          ? "99+"
          : unreadCount}
       </span>
     ) : null}
    </div>
  );
}
