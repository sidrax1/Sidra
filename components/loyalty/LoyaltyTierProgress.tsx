import {
  Check,
  ChevronRight,
  Crown,
  Gem,
  Sparkles,
  Star,
} from "lucide-react";

import { LoyaltyTierBadge } from "@/components/loyalty/LoyaltyTierBadge";
import { cn } from "@/lib/utils";
import type {
  LoyaltyTier,
  LoyaltyTierConfiguration,
} from "@/types/loyalty";

interface LoyaltyTierProgressProps {
  readonly tiers: readonly LoyaltyTierConfiguration[];
  readonly currentTier: LoyaltyTier;
  readonly lifetimePoints: number;
  readonly className?: string;
}

const tierIcons: Record<
  LoyaltyTier,
  React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>
> = {
  atelier: Star,
  signature: Sparkles,
  prestige: Gem,
  maison: Crown,
};

export function LoyaltyTierProgress({
  className,
  currentTier,
  lifetimePoints,
  tiers,
}: LoyaltyTierProgressProps): React.JSX.Element {
  const orderedTiers = [
    ...tiers,
  ].sort(
    (first, second) =>
      first.minimumLifetimePoints -
      second.minimumLifetimePoints
  );

  const currentIndex =
    orderedTiers.findIndex(
      (tier) =>
        tier.tier === currentTier
    );

  return (
    <section
      aria-label="Loyalty tier journey"
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card",
        "shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Membership Journey
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Sydra Loyalty Tiers
        </h2>
      </header>

      <div className="grid gap-0 p-6">
        {orderedTiers.map(
          (tier, index) => {
            const Icon =
              tierIcons[tier.tier];

            const achieved =
              index <= currentIndex;

            const current =
              tier.tier ===
              currentTier;

            const pointsRemaining =
              Math.max(
                tier.minimumLifetimePoints -
                  lifetimePoints,
                0
              );

            return (
              <article
                key={tier.id}
                className="relative grid grid-cols-[auto_minmax(0,1fr)] gap-4 pb-8 last:pb-0"
              >
                {index <
                orderedTiers.length -
                  1 ? (
                  <div
                    aria-hidden={true}
                    className={cn(
                      "absolute bottom-0 left-[1.35rem] top-11 w-px",
                      achieved
                        ? "bg-[var(--color-gold-500)]"
                        : "bg-border"
                    )}
                  />
                ) : null}

                <span
                  className={cn(
                    "relative z-10 flex size-11 items-center justify-center rounded-full border",
                    current
                      ? "border-[var(--color-gold-500)] bg-[var(--color-black-900)] text-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
                      : achieved
                        ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]"
                        : "border-border bg-background text-muted"
                  )}
                >
                  {achieved &&
                  !current ? (
                    <Check
                      aria-hidden={true}
                      className="size-5"
                    />
                  ) : (
                    <Icon
                      aria-hidden={true}
                      className="size-5"
                    />
                  )}
                </span>

                <div
                  className={cn(
                    "rounded-[var(--radius-lg)] border p-5",
                    current
                      ? "border-[color:rgb(200_169_106_/_0.42)] bg-[color:rgb(200_169_106_/_0.06)] shadow-[var(--shadow-gold-glow)]"
                      : "border-border bg-background"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                          {tier.displayName}
                        </h3>

                        <LoyaltyTierBadge
                          tier={tier.tier}
                        />
                      </div>

                      <p className="mt-2 text-sm leading-6 text-muted">
                        {tier.description}
                      </p>
                    </div>

                    <div className="shrink-0 text-sm">
                      {achieved ? (
                        <span className="font-medium text-[var(--color-success)]">
                          {current
                            ? "Current tier"
                            : "Achieved"}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 text-muted">
                          {pointsRemaining.toLocaleString(
                            "en-IN"
                          )}{" "}
                          points remaining
                          <ChevronRight
                            aria-hidden={true}
                            className="size-4"
                          />
                        </span>
                      )}
                    </div>
                  </div>

                  <dl className="mt-5 grid gap-3 text-xs sm:grid-cols-2">
                    <div className="rounded-[var(--radius-md)] border border-border bg-card p-3">
                      <dt className="text-muted">
                        Minimum lifetime points
                      </dt>

                      <dd className="mt-1 font-medium text-foreground">
                        {tier.minimumLifetimePoints.toLocaleString(
                          "en-IN"
                        )}
                      </dd>
                    </div>

                    <div className="rounded-[var(--radius-md)] border border-border bg-card p-3">
                      <dt className="text-muted">
                        Earning multiplier
                      </dt>

                      <dd className="mt-1 font-medium text-foreground">
                        {(
                          tier.earningMultiplierBasisPoints /
                          10000
                        ).toLocaleString(
                          "en-IN",
                          {
                            maximumFractionDigits: 2,
                          }
                        )}
                        ×
                      </dd>
                    </div>
                  </dl>

                  {tier.benefits.length >
                  0 ? (
                    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                      {tier.benefits.map(
                        (benefit) => (
                          <li
                            key={
                              benefit.id
                            }
                            className="flex items-start gap-3 text-sm"
                          >
                            <Check
                              aria-hidden={true}
                              className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
                            />

                            <span>
                              <span className="block font-medium text-foreground">
                                {
                                  benefit.title
                                }
                              </span>

                              <span className="mt-1 block text-xs leading-5 text-muted">
                                {
                                  benefit.description
                                }
                              </span>
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : null}
                </div>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
