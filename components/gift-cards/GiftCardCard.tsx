import Image from "next/image";
import {
  CalendarDays,
  Gift,
  Mail,
  WalletCards,
} from "lucide-react";

import { GiftCardStatusBadge } from "@/components/gift-cards/GiftCardStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { formatDate } from "@/lib/date";
import type {
  GiftCard,
  GiftCardDesign,
} from "@/types/gift-card";

interface GiftCardCardProps {
  readonly giftCard: GiftCard;
  readonly design?: GiftCardDesign;
}

export function GiftCardCard({
  design,
  giftCard,
}: GiftCardCardProps): React.JSX.Element {
  const usedPaise =
    giftCard.originalValuePaise -
    giftCard.remainingValuePaise;

  const usedPercentage =
    giftCard.originalValuePaise > 0
      ? Math.min(
          Math.max(
            (usedPaise /
              giftCard.originalValuePaise) *
              100,
            0
          ),
          100
        )
      : 0;

  return (
    <Card className="group overflow-hidden transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]">
      <div className="relative aspect-[1.6/1] overflow-hidden bg-[var(--color-black-900)]">
        {design?.imageURL ? (
          <Image
            src={design.imageURL}
            alt={design.name}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <Gift
              aria-hidden={true}
              className="size-14 text-[var(--color-gold-500)]"
            />
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-5 p-5 text-white">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-white/60">
              Sydra Gift Card
            </p>

            <p className="mt-2 font-mono text-sm font-semibold">
              {giftCard.codeMasked}
            </p>
          </div>

          <Price
            amount={giftCard.originalValuePaise / 100}
            size="lg"
            className="text-white"
          />
        </div>
      </div>

      <div className="grid gap-5 p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <GiftCardStatusBadge status={giftCard.status} />

          <Badge variant="neutral">
            <Mail
              aria-hidden={true}
              className="mr-1 size-3.5"
            />
            {giftCard.deliveryStatus}
          </Badge>
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Remaining Balance
          </p>

          <Price
            amount={giftCard.remainingValuePaise / 100}
            size="xl"
            className="mt-2"
          />
        </div>

        <div>
          <div className="flex items-center justify-between gap-4 text-xs text-muted">
            <span>Used</span>
            <span>
              {usedPercentage.toFixed(0)}%
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-background">
            <div
              className="h-full rounded-full bg-[var(--color-gold-500)]"
              style={{
                width: `${usedPercentage}%`,
              }}
            />
          </div>
        </div>

        <div className="grid gap-2 border-t border-border pt-4 text-xs text-muted">
          <p className="inline-flex items-center gap-2">
            <WalletCards
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            For {giftCard.recipientName}
          </p>

          <p className="inline-flex items-center gap-2">
            <CalendarDays
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Expires {formatDate(giftCard.expiresAt)}
          </p>
        </div>
      </div>
    </Card>
  );
}
