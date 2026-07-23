"use client";

import {
  Ban,
  Eye,
  MoreHorizontal,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react";

import { UserRoleBadge } from "@/components/admin/UserRoleBadge";
import { UserStatusBadge } from "@/components/admin/UserStatusBadge";
import { Avatar } from "@/components/ui/Avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { formatDate } from "@/lib/date";
import type { User } from "@/types/user";

interface AdminUserRowProps {
  readonly user: User;
  readonly loading?: boolean;
  readonly onView: (user: User) => void;
  readonly onChangeRole: (user: User) => void;
  readonly onSuspend: (user: User) => void | Promise<void>;
}

export function AdminUserRow({
  loading = false,
  onChangeRole,
  onSuspend,
  onView,
  user,
}: AdminUserRowProps): React.JSX.Element {
  return (
    <article className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5
shadow-[var(--shadow-card)] transition-[border-color,box-shadow]

hover:border-[color:rgb(200_169_106_/_0.35)] hover:shadow-[var(--shadow-hover)]
md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center">
   <Avatar
    name={user.displayName}
    src={user.photoURL}
    size="lg"
   />

   <div className="min-w-0">
    <div className="flex flex-wrap items-center gap-3">
     <h3 className="truncate font-medium text-foreground">
       {user.displayName}
     </h3>

     <UserRoleBadge role={user.role} />
     <UserStatusBadge status={user.status} />
    </div>

    <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-xs text-muted">
     <span>{user.email}</span>
     <span>Joined {formatDate(user.createdAt)}</span>
     {user.phoneNumber ? <span>{user.phoneNumber}</span> : null}
    </div>
   </div>

   <DropdownMenu>
    <DropdownMenuTrigger>
     <IconButton
      label={`Actions for ${user.displayName}`}
      icon={<MoreHorizontal aria-hidden="true" />}
      appearance="ghost"
      disabled={loading}
     />
    </DropdownMenuTrigger>

    <DropdownMenuContent>
     <DropdownMenuItem onSelect={() => onView(user)}>
      <Eye aria-hidden="true" className="size-4" />
      View Account
     </DropdownMenuItem>

     <DropdownMenuItem onSelect={() => onChangeRole(user)}>
      <UserRoundCog aria-hidden="true" className="size-4" />
      Change Role

      </DropdownMenuItem>

      <DropdownMenuSeparator />

      <DropdownMenuItem
       destructive
       onSelect={() => {
         void onSuspend(user);
       }}
      >
       {user.status === "suspended" ? (
         <ShieldCheck aria-hidden="true" className="size-4" />
       ):(
         <Ban aria-hidden="true" className="size-4" />
       )}

         {user.status === "suspended"
          ? "Restore Account"
          : "Suspend Account"}
       </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   </article>
 );
}
