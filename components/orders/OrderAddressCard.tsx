import {
  Building2,
  Home,
  MapPin,
  Phone,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  cn,
} from "@/lib/utils";
import type {
  OrderAddressSnapshot,
} from "@/types/order";

interface OrderAddressCardProps {
  readonly title: string;
  readonly address: OrderAddressSnapshot;
  readonly type?: "shipping" | "billing";
  readonly className?: string;
}

export function OrderAddressCard({
  address,
  className,
  title,
  type = "shipping",
}: OrderAddressCardProps): React.JSX.Element {
  const Icon =
    type === "shipping"
      ? Home
      : Building2;

  return (
    <Surface
      className={cn(
        "grid gap-5",
        className
      )}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
            <Icon
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-gold-600)]">
              {type === "shipping"
                ? "Delivery Destination"
                : "Invoice Destination"}
            </p>

            <h2 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              {title}
            </h2>
          </div>
        </div>

        <Badge variant="neutral">
          {type === "shipping"
            ? "Shipping"
            : "Billing"}
        </Badge>
      </header>

      <div className="border-t border-border pt-5">
        <p className="font-medium text-foreground">
          {address.fullName}
        </p>

        <address className="mt-3 not-italic text-sm leading-7 text-muted">
          {address.line1}
          {address.line2
            ? `, ${address.line2}`
            : ""}
          {address.landmark
            ? `, ${address.landmark}`
            : ""}
          <br />
          {address.city},{" "}
          {address.state}{" "}
          {address.postalCode}
          <br />
          {address.country}
        </address>

        <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
          <span className="inline-flex items-center gap-2">
            <Phone
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {address.mobile}
          </span>

          <span className="inline-flex items-center gap-2">
            <MapPin
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            {address.postalCode}
          </span>
        </div>
      </div>
    </Surface>
  );
}
