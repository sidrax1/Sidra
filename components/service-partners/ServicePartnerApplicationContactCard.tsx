import {
  ExternalLink,
  Mail,
  MapPin,
  Phone,
  UserRound,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationContactCardProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

export function ServicePartnerApplicationContactCard({
  application,
  className,
}: ServicePartnerApplicationContactCardProps): React.JSX.Element {
  const {
    contact,
    registeredAddress,
  } = application;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <UserRound
          aria-hidden="true"
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Applicant Contact
        </h2>
      </header>

      <div className="grid gap-5 p-6">
        <div>
          <h3 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            {
              contact.contactName
            }
          </h3>

          {contact.designation ? (
            <p className="mt-1 text-sm text-muted">
              {
                contact.designation
              }
            </p>
          ) : null}
        </div>

        <div className="grid gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm hover:border-[color:rgb(200_169_106_/_0.4)]"
          >
            <Mail
              aria-hidden="true"
              className="size-4 text-[var(--color-gold-600)]"
            />
            <span className="min-w-0 flex-1 break-all">
              {contact.email}
            </span>
            <ExternalLink
              aria-hidden="true"
              className="size-3.5 text-muted"
            />
          </a>

          <a
            href={`tel:${contact.phoneNumber}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm hover:border-[color:rgb(200_169_106_/_0.4)]"
          >
            <Phone
              aria-hidden="true"
              className="size-4 text-[var(--color-gold-600)]"
            />
            {
              contact.phoneNumber
            }
          </a>
        </div>

        <address className="rounded-[var(--radius-md)] border border-border bg-background p-4 not-italic">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.13em] text-muted">
            <MapPin
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Registered Address
          </p>

          <p className="mt-3 text-sm leading-7 text-foreground">
            {
              registeredAddress.addressLine1
            }
            {registeredAddress.addressLine2
              ? `, ${registeredAddress.addressLine2}`
              : ""}
            <br />
            {
              registeredAddress.city
            }
            {registeredAddress.district
              ? `, ${registeredAddress.district}`
              : ""}
            ,{" "}
            {
              registeredAddress.state
            }{" "}
            {
              registeredAddress.postalCode
            }
          </p>
        </address>
      </div>
    </section>
  );
}
