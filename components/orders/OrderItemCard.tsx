import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Layers3,
  Package,
  Store,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Price } from "@/components/ui/Price";
import { PUBLIC_ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { OrderItem } from "@/types/order";

interface OrderItemCardProps {
  readonly item: OrderItem;
  readonly className?: string;
  readonly showProductLink?: boolean;
}

export function OrderItemCard({
  className,
  item,
  showProductLink = true,
}: OrderItemCardProps): React.JSX.Element {
  const productHref = PUBLIC_ROUTES.PRODUCT(
    item.product.slug
  );

  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card",
        "shadow-[var(--shadow-card)] transition-[border-color,box-shadow]",
        "hover:border-[color:rgb(200_169_106_/_0.38)] hover:shadow-[var(--shadow-hover)]",
        className
      )}
    >
      <div className="grid gap-5 p-5 sm:grid-cols-[112px_minmax(0,1fr)_auto] sm:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-gray-100)]">
          {item.product.imageURL ? (
            <Image
              src={item.product.imageURL}
              alt={item.product.title}
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <Package
                aria-hidden="true"
                className="size-7 text-muted"
              />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="neutral">
              Quantity{" "}
              {item.quantity.toLocaleString(
                "en-IN"
              )}
            </Badge>

            {item.product.sku ? (
              <Badge variant="gold">
                SKU {item.product.sku}
              </Badge>
            ) : null}
          </div>

          <h3 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {item.product.title}
          </h3>

          <p className="mt-2 inline-flex items-center gap-2 text-xs text-muted">
            <Store
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {item.product.studioName}
          </p>

          {item.customizations.length >
          0 ? (
            <dl className="mt-5 grid gap-2 rounded-[var(--radius-md)] border border-border bg-background p-4 text-xs">
              <div className="mb-1 inline-flex items-center gap-2 font-medium text-foreground">
                <Layers3
                  aria-hidden="true"
                  className="size-3.5 text-[var(--color-gold-600)]"
                />
                Personalisation
              </div>

              {item.customizations.map(
                (customization) => (
                  <div
                    key={`${customization.label}-${customization.value}`}
                    className="flex items-start justify-between gap-4"
                  >
                    <dt className="text-muted">
                      {customization.label}
                    </dt>

                    <dd className="text-right font-medium text-foreground">
                      {customization.value}
                    </dd>
                  </div>
                )
              )}
            </dl>
          ) : null}

          {item.customerNote ? (
            <div className="mt-4 rounded-[var(--radius-md)] border border-[color:rgb(200_169_106_/_0.25)] bg-[color:rgb(200_169_106_/_0.05)] p-4">
              <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-gold-600)]">
                Collector Note
              </p>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-muted">
                {item.customerNote}
              </p>
            </div>
          ) : null}

          {showProductLink ? (
            <Link
              href={productHref}
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-gold-600)]"
            >
              View Product
              <ArrowUpRight
                aria-hidden="true"
                className="size-4"
              />
            </Link>
          ) : null}
        </div>

        <div className="grid gap-3 sm:min-w-36 sm:text-right">
          <Price
            amount={
              item.totalPaise / 100
            }
            size="lg"
          />

          <p className="text-xs text-muted">
            {item.quantity.toLocaleString(
              "en-IN"
            )}{" "}
            ×{" "}
            <Price
              amount={
                item.unitPricePaise /
                100
              }
              size="sm"
              className="inline"
            />
          </p>

          {item.discountPaise > 0 ? (
            <p className="text-xs font-medium text-[var(--color-success)]">
              Saved{" "}
              <Price
                amount={
                  item.discountPaise /
                  100
                }
                size="sm"
                className="inline text-[var(--color-success)]"
              />
            </p>
          ) : null}
        </div>
      </div>
    </article>
  );
}
