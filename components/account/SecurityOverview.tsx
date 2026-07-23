import {
  CheckCircle2,
  KeyRound,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";

interface SecurityOverviewProps {
  readonly emailVerified: boolean;
  readonly providerName: string;
  readonly activeSessions: number;
}

export function SecurityOverview({
  activeSessions,
  emailVerified,
  providerName,
}: SecurityOverviewProps): React.JSX.Element {
  const items = [
   {
     label: "Email Verification",
     value: emailVerified
       ? "Verified"
       : "Pending",
     icon: CheckCircle2,
     healthy: emailVerified,
   },
   {
     label: "Authentication",
     value: providerName,
     icon: KeyRound,

     healthy: true,
   },
   {
     label: "Active Sessions",
     value:
       activeSessions.toLocaleString(
         "en-IN"
       ),
     icon: LockKeyhole,
     healthy:
       activeSessions <= 5,
   },
 ] as const;

 return (
   <Card className="p-6 md:p-8">
    <div className="flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.08)]
text-[var(--color-success)]">
       <ShieldCheck
        aria-hidden={true}
        className="size-5"
       />
      </span>

     <div>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Security Overview
      </h2>

     <p className="mt-2 text-sm leading-6 text-muted">
       Review authentication and session protection for your account.
     </p>
    </div>
   </div>

   <div className="mt-8 grid gap-4 md:grid-cols-3">
    {items.map((item) => (
      <div
       key={item.label}
       className="rounded-[var(--radius-md)] border border-border bg-background p-5"
      >
       <div className="flex items-center justify-between gap-4">

         <item.icon
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
         />

         <Badge
          variant={
            item.healthy
              ? "success"
              : "warning"
          }
         >
          {item.healthy
            ? "Secure"
            : "Review"}
         </Badge>
        </div>

        <p className="mt-5 text-xs uppercase tracking-[0.15em] text-muted">
         {item.label}
        </p>

         <p className="mt-2 font-medium text-foreground">
          {item.value}
         </p>
       </div>
     ))}
    </div>
   </Card>
 );
}
