import {
  BadgeCheck,
  Box,
  ClipboardCheck,
  Hammer,
  PackageCheck,
  PackageOpen,
  Paintbrush,
  Radio,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  Truck,
  Wrench,
  Zap,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import type {
  ServicePartnerCapability,
} from "@/types/service-partner";

interface ServicePartnerCapabilityBadgeProps {
  readonly capability: ServicePartnerCapability;
}

const labels: Record<
  ServicePartnerCapability,
  string
> = {
  productInspection:
    "Product Inspection",
  resinRepair: "Resin Repair",
  surfaceRestoration:
    "Surface Restoration",
  structuralRepair:
    "Structural Repair",
  hardwareReplacement:
    "Hardware Replacement",
  electricalRepair:
    "Electrical Repair",
  customisationCorrection:
    "Customisation Correction",
  pickup: "Pickup",
  reverseLogistics:
    "Reverse Logistics",
  replacementDelivery:
    "Replacement Delivery",
  onSiteService:
    "On-site Service",
  remoteAssessment:
    "Remote Assessment",
  qualityCertification:
    "Quality Certification",
  securePackaging:
    "Secure Packaging",
};

export function ServicePartnerCapabilityBadge({
  capability,
}: ServicePartnerCapabilityBadgeProps): React.JSX.Element {
  const Icon =
    capability ===
    "productInspection"
      ? ClipboardCheck
      : capability ===
          "resinRepair"
        ? Wrench
        : capability ===
            "surfaceRestoration"
          ? Sparkles
          : capability ===
              "structuralRepair"
            ? Hammer
            : capability ===
                "hardwareReplacement"
              ? RefreshCcw
              : capability ===
                  "electricalRepair"
                ? Zap
                : capability ===
                    "customisationCorrection"
                  ? Paintbrush
                  : capability ===
                      "pickup"
                    ? Truck
                    : capability ===
                        "reverseLogistics"
                      ? PackageOpen
                      : capability ===
                          "replacementDelivery"
                        ? PackageCheck
                        : capability ===
                            "onSiteService"
                          ? ShieldCheck
                          : capability ===
                              "remoteAssessment"
                            ? Radio
                            : capability ===
                                "qualityCertification"
                              ? BadgeCheck
                              : Box;

  return (
    <Badge variant="neutral">
      <Icon
        aria-hidden="true"
        className="mr-1 size-3.5 text-[var(--color-gold-600)]"
      />
      {labels[capability]}
    </Badge>
  );
}
