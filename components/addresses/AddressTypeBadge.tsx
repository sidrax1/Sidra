import {
  Building2,
  Home,
  MapPin,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import type { AddressType } from "@/components/addresses/AddressCard";

interface AddressTypeBadgeProps {
  readonly type: AddressType;
}

const labels: Record<
  AddressType,
  string
> = {
  home: "Home",
  work: "Work",
  other: "Other",
};

export function AddressTypeBadge({
  type,
}: AddressTypeBadgeProps): React.JSX.Element {
  const Icon =
    type === "home"
      ? Home
      : type === "work"
        ? Building2
        : MapPin;

  return (
    <Badge
      variant={
        type === "home"
          ? "gold"
          : "neutral"
      }
    >
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5"
      />
      {labels[type]}
    </Badge>
  );
}
