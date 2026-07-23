"use client";

import Image from "next/image";
import {
  BadgePercent,
  CalendarDays,
  Crown,
  Gift,
  LockKeyhole,
  Sparkles,
  Truck,
  WalletCards,
} from "lucide-react";

import {
  LoyaltyTierBadge,
} from "@/components/loyalty/LoyaltyTierBadge";
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
  Price,
} from "@/components/ui/Price";
import {
  formatDate,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  LoyaltyAccount,
  LoyaltyReward,
  LoyaltyRewardType,
} from "@/types/loyalty";

interface LoyaltyRewardCardProps {
  readonly reward: LoyaltyReward;
  readonly account?: LoyaltyAccount;
  readonly loading?: boolean;
  readonly onRedeem?: (
    reward: LoyaltyReward
  ) => void | Promise<void>;
  readonly className?: string;
}

const rewardLabels: Record<
  LoyaltyRewardType,
  string
> = {
  fixedDiscount:
    "Fixed Discount",
  percentageDiscount:
    "Percentage Discount",
  freeShipping:
    "Complimentary Shipping",
  giftCard: "Gift Card",
  exclusiveAccess:
    "Exclusive Access",
  complimentaryGift:
    "Complimentary Gift",
};

function resolveRewardIcon(
  type: LoyaltyRewardType
): React.ComponentType<{
  readonly className?: string;
  readonly "aria-hidden"?: boolean;
}> {
  if (
    type ===
    "percentageDiscount"
  ) {
    return BadgePercent;
  }

  if (
    type ===
    "freeShipping"
  ) {
    return Truck;
  }

  if (
    type === "giftCard"
  ) {
    return WalletCards;
  }

  if (
    type ===
    "exclusiveAccess"
  ) {
    return Crown;
  }

  return Gift;
}

export function LoyaltyRewardCard({
  account,
  className,
  loading = false,
  onRedeem,
  reward,
}: LoyaltyRewardCardProps): React.JSX.Element {
  const RewardIcon =
    resolveRewardIcon(
      reward.type
    );

  const insufficientPoints =
    account
      ? account.availablePoints <
        reward.pointsCost
      : false;

  const tierRestricted =
    Boolean(
      account &&
        reward.eligibility.minimumTier &&
        reward.eligibility.minimumTier !==
          "atelier" &&
        account.tier ===
          "atelier"
    );

  const unavailable =
    reward.status !== "active" ||
    insufficientPoints ||
    tierRestricted;

  return (
    <Card
      className={cn(
        "group overflow-hidden transition-[transform,border-color,box-shadow]",
        "hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-black-900)]">
        {reward.imageURL ? (
          <Image
            src={
              reward.imageURL
            }
            alt={reward.name}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <RewardIcon
              aria-hidden={true}
              className="size-14 text-[var(--color-gold-500)]"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <Badge variant="gold">
            <RewardIcon
              aria-hidden={true}
              className="mr-1 size-3.5"
            />
            {
              rewardLabels[
                reward.type
              ]
            }
          </Badge>

          {reward.featured ? (
            <Badge variant="success">
              <Sparkles
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Featured
            </Badge>
          ) : null}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <p className="text-xs uppercase tracking-[0.16em] text-white/60">
            Redeem for
          </p>

          <p className="mt-1 font-heading text-4xl font-medium tracking-[-0.04em]">
            {reward.pointsCost.toLocaleString(
              "en-IN"
            )}{" "}
            <span className="text-base font-normal tracking-normal text-white/65">
              points
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-5 p-5">
        <div>
          <h3 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            {reward.name}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
            {reward.description}
          </p>
        </div>

        <div className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-xs">
          {reward.value.discountPaise ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">
                Reward value
              </span>

              <Price
                amount={
                  reward.value
                    .discountPaise /
                  100
                }
                size="sm"
              />
            </div>
          ) : null}

          {reward.value.percentageBasisPoints ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">
                Discount
              </span>

              <strong className="font-medium text-foreground">
                {(
                  reward.value
                    .percentageBasisPoints /
                  100
                ).toLocaleString(
                  "en-IN",
                  {
                    maximumFractionDigits: 2,
                  }
                )}
                %
              </strong>
            </div>
          ) : null}

          {reward.value.giftCardValuePaise ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">
                Gift card value
              </span>

              <Price
                amount={
                  reward.value
                    .giftCardValuePaise /
                  100
                }
                size="sm"
              />
            </div>
          ) : null}

          {reward.eligibility.minimumTier ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">
                Minimum tier
              </span>

              <LoyaltyTierBadge
                tier={
                  reward.eligibility
                    .minimumTier
                }
                showIcon={false}
              />
            </div>
          ) : null}

          <div className="flex items-center justify-between gap-4">
            <span className="inline-flex items-center gap-2 text-muted">
              <CalendarDays
                aria-hidden={true}
                className="size-3.5"
              />
              Validity
            </span>

            <span className="font-medium text-foreground">
              {
                reward.validityDaysAfterIssue
              }{" "}
              days after issue
            </span>
          </div>

          {reward.endsAt ? (
            <div className="flex items-center justify-between gap-4">
              <span className="text-muted">
                Available until
              </span>

              <span className="font-medium text-foreground">
                {formatDate(
                  reward.endsAt
                )}
              </span>
            </div>
          ) : null}
        </div>

        {insufficientPoints ? (
          <p className="inline-flex items-center gap-2 text-xs text-muted">
            <LockKeyhole
              aria-hidden={true}
              className="size-3.5"
            />
            {(
              reward.pointsCost -
              (account?.availablePoints ??
                0)
            ).toLocaleString(
              "en-IN"
            )}{" "}
            more points required
          </p>
        ) : null}

        <Button
          fullWidth
          disabled={
            unavailable ||
            !onRedeem
          }
          loading={loading}
          loadingLabel="Redeeming Reward"
          onClick={() => {
            if (onRedeem) {
              void onRedeem(
                reward
              );
            }
          }}
        >
          {unavailable ? (
            <LockKeyhole
              aria-hidden={true}
              className="size-4"
            />
          ) : (
            <Gift
              aria-hidden={true}
              className="size-4"
            />
          )}

          {reward.status !==
          "active"
            ? "Reward Unavailable"
            : insufficientPoints
              ? "More Points Required"
              : tierRestricted
                ? "Tier Upgrade Required"
                : "Redeem Reward"}
        </Button>
      </div>
    </Card>
  );
}
