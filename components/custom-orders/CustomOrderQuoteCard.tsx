"use client";

import {
  BadgeIndianRupee,
  CalendarClock,
  CheckCircle2,
  FileText,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Price } from "@/components/ui/Price";
import { Separator } from "@/components/ui/Separator";
import { Surface } from "@/components/ui/Surface";
import { formatDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import type { CustomOrderQuote } from "@/types/custom-order-workflow";

interface CustomOrderQuoteCardProps {
  readonly quote: CustomOrderQuote;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onAccept?: (
    quote: CustomOrderQuote
  ) => void | Promise<void>;
  readonly onRequestRevision?: (
    quote: CustomOrderQuote
  ) => void;
  readonly onDecline?: (
    quote: CustomOrderQuote
  ) => void | Promise<void>;
}

const statusLabels: Record<
  CustomOrderQuote["status"],
  string
> = {
  draft: "Draft",
  submitted: "Awaiting Decision",
  revisionRequested: "Revision Requested",
  accepted: "Accepted",
  declined: "Declined",
  expired: "Expired",
};

export function CustomOrderQuoteCard({
  className,
  loading = false,
  onAccept,
  onDecline,
  onRequestRevision,
  quote,
}: CustomOrderQuoteCardProps): React.JSX.Element {
  const actionable =
    quote.status === "submitted";

  return (
    <Surface
      padding="none"
      shadow="hover"
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="flex flex-col gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.06)] px-6 py-6 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.32)] bg-card text-[var(--color-gold-600)] shadow-[var(--shadow-card)]">
            <BadgeIndianRupee
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
              Formal Studio Quote
            </p>

            <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.035em] text-foreground">
              {quote.studioName}
            </h2>

            <p className="mt-2 text-sm text-muted">
              Issued {formatDate(quote.createdAt)}
            </p>
          </div>
        </div>

        <div className="text-right">
          <Price
            amount={quote.totalPaise / 100}
            size="xl"
          />

          <Badge variant="gold" className="mt-3">
            {statusLabels[quote.status]}
          </Badge>
        </div>
      </header>

      <div className="grid gap-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Production
            </p>

            <p className="mt-2 inline-flex items-center gap-2 font-medium text-foreground">
              <CalendarClock
                aria-hidden="true"
                className="size-4 text-[var(--color-gold-600)]"
              />
              {quote.estimatedProductionDays.toLocaleString(
                "en-IN"
              )}{" "}
              days
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Valid Until
            </p>

            <p className="mt-2 font-medium text-foreground">
              {formatDate(quote.validUntil)}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Revisions
            </p>

            <p className="mt-2 font-medium text-foreground">
              {quote.revisionNumber}/
              {quote.maximumRevisionCount}
            </p>
          </div>
        </div>

        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Crafting amount</span>
            <Price
              amount={quote.amountPaise / 100}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Shipping</span>
            <Price
              amount={quote.shippingFeePaise / 100}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Tax</span>
            <Price
              amount={quote.taxPaise / 100}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between gap-5 text-muted">
            <span>Platform service</span>
            <Price
              amount={quote.platformFeePaise / 100}
              size="sm"
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between gap-5 font-semibold text-foreground">
            <span>Total</span>
            <Price
              amount={quote.totalPaise / 100}
              size="lg"
            />
          </div>
        </div>

        {quote.notes ? (
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <FileText
                aria-hidden="true"
                className="size-4 text-[var(--color-gold-600)]"
              />
              Studio Notes
            </p>

            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-muted">
              {quote.notes}
            </p>
          </div>
        ) : null}

        {quote.terms ? (
          <div className="flex items-start gap-3 text-xs leading-6 text-muted">
            <ShieldCheck
              aria-hidden="true"
              className="mt-0.5 size-4 shrink-0 text-[var(--color-gold-600)]"
            />

            <p>{quote.terms}</p>
          </div>
        ) : null}

        {actionable ? (
          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            {onDecline ? (
              <Button
                variant="ghost"
                disabled={loading}
                className="text-[var(--color-error)]"
                onClick={() => {
                  void onDecline(quote);
                }}
              >
                <XCircle aria-hidden="true" />
                Decline
              </Button>
            ) : null}

            {onRequestRevision &&
            quote.revisionNumber <
              quote.maximumRevisionCount ? (
              <Button
                variant="outline"
                disabled={loading}
                onClick={() =>
                  onRequestRevision(quote)
                }
              >
                Request Revision
              </Button>
            ) : null}

            {onAccept ? (
              <Button
                disabled={loading}
                loading={loading}
                loadingLabel="Accepting Quote"
                onClick={() => {
                  void onAccept(quote);
                }}
              >
                <CheckCircle2 aria-hidden="true" />
                Accept Quote
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
    </Surface>
  );
}
