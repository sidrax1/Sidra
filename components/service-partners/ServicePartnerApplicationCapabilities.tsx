import {
  MapPin,
  ShieldCheck,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  ServicePartnerCapabilityBadge,
} from "@/components/service-partners/ServicePartnerCapabilityBadge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationCapabilitiesProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

export function ServicePartnerApplicationCapabilities({
  application,
  className,
}: ServicePartnerApplicationCapabilitiesProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <ShieldCheck
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Requested Capabilities
        </h2>
      </header>

      <div className="grid gap-6 p-6">
        <div className="flex flex-wrap gap-2">
          {application.capabilities.map(
            (capability) => (
              <ServicePartnerCapabilityBadge
                key={capability}
                capability={
                  capability
                }
              />
            )
          )}
        </div>

        <div className="border-t border-border pt-5">
          <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            <MapPin
              aria-hidden={true}
              className="size-3.5 text-[var(--color-gold-600)]"
            />
            Requested Coverage
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {application.coverageStates.map(
              (state) => (
                <Badge
                  key={state}
                  variant="gold"
                >
                  {state}
                </Badge>
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
