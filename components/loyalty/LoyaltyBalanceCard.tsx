import {
  CalendarClock,
  Crown,
  Gem,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  LoyaltyTierBadge,
} from "@/components/loyalty/LoyaltyTierBadge";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  formatDate,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  LoyaltyAccount,
  LoyaltyTierConfiguration,
} from "@/types/loyalty";

interface LoyaltyBalanceCardProps {
  readonly account: LoyaltyAccount;
  readonly currentTier: LoyaltyTierConfiguration;
  readonly nextTier?: LoyaltyTierConfiguration;
  readonly pointsToNextTier: number;
  readonly tierProgressPercentage: number;
  readonly className?: string;
}

export function LoyaltyBalanceCard({
  account,
  className,
  currentTier,
  nextTier,
  pointsToNextTier,
  tierProgressPercentage,
}: LoyaltyBalanceCardProps): React.JSX.Element {
  const restricted =
    account.status !== "active";

  return (
    <Surface
      padding="none"
      className={cn(
        "overflow-hidden border-[color:rgb(200_169_106_/_0.32)] shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative overflow-hidden bg-[var(--color-black-900)] px-6 py-8 text-white md:px-9 md:py-10">
        <div
          aria-hidden={true}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 82% 8%, rgba(200,169,106,0.34), transparent 43%), radial-gradient(circle at 15% 100%, rgba(255,255,255,0.06), transparent 35%)",
          }}
        />

        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <LoyaltyTierBadge
                tier={
                  account.tier
                }
              />

              <Badge
                variant={
                  restricted
                    ? "warning"
                    : "success"
                }
              >
                <ShieldCheck
                  aria-hidden={true}
                  className="mr-1 size-3.5"
                />
                {restricted
                  ? "Restricted"
                  : "Active Member"}
              </Badge>
            </div>

            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
              Available Sydra Points
            </p>

            <div className="mt-3 flex flex-wrap items-end gap-4">
              <p className="font-heading text-[clamp(4rem,10vw,8rem)] font-medium leading-[0.82] tracking-[-0.065em]">
                {account.availablePoints.toLocaleString(
                  "en-IN"
                )}
              </p>

              <span className="pb-2 text-sm uppercase tracking-[0.15em] text-white/55">
                points
              </span>
            </div>

            {account.pendingPoints >
            0 ? (
              <p className="mt-5 inline-flex items-center gap-2 text-sm text-white/65">
                <Sparkles
                  aria-hidden={true}
                  className="size-4 text-[var(--color-gold-500)]"
                />
                {account.pendingPoints.toLocaleString(
                  "en-IN"
                )}{" "}
                pending points
              </p>
            ) : null}
          </div>

          <div className="grid min-w-[260px] gap-4 rounded-[var(--radius-lg)] border border-white/15 bg-white/10 p-5 backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-[0.15em] text-white/55">
                Current Tier
              </span>

              <Crown
                aria-hidden={true}
                className="size-5 text-[var(--color-gold-500)]"
              />
            </div>

            <p className="font-heading text-3xl font-medium tracking-[-0.03em]">
              {currentTier.displayName}
            </p>

            <p className="text-xs leading-5 text-white/60">
              {currentTier.description}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 p-6 md:p-8">
        {nextTier ? (
          <section
            aria-label="Tier progress"
            className="rounded-[var(--radius-lg)] border border-border bg-background p-5"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-600)]">
                  Next Membership Tier
                </p>

                <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                  {nextTier.displayName}
                </h2>
              </div>

              <div className="flex items-center gap-2 text-sm text-muted">
                <Gem
                  aria-hidden={true}
                  className="size-4 text-[var(--color-gold-600)]"
                />

                <strong className="font-medium text-foreground">
                  {pointsToNextTier.toLocaleString(
                    "en-IN"
                  )}
                </strong>

                points remaining
              </div>
            </div>

            <div className="mt-5">
              <div className="flex items-center justify-between gap-4 text-xs text-muted">
                <span>
                  Tier progress
                </span>

                <span>
                  {tierProgressPercentage}%
                </span>
              </div>

              <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-card">
                <div
                  className="h-full rounded-full bg-[var(--color-gold-500)] transition-[width] duration-[var(--duration-slow)]"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        tierProgressPercentage,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.32)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
            <div className="flex items-start gap-4">
              <Crown
                aria-hidden={true}
                className="mt-0.5 size-6 shrink-0 text-[var(--color-gold-600)]"
              />

              <div>
                <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                  Highest tier achieved
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted">
                  Your account has reached the highest available
                  Sydra membership tier.
                </p>
              </div>
            </div>
          </section>
        )}

        <dl className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Lifetime Earned
            </dt>

            <dd className="mt-2 font-heading text-3xl font-medium text-foreground">
              {account.lifetimeEarnedPoints.toLocaleString(
                "en-IN"
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="text-xs uppercase tracking-[0.14em] text-muted">
              Lifetime Redeemed
            </dt>

            <dd className="mt-2 font-heading text-3xl font-medium text-foreground">
              {account.lifetimeRedeemedPoints.toLocaleString(
                "en-IN"
              )}
            </dd>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-card p-4">
            <dt className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <CalendarClock
                aria-hidden={true}
                className="size-3.5"
              />
              Next Expiration
            </dt>

            <dd className="mt-2 text-sm font-medium text-foreground">
              {account.nextExpirationAt &&
              account.nextExpirationPoints >
                0
                ? `${account.nextExpirationPoints.toLocaleString(
                    "en-IN"
                  )} points on ${formatDate(
                    account.nextExpirationAt
                  )}`
                : "No upcoming expiration"}
            </dd>
          </div>
        </dl>
      </div>
    </Surface>
  );
}
