"use client";

import {
  Bell,
  BellOff,
  UserMinus,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { StudioCard } from "@/components/marketplace/StudioCard";
import type { Studio } from "@/types/studio";

interface SavedStudioCardProps {
  readonly studio: Studio;
  readonly notificationsEnabled: boolean;
  readonly loading?: boolean;
  readonly onToggleNotifications: (
    studio: Studio,
    enabled: boolean
  ) => void | Promise<void>;
  readonly onUnfollow: (
    studio: Studio
  ) => void | Promise<void>;
}

export function SavedStudioCard({
  loading = false,
  notificationsEnabled,
  onToggleNotifications,
  onUnfollow,
  studio,
}: SavedStudioCardProps): React.JSX.Element {
  return (
    <div className="grid gap-3">
     <StudioCard
      studio={studio}
     />

   <div className="grid gap-2 sm:grid-cols-2">
    <Button
     variant="outline"
     size="sm"
     disabled={loading}
     onClick={() => {
       void onToggleNotifications(
         studio,
         !notificationsEnabled
       );
     }}
    >
     {notificationsEnabled ? (
       <BellOff
         aria-hidden="true"
         className="size-4"
       />

       ):(
         <Bell
          aria-hidden="true"
          className="size-4"
         />
       )}

       {notificationsEnabled
        ? "Mute Updates"
        : "Enable Updates"}
      </Button>

     <Button
       variant="ghost"
       size="sm"
       disabled={loading}
       onClick={() => {
         void onUnfollow(
           studio
         );
       }}
       className="text-[var(--color-error)]"
     >
       <UserMinus
         aria-hidden="true"
         className="size-4"
       />
       Unfollow
     </Button>
    </div>
   </div>
 );
}
