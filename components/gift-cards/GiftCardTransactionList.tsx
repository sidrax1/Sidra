import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  History,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Price } from "@/components/ui/Price";
import { formatDateTime } from "@/lib/date";
import type { GiftCardTransaction } from "@/types/gift-card";

interface GiftCardTransactionListProps {
  readonly transactions: readonly GiftCardTransaction[];
}

export function GiftCardTransactionList({
  transactions,
}: GiftCardTransactionListProps): React.JSX.Element {
  if (transactions.length === 0) {
    return (
      <EmptyState
        title="No gift card activity"
        description="Purchases, redemptions and balance adjustments will appear here."
      />
    );
  }

  return (
    <section
      aria-label="Gift card transactions"
      className="grid gap-4"
    >
      {transactions.map((transaction) => {
        const credit =
          transaction.amountPaise > 0;

        return (
          <article
            key={transaction.id}
            className="rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]"
          >
            <div className="flex items-start gap-4">
              <span
                className={[
                  "flex size-11 shrink-0 items-center justify-center rounded-full border",
                  credit
                    ? "border-[color:rgb(62_107_82_/_0.3)] bg-[color:rgb(62_107_82_/_0.08)] text-[var(--color-success)]"
                    : "border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]",
                ].join(" ")}
              >
                {transaction.type === "purchase" ? (
                  <Gift
                    aria-hidden={true}
                    className="size-5"
                  />
                ) : credit ? (
                  <ArrowDownLeft
                    aria-hidden={true}
                    className="size-5"
                  />
                ) : (
                  <ArrowUpRight
                    aria-hidden={true}
                    className="size-5"
                  />
                )}
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-medium text-foreground">
                      {transaction.description}
                    </h3>

                    <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
                      <History
                        aria-hidden={true}
                        className="size-3.5"
                      />
                      {formatDateTime(transaction.createdAt)}
                    </p>
                  </div>

                  <Price
                    amount={transaction.amountPaise / 100}
                    size="lg"
                    className={
                      credit
                        ? "text-[var(--color-success)]"
                        : undefined
                    }
                  />
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border pt-4">
                  <Badge variant="neutral">
                    {transaction.type}
                  </Badge>

                  <span className="text-xs text-muted">
                    Balance{" "}
                    <Price
                      amount={
                        transaction.balanceBeforePaise / 100
                      }
                      size="sm"
                      className="inline"
                    />{" "}
                    →{" "}
                    <Price
                      amount={
                        transaction.balanceAfterPaise / 100
                      }
                      size="sm"
                      className="inline"
                    />
                  </span>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
