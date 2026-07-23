import {
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import {
  Avatar,
} from "@/components/ui/Avatar";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ProductWarranty,
} from "@/types/warranty";

interface WarrantyOwnershipCardProps {
  readonly warranty: ProductWarranty;
  readonly ownerPhotoURL?: string | null;
  readonly className?: string;
}

export function WarrantyOwnershipCard({
  className,
  ownerPhotoURL,
  warranty,
}: WarrantyOwnershipCardProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
            <UserRound
              aria-hidden="true"
              className="size-4"
            />
          </span>

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Warranty Owner
          </h2>
        </div>

        <Badge
          variant={
            warranty.status ===
            "transferred"
              ? "warning"
              : "success"
          }
        >
          <ShieldCheck
            aria-hidden="true"
            className="mr-1 size-3.5"
          />
          Verified Owner
        </Badge>
      </header>

      <div className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <Avatar
            name={
              warranty.owner
                .customerName
            }
            src={ownerPhotoURL}
            size="lg"
          />

          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
              {
                warranty.owner
                  .customerName
              }
            </h3>

            <div className="mt-4 grid gap-3 text-sm text-muted">
              <a
                href={`mailto:${warranty.owner.customerEmail}`}
                className="inline-flex w-fit items-center gap-2 transition-colors hover:text-foreground"
              >
                <Mail
                  aria-hidden="true"
                  className="size-4 text-[var(--color-gold-600)]"
                />
                {
                  warranty.owner
                    .customerEmail
                }
              </a>

              {warranty.owner
                .customerPhone ? (
                <a
                  href={`tel:${warranty.owner.customerPhone}`}
                  className="inline-flex w-fit items-center gap-2 transition-colors hover:text-foreground"
                >
                  <Phone
                    aria-hidden="true"
                    className="size-4 text-[var(--color-gold-600)]"
                  />
                  {
                    warranty.owner
                      .customerPhone
                  }
                </a>
              ) : null}
            </div>
          </div>
        </div>

        {warranty.transferredAt ? (
          <div className="mt-6 rounded-[var(--radius-md)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-600)]">
              Ownership Transfer
            </p>

            <p className="mt-2 text-sm leading-6 text-muted">
              Ownership was transferred{" "}
              {formatDateTime(
                warranty.transferredAt
              )}
              .
            </p>

            {warranty.previousOwnerId ? (
              <p className="mt-2 font-mono text-xs text-muted">
                Previous owner ID:{" "}
                {
                  warranty.previousOwnerId
                }
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    </section>
  );
}
