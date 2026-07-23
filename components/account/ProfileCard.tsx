import {
  Mail,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/date";
import type { User } from "@/types/user";

interface ProfileCardProps {
  readonly user: User;
}

export function ProfileCard({
  user,
}: ProfileCardProps): React.JSX.Element {
  return (
   <Card className="p-6 md:p-8">
     <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
      <Avatar
        name={user.displayName}
        src={user.photoURL}
        size="xl"
        className="size-24 text-2xl"
      />

     <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-3">
       <h2 className="font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
         {user.displayName}
       </h2>

        {user.emailVerified ? (
         <Badge variant="success">
          <ShieldCheck
           aria-hidden={true}
           className="mr-1 size-3.5"
          />
          Verified

         </Badge>
       ) : null}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
       <span className="inline-flex items-center gap-2">
        <Mail
          aria-hidden={true}
          className="size-4 text-[var(--color-gold-600)]"
        />
        {user.email}
       </span>

       {user.phoneNumber ? (
         <span className="inline-flex items-center gap-2">
           <Phone
            aria-hidden={true}
            className="size-4 text-[var(--color-gold-600)]"
           />
           {user.phoneNumber}
         </span>
       ) : null}
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-muted">
        Member since{" "}
        {formatDate(user.createdAt)}
      </p>
     </div>
    </div>
   </Card>
 );
}
