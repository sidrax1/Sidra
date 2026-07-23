"use client";

import {
 Laptop,
 LogOut,
 MapPin,

  Smartphone,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/date";

export interface UserSession {
  readonly id: string;
  readonly deviceType:
   | "mobile"
   | "desktop"
   | "tablet"
   | "unknown";
  readonly deviceName: string;
  readonly browser: string;
  readonly location?: string;
  readonly current: boolean;
  readonly lastActiveAt: string;
}

interface SessionCardProps {
  readonly session: UserSession;
  readonly loading?: boolean;
  readonly onRevoke?: (
    session: UserSession
  ) => void | Promise<void>;
}

export function SessionCard({
  loading = false,
  onRevoke,
  session,
}: SessionCardProps): React.JSX.Element {
  const DeviceIcon =
    session.deviceType ===
    "mobile"
     ? Smartphone
     : Laptop;

 return (
  <Card className="p-5">
    <div className="flex items-start justify-between gap-5">

    <div className="flex items-start gap-4">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-border bg-background text-[var(--color-gold-600)]">
       <DeviceIcon
        aria-hidden="true"
        className="size-5"
       />
      </span>

      <div>
       <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-medium text-foreground">
          {session.deviceName}
        </h3>

        {session.current ? (
          <Badge variant="success">
            Current Session
          </Badge>
        ) : null}
       </div>

       <p className="mt-1 text-sm text-muted">
        {session.browser}
       </p>

       {session.location ? (
         <p className="mt-3 inline-flex items-center gap-2 text-xs text-muted">
           <MapPin
            aria-hidden="true"
            className="size-3.5"
           />
           {session.location}
         </p>
       ) : null}

      <p className="mt-2 text-xs text-muted">
        Last active{" "}
        {formatDateTime(
          session.lastActiveAt
        )}
      </p>
     </div>
    </div>

     {!session.current &&
     onRevoke ? (
       <Button
         variant="ghost"
         size="sm"
         disabled={loading}
         onClick={() => {
           void onRevoke(
             session
           );
         }}
         className="text-[var(--color-error)]"
       >
         <LogOut
           aria-hidden="true"
           className="size-4"
         />
         Revoke
       </Button>
     ) : null}
    </div>
   </Card>
 );
}
