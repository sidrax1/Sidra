import {
  Crown,
  Gem,
  Sparkles,
  Star,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  LoyaltyTier,
} from "@/types/loyalty";

interface LoyaltyTierBadgeProps {
  readonly tier: LoyaltyTier;
  readonly showIcon?: boolean;
  readonly className?: string;
}

const labels: Record<
  LoyaltyTier,
  string
> = {
  atelier: "Atelier",
  signature: "Signature",
  prestige: "Prestige",
  maison: "Maison",
};

export function LoyaltyTierBadge({
  className,
  showIcon = true,
  tier,
}: LoyaltyTierBadgeProps): React.JSX.Element {
  const Icon =
    tier === "maison"
      ? Crown
      : tier === "prestige"
        ? Gem
        : tier === "signature"
          ? Sparkles
          : Star;

  const variant =
    tier === "maison" ||
    tier === "prestige"
      ? "gold"
      : tier === "signature"
        ? "success"
        : "neutral";

  return (
    <Badge
      variant={variant}
      className={cn(
        tier === "maison" &&
          "border-[color:rgb(200_169_106_/_0.55)] bg-[var(--color-black-900)] text-[var(--color-gold-500)]",
        className
      )}
    >
      {showIcon ? (
        <Icon
          aria-hidden={true}
          className="mr-1 size-3.5"
        />
      ) : null}

      {labels[tier]}
    </Badge>
  );
}
