import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarClock,
  Gift,
  History,
  PackageCheck,
  RefreshCcw,
  Star,
  UserPlus,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  LoyaltyTransaction,
  LoyaltyTransactionType,
} from "@/types/loyalty";

interface LoyaltyTransactionListProps {
  readonly transactions: readonly LoyaltyTransaction[];
  readonly showBalance?: boolean;
  readonly className?: string;
}

const transactionLabels: Record<
  LoyaltyTransactionType,
  string
> = {
  orderEarned: "Order Reward",
  reviewEarned: "Review Reward",
  referralEarned: "Referral Reward",
  campaignBonus: "Campaign Bonus",
  manualCredit: "Manual Credit",
  rewardRedeemed: "Reward Redeemed",
  orderReversal: "Order Reversal",
  refundReversal: "Refund Reversal",
  pointsExpired: "Points Expired",
  manualDebit: "Manual Debit",
};

function resolveIcon(
  type: LoyaltyTransactionType
): React.ComponentType<{
  readonly className?: string;
  readonly "aria-hidden"?: boolean;
}> {
  if (
    type === "orderEarned"
  ) {
    return PackageCheck;
  }

  if (
    type === "reviewEarned"
  ) {
    return Star;
  }

  if (
    type ===
    "referralEarned"
  ) {
    return UserPlus;
  }

  if (
    type ===
      "campaignBonus" ||
    type ===
      "manualCredit"
  ) {
    return Gift;
  }

  if (
    type ===
    "rewardRedeemed"
  ) {
    return ArrowUpRight;
  }

  if (
    type ===
      "orderReversal" ||
    type ===
      "refundReversal"
  ) {
    return RefreshCcw;
  }

  if (
    type ===
    "pointsExpired"
  ) {
    return CalendarClock;
  }

  return ArrowDownLeft;
}

export function LoyaltyTransactionList({
  className,
  showBalance = true,
  transactions,
}: LoyaltyTransactionListProps): React.JSX.Element {
  if (
    transactions.length === 0
  ) {
    return (
      <EmptyState
        title="No loyalty activity"
        description="Points earned, redeemed, reversed or expired will appear here."
      />
    );
  }

  const orderedTransactions =
    [...transactions].sort(
      (
        firstTransaction,
        secondTransaction
      ) =>
        secondTransaction.createdAt.localeCompare(
          firstTransaction.createdAt
        )
    );

  return (
    <section
      aria-label="Loyalty point activity"
      className={cn(
        "grid gap-4",
        className
      )}
    >
      {orderedTransactions.map(
        (transaction) => {
          const positive =
            transaction.points > 0;

          const Icon =
            resolveIcon(
              transaction.type
            );

          return (
            <article
              key={transaction.id}
              className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)] transition-[border-color,box-shadow] hover:border-[color:rgb(200_169_106_/_0.36)] hover:shadow-[var(--shadow-hover)]"
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "flex size-11 shrink-0 items-center justify-center rounded-full border",
                    positive
                      ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]"
                      : "border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-5"
                  />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="font-medium text-foreground">
                          {transaction.description}
                        </h3>

                        <Badge
                          variant={
                            positive
                              ? "success"
                              : "neutral"
                          }
                        >
                          {transactionLabels[
                            transaction.type
                          ]}
                        </Badge>
                      </div>

                      <time className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
                        <History
                          aria-hidden="true"
                          className="size-3.5"
                        />
                        {formatDateTime(
                          transaction.createdAt
                        )}
                      </time>
                    </div>

                    <p
                      className={cn(
                        "font-heading text-3xl font-medium tracking-[-0.03em]",
                        positive
                          ? "text-[var(--color-success)]"
                          : "text-foreground"
                      )}
                    >
                      {positive
                        ? "+"
                        : ""}
                      {transaction.points.toLocaleString(
                        "en-IN"
                      )}
                    </p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-4 text-xs text-muted">
                    {showBalance ? (
                      <span>
                        Balance{" "}
                        <strong className="font-medium text-foreground">
                          {transaction.balanceBefore.toLocaleString(
                            "en-IN"
                          )}
                        </strong>{" "}
                        →{" "}
                        <strong className="font-medium text-foreground">
                          {transaction.balanceAfter.toLocaleString(
                            "en-IN"
                          )}
                        </strong>
                      </span>
                    ) : null}

                    {transaction.metadata.orderNumber ? (
                      <span>
                        Order #
                        {
                          transaction
                            .metadata
                            .orderNumber
                        }
                      </span>
                    ) : null}

                    {transaction.availableAt ? (
                      <span>
                        Available{" "}
                        {formatDateTime(
                          transaction.availableAt
                        )}
                      </span>
                    ) : null}

                    {transaction.expiresAt ? (
                      <span>
                        Expires{" "}
                        {formatDateTime(
                          transaction.expiresAt
                        )}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </article>
          );
        }
      )}
    </section>
  );
}
