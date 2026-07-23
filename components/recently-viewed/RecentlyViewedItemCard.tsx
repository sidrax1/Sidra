"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  X,
} from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { Price } from "@/components/ui/Price";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { formatDateTime } from "@/lib/date";

export interface RecentlyViewedItem {
  readonly id: string;
  readonly productId: string;
  readonly productSlug: string;
  readonly productTitle: string;
  readonly studioName: string;
  readonly imageURL?: string | null;
  readonly pricePaise: number;
  readonly viewedAt: string;
}

interface RecentlyViewedItemCardProps {
  readonly item: RecentlyViewedItem;
  readonly removing?: boolean;
  readonly onRemove?: (
    item: RecentlyViewedItem
  ) => void | Promise<void>;
}

export function RecentlyViewedItemCard({
  item,
  onRemove,
  removing = false,
}: RecentlyViewedItemCardProps): React.JSX.Element {
  return (
    <article className="group relative overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-[var(--duration-base)] hover:-translate-y-1 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]">
      {onRemove ? (
        <div className="absolute right-3 top-3 z-10">
          <IconButton
            label={`Remove ${item.productTitle} from recently viewed`}
            icon={
              <X aria-hidden="true" />
            }
            appearance="glass"
            size="sm"
            disabled={removing}
            onClick={() => {
              void onRemove(item);
            }}
          />
        </div>
      ) : null}

      <Link
        href={PUBLIC_ROUTES.PRODUCT(
          item.productSlug
        )}
      >
        <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
          {item.imageURL ? (
            <Image
              src={item.imageURL}
              alt={item.productTitle}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
            />
          ) : null}

          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-4 pb-4 pt-12 text-white">
            <p className="text-xs text-white/65">
              {item.studioName}
            </p>

            <h3 className="mt-1 line-clamp-2 font-heading text-xl font-medium tracking-[-0.02em]">
              {item.productTitle}
            </h3>
          </div>
        </div>

        <div className="grid gap-3 p-4">
          <div className="flex items-center justify-between gap-4">
            <Price
              amount={
                item.pricePaise /
                100
              }
              size="sm"
            />

            <ArrowUpRight
              aria-hidden="true"
              className="size-4 text-[var(--color-gold-600)]"
            />
          </div>

          <p className="inline-flex items-center gap-2 text-xs text-muted">
            <Clock3
              aria-hidden="true"
              className="size-3.5"
            />
            Viewed{" "}
            {formatDateTime(
              item.viewedAt
            )}
          </p>
        </div>
      </Link>
    </article>
  );
}
