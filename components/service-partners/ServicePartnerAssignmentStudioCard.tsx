import Image from "next/image";
import {
  Building2,
  ExternalLink,
  Hash,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

export interface ServiceAssignmentStudioProfile {
  readonly id: string;
  readonly name: string;
  readonly slug?: string;
  readonly logoURL?: string | null;
  readonly email?: string;
  readonly phoneNumber?: string;
  readonly city?: string;
  readonly state?: string;
  readonly verified?: boolean;
}

interface ServicePartnerAssignmentStudioCardProps {
  readonly assignment: ServicePartnerAssignment;
  readonly studio?: ServiceAssignmentStudioProfile | null;
  readonly className?: string;
}

export function ServicePartnerAssignmentStudioCard({
  assignment,
  className,
  studio,
}: ServicePartnerAssignmentStudioCardProps): React.JSX.Element {
  const studioName =
    studio?.name ??
    "Sidra Studio";

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <Building2
            aria-hidden="true"
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Product Studio
          </h2>
        </div>

        {studio?.verified ? (
          <Badge variant="success">
            Verified Studio
          </Badge>
        ) : null}
      </header>

      <div className="grid gap-6 p-6">
        <div className="flex items-center gap-4">
          <div className="relative size-20 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border border-border bg-background">
            {studio?.logoURL ? (
              <Image
                src={studio.logoURL}
                alt={studioName}
                fill
                sizes="80px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-8 text-[var(--color-gold-600)]"
                />
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h3 className="truncate font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {studioName}
            </h3>

            <p className="mt-1 font-mono text-xs text-muted">
              Studio ID:{" "}
              {assignment.studioId}
            </p>
          </div>
        </div>

        <dl className="grid gap-3">
          <div className="flex items-start justify-between gap-5 rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-sm text-muted">
              <Hash
                aria-hidden="true"
                className="mt-0.5 size-4 text-[var(--color-gold-600)]"
              />
              Studio ID
            </dt>

            <dd className="max-w-[65%] break-all text-right font-mono text-xs font-medium text-foreground">
              {
                assignment.studioId
              }
            </dd>
          </div>

          {studio?.city &&
          studio.state ? (
            <div className="flex items-start justify-between gap-5 rounded-[var(--radius-md)] border border-border bg-background p-4">
              <dt className="inline-flex items-center gap-2 text-sm text-muted">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 size-4 text-[var(--color-gold-600)]"
                />
                Location
              </dt>

              <dd className="text-right text-sm font-medium text-foreground">
                {studio.city},{" "}
                {studio.state}
              </dd>
            </div>
          ) : null}

          {studio?.email ? (
            <a
              href={`mailto:${studio.email}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color] hover:border-[color:rgb(200_169_106_/_0.4)]"
            >
              <Mail
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="min-w-0 flex-1 break-all text-foreground">
                {studio.email}
              </span>
            </a>
          ) : null}

          {studio?.phoneNumber ? (
            <a
              href={`tel:${studio.phoneNumber}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color] hover:border-[color:rgb(200_169_106_/_0.4)]"
            >
              <Phone
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="text-foreground">
                {
                  studio.phoneNumber
                }
              </span>
            </a>
          ) : null}

          {studio?.slug ? (
            <a
              href={`/studios/${studio.slug}`}
              className="flex items-center gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-sm transition-[border-color] hover:border-[color:rgb(200_169_106_/_0.4)]"
            >
              <ExternalLink
                aria-hidden="true"
                className="size-4 shrink-0 text-[var(--color-gold-600)]"
              />

              <span className="text-foreground">
                Open Studio Profile
              </span>
            </a>
          ) : null}
        </dl>
      </div>
    </section>
  );
}
