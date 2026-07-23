"use client";

import Image from "next/image";
import {
  ArrowUpRight,
  BadgeCheck,
  Clock3,
  MapPin,
  MoreVertical,
  ShieldCheck,
  Star,
  UsersRound,
} from "lucide-react";

import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import {
  ServicePartnerStatusBadge,
} from "@/components/service-partners/ServicePartnerStatusBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Card,
} from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerCardProps {
  readonly partner: ServicePartner;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onOpen: (
    partner: ServicePartner
  ) => void;
  readonly onAssign?: (
    partner: ServicePartner
  ) => void;
  readonly onChangeStatus?: (
    partner: ServicePartner
  ) => void;
  readonly onChangeAvailability?: (
    partner: ServicePartner
  ) => void;
}

export function ServicePartnerCard({
  className,
  loading = false,
  onAssign,
  onChangeAvailability,
  onChangeStatus,
  onOpen,
  partner,
}: ServicePartnerCardProps): React.JSX.Element {
  const capacityRemaining =
    Math.max(
      partner.maximumConcurrentAssignments -
        partner.currentAssignmentCount,
      0
    );

  const capacityPercentage =
    partner.maximumConcurrentAssignments >
    0
      ? Math.min(
          Math.round(
            (partner.currentAssignmentCount /
              partner.maximumConcurrentAssignments) *
              100
          ),
          100
        )
      : 0;

  const available =
    partner.status === "active" &&
    partner.acceptingAssignments &&
    capacityRemaining > 0;

  return (
    <Card
      className={cn(
        "overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.42)]",
        "hover:shadow-[var(--shadow-hover)]",
        partner.status ===
          "suspended" &&
          "border-[color:rgb(145_59_59_/_0.38)]",
        className
      )}
    >
      <div className="relative h-32 overflow-hidden bg-[var(--color-black-900)]">
        {partner.coverImageURL ? (
          <Image
            src={
              partner.coverImageURL
            }
            alt=""
            fill
            sizes="640px"
            className="object-cover opacity-70"
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(200,169,106,0.36),transparent_48%)]" />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />

        <div className="absolute left-5 top-5 flex flex-wrap gap-2">
          <ServicePartnerStatusBadge
            status={partner.status}
          />

          <Badge
            variant={
              available
                ? "success"
                : "warning"
            }
          >
            {available
              ? "Accepting Assignments"
              : "Unavailable"}
          </Badge>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
          >
            <IconButton
              label="Service partner actions"
              icon={
                <MoreVertical
                  aria-hidden="true"
                />
              }
              appearance="ghost"
              disabled={loading}
              className="absolute right-4 top-4 border-white/15 bg-black/30 text-white hover:bg-black/50"
            />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onSelect={() =>
                onOpen(partner)
              }
            >
              Open profile
            </DropdownMenuItem>

            {onAssign &&
            available ? (
              <DropdownMenuItem
                onSelect={() =>
                  onAssign(partner)
                }
              >
                Create assignment
              </DropdownMenuItem>
            ) : null}

            {onChangeAvailability ? (
              <DropdownMenuItem
                onSelect={() =>
                  onChangeAvailability(
                    partner
                  )
                }
              >
                Update availability
              </DropdownMenuItem>
            ) : null}

            {onChangeStatus ? (
              <DropdownMenuItem
                onSelect={() =>
                  onChangeStatus(
                    partner
                  )
                }
              >
                Change status
              </DropdownMenuItem>
            ) : null}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="relative grid gap-6 p-5">
        <div className="-mt-14 flex items-end gap-4">
          <div className="relative size-24 shrink-0 overflow-hidden rounded-[var(--radius-lg)] border-4 border-card bg-background shadow-[var(--shadow-card)]">
            {partner.logoURL ? (
              <Image
                src={partner.logoURL}
                alt={
                  partner.displayName
                }
                fill
                sizes="96px"
                className="object-cover"
              />
            ) : (
              <div className="flex size-full items-center justify-center bg-[color:rgb(200_169_106_/_0.08)]">
                <ShieldCheck
                  aria-hidden="true"
                  className="size-9 text-[var(--color-gold-600)]"
                />
              </div>
            )}
          </div>

          <div className="min-w-0 pb-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="truncate font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {partner.displayName}
              </h2>

              {partner.verification
                .status ===
              "verified" ? (
                <BadgeCheck
                  aria-label="Verified service partner"
                  className="size-5 shrink-0 text-[var(--color-success)]"
                />
              ) : null}
            </div>

            <p className="mt-1 text-xs capitalize text-muted">
              {partner.partnerType.replace(
                /([A-Z])/g,
                " $1"
              )}
            </p>
          </div>
        </div>

        <p className="line-clamp-3 text-sm leading-7 text-muted">
          {partner.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {partner.capabilities
            .filter(
              (capability) =>
                capability.active
            )
            .slice(0, 4)
            .map(
              (capability) => (
                <ServicePartnerCapabilityBadge
                  key={
                    capability.capability
                  }
                  capability={
                    capability.capability
                  }
                />
              )
            )}

          {partner.capabilities.filter(
            (capability) =>
              capability.active
          ).length > 4 ? (
            <Badge variant="neutral">
              +
              {partner.capabilities.filter(
                (capability) =>
                  capability.active
              ).length - 4}{" "}
              more
            </Badge>
          ) : null}
        </div>

        <dl className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <Star
                aria-hidden="true"
                className="size-3.5 text-[var(--color-gold-600)]"
              />
              Customer Rating
            </dt>

            <dd className="mt-2 font-heading text-2xl font-medium text-foreground">
              {partner.performance.customerRating.toLocaleString(
                "en-IN",
                {
                  minimumFractionDigits: 1,
                  maximumFractionDigits: 1,
                }
              )}
              <span className="ml-1 text-sm text-muted">
                / 5
              </span>
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.13em] text-muted">
              <BadgeCheck
                aria-hidden="true"
                className="size-3.5 text-[var(--color-success)]"
              />
              Quality Score
            </dt>

            <dd className="mt-2 font-heading text-2xl font-medium text-foreground">
              {partner.performance.qualityScore}
              <span className="ml-1 text-sm text-muted">
                / 100
              </span>
            </dd>
          </div>
        </dl>

        <section className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4 text-xs">
            <span className="inline-flex items-center gap-2 text-muted">
              <UsersRound
                aria-hidden="true"
                className="size-3.5"
              />
              Assignment Capacity
            </span>

            <span className="font-medium text-foreground">
              {
                partner.currentAssignmentCount
              }
              /
              {
                partner.maximumConcurrentAssignments
              }
            </span>
          </div>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-border">
            <div
              className={cn(
                "h-full rounded-full transition-[width]",
                capacityPercentage >=
                  90
                  ? "bg-[var(--color-error)]"
                  : capacityPercentage >=
                      70
                    ? "bg-[var(--color-warning)]"
                    : "bg-[var(--color-gold-500)]"
              )}
              style={{
                width: `${capacityPercentage}%`,
              }}
            />
          </div>
        </section>

        <div className="flex flex-wrap gap-x-5 gap-y-3 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <MapPin
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
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
            <Clock3
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Avg.{" "}
            {partner.performance.averageCompletionHours.toLocaleString(
              "en-IN",
              {
                maximumFractionDigits: 1,
              }
            )}
            h completion
          </span>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            variant="outline"
            onClick={() =>
              onOpen(partner)
            }
          >
            View Partner
            <ArrowUpRight
              aria-hidden="true"
              className="size-4"
            />
          </Button>
        </div>
      </div>
    </Card>
  );
}
