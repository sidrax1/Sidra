import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  PackageSearch,
  Store,
} from "lucide-react";

import { ReturnStatusBadge } from "@/components/returns/ReturnStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Price } from "@/components/ui/Price";
import { formatDate } from "@/lib/date";
import type { ReturnRequest } from "@/types/return";

interface ReturnRequestCardProps {
  readonly request: ReturnRequest;
  readonly href?: string;
}

export function ReturnRequestCard({
  href,
  request,
}: ReturnRequestCardProps): React.JSX.Element {
  const primaryItem = request.item;

  return (
    <Card className="group overflow-hidden transition-[transform,border-color,box-shadow] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.4)] hover:shadow-[var(--shadow-hover)]">
      <div className="grid gap-6 p-5 md:grid-cols-[110px_minmax(0,1fr)_auto] md:items-start">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-[var(--color-gray-100)]">
          {primaryItem.productImageURL ? (
            <Image
              src={primaryItem.productImageURL}
              alt={primaryItem.productTitle}
              fill
              sizes="110px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PackageSearch className="size-7 text-muted" />
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-3">
            <ReturnStatusBadge status={request.status} />

            <Badge variant="neutral">
              #{request.returnNumber}
            </Badge>
          </div>

          <h2 className="mt-4 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {primaryItem?.productTitle ?? "Return request"}
          </h2>

          <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted">
            {request.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
            <span className="inline-flex items-center gap-2">
              <Store className="size-3.5 text-[var(--color-gold-600)]" />
              Order #{request.orderNumber}
            </span>

            <span className="inline-flex items-center gap-2">
              <CalendarDays className="size-3.5 text-[var(--color-gold-600)]" />
              Requested {formatDate(request.createdAt)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 md:flex-col md:items-end">
          <Price
            amount={request.financialSummary.finalRefundPaise / 100}
            size="lg"
          />

          <Button asChild variant="outline" size="sm">
            <Link
              href={
                href ??
                `/account/returns/${request.id}`
              }
            >
              View Return
              <ArrowUpRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
