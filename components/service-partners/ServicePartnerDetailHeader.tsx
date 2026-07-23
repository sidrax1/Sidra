import Image from "next/image";
import {
  BadgeCheck,
  Clock3,
  MapPin,
  ShieldCheck,
  Star,
  UsersRound,
  Wrench,
} from "lucide-react";

import {
  ServicePartnerStatusBadge,
} from "@/components/service-partners/ServicePartnerStatusBadge";
import {
  ServicePartnerVerificationBadge,
} from "@/components/service-partners/ServicePartnerVerificationBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerDetailHeaderProps {
  readonly partner: ServicePartner;
  readonly className?: string;
}

export function ServicePartnerDetailHeader({
  className,
  partner,
}: ServicePartnerDetailHeaderProps): React.JSX.Element {
  const availableCapacity =
    Math.max(
      partner.maximumConcurrentAssignments -
        partner.currentAssignmentCount,
      0
    );

  const activeCapabilities =
    partner.capabilities.filter(
      (capability) =>
        capability.active
    );

  return (
    <header
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border bg-card shadow-[var(--shadow-hover)]",
        partner.status ===
          "suspended" ||
          partner.status ===
            "rejected"
          ? "border-[color:rgb(145_59_59_/_0.42)]"
          : "border-[color:rgb(200_169_106_/_0.32)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] text-white">
        <div className="relative h-56 overflow-hidden md:h-72">
          {partner.coverImageURL ? (
            <Image
              src={
                partner.coverImageURL
              }
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover opacity-65"
            />
          ) : (
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_8%,rgba(200,169,106,0.42),transparent_46%)]" />
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-black-900)] via-black/35 to-black/10" />
        </div>

        <div className="relative z-10 -mt-24 px-6 pb-10 md:px-10">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
            <div>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="relative size-32 shrink-0 overflow-hidden rounded-[var(--radius-xl)] border-4 border-[var(--color-black-900)] bg-white/10 shadow-[var(--shadow-modal)]">
                  {partner.logoURL ? (
                    <Image
                      src={
                        partner.logoURL
                      }
                      alt={
                        partner.displayName
                      }
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center">
                      <ShieldCheck
                        aria-hidden={true}
                        className="size-12 text-[var(--color-gold-500)]"
                      />
                    </div>
                  )}
                </div>

                <div className="min-w-0 pb-2">
                  <div className="flex flex-wrap items-center gap-3">
                    <ServicePartnerStatusBadge
                      status={
                        partner.status
                      }
                    />

                    <ServicePartnerVerificationBadge
                      status={
                        partner.verification
                          .status
                      }
                    />

                    {partner.acceptingAssignments ? (
                      <Badge variant="success">
                        Accepting Assignments
                      </Badge>
                    ) : (
                      <Badge variant="warning">
                        Assignments Paused
                      </Badge>
                    )}
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <h1 className="font-heading text-[clamp(2.8rem,6vw,5.8rem)] font-medium leading-[0.9] tracking-[-0.055em]">
                      {
                        partner.displayName
                      }
                    </h1>

                    {partner.verification
                      .status ===
                    "verified" ? (
                      <BadgeCheck
                        aria-label="Verified service partner"
                        className="size-7 shrink-0 text-[var(--color-success)]"
                      />
                    ) : null}
                  </div>

                  <p className="mt-3 text-sm capitalize text-white/55">
                    {partner.partnerType.replace(
                      /([A-Z])/g,
                      " $1"
                    )}
                  </p>
                </div>
              </div>

              <p className="mt-7 max-w-4xl whitespace-pre-wrap text-sm leading-7 text-white/65">
                {
                  partner.description
                }
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/60">
                <span className="inline-flex items-center gap-2">
                  <MapPin
                    aria-hidden={true}
                    className="size-4"
                  />
                  {
                    partner.registeredAddress
                      .city
                  }
                  ,{" "}
                  {
                    partner.registeredAddress
                      .state
                  }
                </span>

                <span className="inline-flex items-center gap-2">
                  <Wrench
                    aria-hidden={true}
                    className="size-4"
                  />
                  {
                    activeCapabilities.length
                  }{" "}
                  active capabilities
                </span>

                <span className="inline-flex items-center gap-2">
                  <UsersRound
                    aria-hidden={true}
                    className="size-4"
                  />
                  {
                    partner.performance
                      .completedAssignments
                  }{" "}
                  assignments completed
                </span>
              </div>
            </div>

            <section className="rounded-[var(--radius-xl)] border border-white/15 bg-white/10 p-6 backdrop-blur-xl">
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-1">
                <div>
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/50">
                    <Star
                      aria-hidden={true}
                      className="size-3.5 text-[var(--color-gold-500)]"
                    />
                    Customer Rating
                  </p>

                  <p className="mt-2 font-heading text-4xl font-medium">
                    {partner.performance.customerRating.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 1,
                        maximumFractionDigits: 1,
                      }
                    )}
                    <span className="ml-1 text-lg text-white/45">
                      /5
                    </span>
                  </p>

                  <p className="mt-1 text-xs text-white/50">
                    {
                      partner.performance
                        .customerReviewCount
                    }{" "}
                    verified reviews
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="text-xs uppercase tracking-[0.14em] text-white/50">
                    Quality Score
                  </p>

                  <p className="mt-2 font-heading text-4xl font-medium">
                    {
                      partner.performance
                        .qualityScore
                    }
                    <span className="ml-1 text-lg text-white/45">
                      /100
                    </span>
                  </p>
                </div>

                <div className="border-t border-white/10 pt-5">
                  <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-white/50">
                    <Clock3
                      aria-hidden={true}
                      className="size-3.5"
                    />
                    Average Completion
                  </p>

                  <p className="mt-2 font-heading text-3xl font-medium">
                    {partner.performance.averageCompletionHours.toLocaleString(
                      "en-IN",
                      {
                        maximumFractionDigits: 1,
                      }
                    )}
                    h
                  </p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 xl:grid-cols-4">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Available Capacity
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {availableCapacity}
          </p>

          <p className="mt-1 text-xs text-muted">
            of{" "}
            {
              partner.maximumConcurrentAssignments
            }{" "}
            assignment slots
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Success Rate
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {partner.performance.resolutionSuccessRate.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 1,
              }
            )}
            %
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            First Response
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {
              partner.performance
                .firstResponseMinutes
            }
            m
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs uppercase tracking-[0.13em] text-muted">
            Service Coverage
          </p>

          <p className="mt-3 font-heading text-3xl font-medium text-foreground">
            {
              partner.coverageAreas
                .length
            }
          </p>

          <p className="mt-1 text-xs text-muted">
            verified coverage areas
          </p>
        </article>
      </div>
    </header>
  );
}
