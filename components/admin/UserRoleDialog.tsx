"use client";

import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { ROLES, type UserRole } from "@/constants/roles";
import type { User } from "@/types/user";

interface UserRoleDialogProps {
  readonly open: boolean;
  readonly user: User | null;
  readonly loading?: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (input: {
    readonly user: User;
    readonly role: UserRole;
    readonly reason: string;
  }) => void | Promise<void>;
}

const roleOptions = Object.values(ROLES).map((role) => ({
  value: role,
  label: role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" "),
}));

export function UserRoleDialog({
 loading = false,
 onOpenChange,
 onSubmit,
 open,
 user,

}: UserRoleDialogProps): React.JSX.Element {
  const [role, setRole] = useState<UserRole>("customer");
  const [reason, setReason] = useState("");

 useEffect(() => {
  if (!user) {
    return;
  }

   setRole(user.role);
   setReason("");
 }, [user]);

 const valid =
  Boolean(user) &&
  reason.trim().length >= 10 &&
  role !== user?.role;

 return (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-lg">
     <DialogHeader>
      <DialogTitle>Change User Role</DialogTitle>

      <DialogDescription>
       Update access for {user?.displayName ?? "this account"}.
       This action is recorded in the audit log.
      </DialogDescription>
     </DialogHeader>

     <div className="grid gap-5">
      <FormField
       label="Role"
       labelFor="admin-user-role"
       required
      >
       <Select
         id="admin-user-role"
         value={role}
         options={roleOptions}
         disabled={loading}
         onChange={(event) =>
           setRole(event.target.value as UserRole)
         }

  />
 </FormField>

 <FormField
  label="Reason"
  labelFor="admin-user-role-reason"
  required
  description="Minimum 10 characters."
 >
  <Textarea
    id="admin-user-role-reason"
    rows={5}
    value={reason}
    disabled={loading}
    onChange={(event) => setReason(event.target.value)}
  />
 </FormField>
</div>

<DialogFooter>
 <Button
  variant="ghost"
  disabled={loading}
  onClick={() => onOpenChange(false)}
 >
  Cancel
 </Button>

 <Button
  disabled={!valid}
  loading={loading}
  loadingLabel="Updating Role"
  onClick={() => {
    if (!user) {
      return;
    }

    void onSubmit({
      user,
      role,
      reason: reason.trim(),
    });
  }}
 >

           Update Role
         </Button>
        </DialogFooter>
       </DialogContent>
      </Dialog>
    );
}
