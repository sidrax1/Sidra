import {
  BadgeCheck,
  Boxes,
  Building2,
  ClipboardCheck,
  Hammer,
  PackageCheck,
  Paintbrush,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerType,
} from "@/types/service-partner";

interface ServicePartnerTypeBadgeProps {
  readonly type: ServicePartnerType;
}

const typeLabels: Record<
  ServicePartnerType,
  string
> = {
  repairStudio:
    "Repair Studio",
  inspectionCentre:
    "Inspection Centre",
  logisticsPartner:
    "Logistics Partner",
  installationPartner:
    "Installation Partner",
  restorationSpecialist:
    "Restoration Specialist",
  qualityAssuranceCentre:
    "Quality Assurance Centre",
  multiServicePartner:
    "Multi-service Partner",
};

export function ServicePartnerTypeBadge({
  type,
}: ServicePartnerTypeBadgeProps): React.JSX.Element {
  const Icon =
    type === "repairStudio"
      ? Hammer
      : type ===
          "inspectionCentre"
        ? ClipboardCheck
        : type ===
            "logisticsPartner"
          ? PackageCheck
          : type ===
              "installationPartner"
            ? Building2
            : type ===
                "restorationSpecialist"
              ? Paintbrush
              : type ===
                  "qualityAssuranceCentre"
                ? BadgeCheck
                : Boxes;

  return (
    <Badge variant="neutral">
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5 text-[var(--color-gold-600)]"
      />

      {typeLabels[type]}
    </Badge>
  );
}
