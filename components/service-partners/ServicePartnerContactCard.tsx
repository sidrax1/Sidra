import {
  ExternalLink,
  Mail,
  MapPin,
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
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerContactCardProps {
  readonly partner: ServicePartner;
  readonly contactPhotoURL?: string | null;
  readonly className?: string;
}

export function ServicePartnerContactCard({
  className,
  contactPhotoURL,
  partner,
}: ServicePartnerContactCardProps): React.JSX.Element {
  const {
    contact,
    registeredAddress,
  } = partner;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
            <UserRound
              aria-hidden={true}
              className="size-4"
            />
          </span>

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Primary Contact
          </h2>
        </div>

        <Badge variant="neutral">
          {
            contact.designation ??
            "Partner Contact"
          }
        </Badge>
      </header>

      <div className="grid gap-6 p-6">
        <div className="flex items-center gap-4">
          <Avatar
            name={
              contact.contactName
            }
            src={contactPhotoURL}
            size="lg"
          />

          <div className="min-w-0">
            <h3 className="truncate font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {
                contact.contactName
              }
            </h3>

            <p className="mt-1 text-sm text-muted">
              {
                partner.displayName
              }
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <a
            href={`mailto:${contact.email}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color,background-color] hover:border-[color:rgb(200_169_106_/_0.4)] hover:bg-card"
          >
            <Mail
              aria-hidden={true}
              className="size-4 shrink-0 text-[var(--color-gold-600)]"
            />

            <span className="min-w-0 flex-1 break-all">
              {contact.email}
            </span>

            <ExternalLink
              aria-hidden={true}
              className="size-3.5 text-muted"
            />
          </a>

          <a
            href={`tel:${contact.phoneNumber}`}
            className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color,background-color] hover:border-[color:rgb(200_169_106_/_0.4)] hover:bg-card"
          >
            <Phone
              aria-hidden={true}
              className="size-4 shrink-0 text-[var(--color-gold-600)]"
            />

            <span className="flex-1">
              {
                contact.phoneNumber
              }
            </span>

            <ExternalLink
              aria-hidden={true}
              className="size-3.5 text-muted"
            />
          </a>

          {contact.alternatePhoneNumber ? (
            <a
              href={`tel:${contact.alternatePhoneNumber}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color,background-color] hover:border-[color:rgb(200_169_106_/_0.4)] hover:bg-card"
            >
              <Phone
                aria-hidden={true}
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="flex-1">
                {
                  contact.alternatePhoneNumber
                }
              </span>

              <span className="text-xs text-muted">
                Alternate
              </span>
            </a>
          ) : null}

          {contact.websiteURL ? (
            <a
              href={
                contact.websiteURL
              }
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color,background-color] hover:border-[color:rgb(200_169_106_/_0.4)] hover:bg-card"
            >
              <ExternalLink
                aria-hidden={true}
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="min-w-0 flex-1 truncate">
                {
                  contact.websiteURL
                }
              </span>
            </a>
          ) : null}
        </div>

        <address className="not-italic">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <MapPin
              aria-hidden={true}
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
            {registeredAddress.landmark
              ? `, ${registeredAddress.landmark}`
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
