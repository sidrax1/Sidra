import {
  Hash,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

export interface ServiceAssignmentCustomerProfile {
  readonly id: string;
  readonly name: string;
  readonly email?: string;
  readonly phoneNumber?: string;
  readonly photoURL?: string | null;
  readonly verified?: boolean;
}

interface ServicePartnerAssignmentCustomerCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly customer?: ServiceAssignmentCustomerProfile | null;
  readonly className?: string;
}

export function ServicePartnerAssignmentCustomerCard({
  assignment,
  className,
  customer,
}: ServicePartnerAssignmentCustomerCardProps): React.JSX.Element {
  const customerName =
    customer?.name ??
    "Sidra Customer";

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <UserRound
            aria-hidden={true}
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Customer
          </h2>
        </div>

        {customer?.verified ? (
          <Badge variant="success">
            Verified
          </Badge>
        ) : null}
      </header>

      <div className="grid gap-6 p-6">
        <div className="flex items-center gap-4">
          <Avatar
            name={customerName}
            src={
              customer?.photoURL
            }
            size="lg"
          />

          <div className="min-w-0">
            <h3 className="truncate font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {customerName}
            </h3>

            <p className="mt-1 font-mono text-xs text-muted">
              Customer ID:{" "}
              {
                assignment.customerId
              }
            </p>
          </div>
        </div>

        <dl className="grid gap-3">
          <div className="flex items-start justify-between gap-5 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Hash
                aria-hidden={true}
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Customer ID
            </dt>

            <dd className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
              {
                assignment.customerId
              }
            </dd>
          </div>

          {customer?.email ? (
            <a
              href={`mailto:${customer.email}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color] hover:border-[color:rgb(200_169_106_/_0.4)]"
            >
              <Mail
                aria-hidden={true}
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="min-w-0 flex-1 break-all text-foreground">
                {customer.email}
              </span>
            </a>
          ) : null}

          {customer?.phoneNumber ? (
            <a
              href={`tel:${customer.phoneNumber}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color] hover:border-[color:rgb(200_169_106_/_0.4)]"
            >
              <Phone
                aria-hidden={true}
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="text-foreground">
                {
                  customer.phoneNumber
                }
              </span>
            </a>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
