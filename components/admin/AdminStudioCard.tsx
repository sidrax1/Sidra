"use client";

import {
  Ban,
  Eye,
  MoreHorizontal,
  ShieldCheck,
  Store,
} from "lucide-react";

import type {
  AdminStudioStatus} from "@/components/admin/StudioStatusBadge";
import {
  StudioStatusBadge,
} from "@/components/admin/StudioStatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { Rating } from "@/components/ui/Rating";
import type { Studio } from "@/types/studio";

interface AdminStudioCardProps {
  readonly studio: Studio;

    readonly status: AdminStudioStatus;
    readonly loading?: boolean;
    readonly onView: (studio: Studio) => void;
    readonly onVerify: (studio: Studio) => void | Promise<void>;
    readonly onSuspend: (studio: Studio) => void | Promise<void>;
}

export function AdminStudioCard({
  loading = false,
  onSuspend,
  onVerify,
  onView,
  status,
  studio,
}: AdminStudioCardProps): React.JSX.Element {
  return (
    <article className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5
shadow-[var(--shadow-card)] transition-[border-color,box-shadow]
hover:border-[color:rgb(200_169_106_/_0.35)] hover:shadow-[var(--shadow-hover)]
md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
     <Avatar
      name={studio.name}
      src={studio.logo}
      size="xl"
     />

      <div className="min-w-0">
       <div className="flex flex-wrap items-center gap-3">
        <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
          {studio.name}
        </h3>

        <StudioStatusBadge status={status} />

       {studio.verified ? (
         <span className="inline-flex items-center gap-1.5 text-xs font-medium
text-[var(--color-success)]">
           <ShieldCheck aria-hidden={true} className="size-3.5" />
           Verified
         </span>
       ) : null}
      </div>

       <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted">

  <span>{studio.productCount.toLocaleString("en-IN")} products</span>
  <span>{studio.followers.toLocaleString("en-IN")} followers</span>
  <Rating
    value={studio.rating}
    count={studio.reviewCount}
  />
 </div>
</div>

<DropdownMenu>
 <DropdownMenuTrigger>
  <IconButton
   label={`Actions for ${studio.name}`}
   icon={<MoreHorizontal aria-hidden={true} />}
   appearance="ghost"
   disabled={loading}
  />
 </DropdownMenuTrigger>

 <DropdownMenuContent>
  <DropdownMenuItem onSelect={() => onView(studio)}>
   <Eye aria-hidden={true} className="size-4" />
   View Studio
  </DropdownMenuItem>

  {!studio.verified ? (
    <DropdownMenuItem
      onSelect={() => {
        void onVerify(studio);
      }}
    >
      <ShieldCheck aria-hidden={true} className="size-4" />
      Verify Studio
    </DropdownMenuItem>
  ) : null}

  <DropdownMenuSeparator />

  <DropdownMenuItem
   destructive
   onSelect={() => {
     void onSuspend(studio);
   }}
  >

       {status === "suspended" ? (
         <Store aria-hidden={true} className="size-4" />
       ):(
         <Ban aria-hidden={true} className="size-4" />
       )}

         {status === "suspended"
          ? "Restore Studio"
          : "Suspend Studio"}
       </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   </article>
 );
}
