"use client";

import {
  CalendarDays,
  Copy,
  MoreVertical,
  Sparkles,
  UsersRound,
} from "lucide-react";

import { PromotionStatusBadge } from "@/components/promotions/PromotionStatusBadge";
import { PromotionValueBadge } from "@/components/promotions/PromotionValueBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { formatDateTime } from "@/lib/date";
import type { Promotion } from "@/types/promotion";

interface PromotionCardProps {
  readonly promotion: Promotion;
  readonly disabled?: boolean;
  readonly onEdit?: (promotion: Promotion) => void;
  readonly onDuplicate?: (promotion: Promotion) => void;
  readonly onPause?: (promotion: Promotion) => void;
  readonly onActivate?: (promotion: Promotion) => void;
  readonly onArchive?: (promotion: Promotion) => void;
}

export function PromotionCard({
  disabled = false,
  onActivate,
  onArchive,
  onDuplicate,
  onEdit,
  onPause,
  promotion,
}: PromotionCardProps): React.JSX.Element {
  return (
    <Card className="group overflow-hidden transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]">
      <div className="relative border-b border-border bg-[color:rgb(200_169_106_/_0.05)] px-6 py-5">
        <div className="flex items-start justify-between gap-5">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <PromotionStatusBadge status={promotion.status} />
              <PromotionValueBadge value={promotion.value} />

              {promotion.automatic ? (
                <Badge variant="success">
                  <Sparkles
                    aria-hidden="true"
                    className="mr-1 size-3.5"
                  />
                  Automatic
                </Badge>
              ) : null}
            </div>

            <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {promotion.name}
            </h2>

            {promotion.code ? (
              <button
                type="button"
                disabled={disabled}
                className="mt-3 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs text-foreground"
                onClick={() => {
                  void navigator.clipboard.writeText(
                    promotion.code ?? ""
                  );
                }}
              >
                <Copy
                  aria-hidden="true"
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                {promotion.code}
              </button>
            ) : null}
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <IconButton
                label="Promotion actions"
                icon={
                  <MoreVertical aria-hidden="true" />
                }
                appearance="ghost"
                disabled={disabled}
              />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              {onEdit ? (
                <DropdownMenuItem
                  onSelect={() => onEdit(promotion)}
                >
                  Edit promotion
                </DropdownMenuItem>
              ) : null}

              {onDuplicate ? (
                <DropdownMenuItem
                  onSelect={() => onDuplicate(promotion)}
                >
                  Duplicate promotion
                </DropdownMenuItem>
              ) : null}

              {promotion.status === "active" && onPause ? (
                <DropdownMenuItem
                  onSelect={() => onPause(promotion)}
                >
                  Pause promotion
                </DropdownMenuItem>
              ) : null}

              {promotion.status !== "active" &&
              promotion.status !== "archived" &&
              onActivate ? (
                <DropdownMenuItem
                  onSelect={() => onActivate(promotion)}
                >
                  Activate promotion
                </DropdownMenuItem>
              ) : null}

              {onArchive ? (
                <DropdownMenuItem
                  destructive
                  onSelect={() => onArchive(promotion)}
                >
                  Archive promotion
                </DropdownMenuItem>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-5 p-6">
        {promotion.description ? (
          <p className="line-clamp-3 text-sm leading-7 text-muted">
            {promotion.description}
          </p>
        ) : null}

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <CalendarDays
                aria-hidden="true"
                className="size-3.5"
              />
              Active Window
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {formatDateTime(promotion.startsAt)}
            </p>

            <p className="mt-1 text-xs text-muted">
              {promotion.endsAt
                ? `Until ${formatDateTime(promotion.endsAt)}`
                : "No scheduled end"}
            </p>
          </div>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-muted">
              <UsersRound
                aria-hidden="true"
                className="size-3.5"
              />
              Usage
            </p>

            <p className="mt-2 text-sm font-medium text-foreground">
              {promotion.usage.usageCount.toLocaleString(
                "en-IN"
              )}{" "}
              redemptions
            </p>

            <p className="mt-1 text-xs text-muted">
              {promotion.usage.totalUsageLimit
                ? `${promotion.usage.totalUsageLimit.toLocaleString(
                    "en-IN"
                  )} total limit`
                : "Unlimited total usage"}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
