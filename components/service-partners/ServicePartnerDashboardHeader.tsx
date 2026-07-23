"use client";

import {
  Building2,
  Download,
  Plus,
  RefreshCw,
  ShieldCheck,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";

interface ServicePartnerDashboardHeaderProps {
  readonly totalPartners: number;
  readonly activePartners: number;
  readonly pendingApplications: number;
  readonly refreshing?: boolean;
  readonly className?: string;
  readonly onRefresh?: () => void | Promise<void>;
  readonly onCreateApplication?: () => void;
  readonly onExport?: () => void | Promise<void>;
}

export function ServicePartnerDashboardHeader({
  activePartners,
  className,
  onCreateApplication,
  onExport,
  onRefresh,
  pendingApplications,
  refreshing = false,
  totalPartners,
}: ServicePartnerDashboardHeaderProps): React.JSX.Element {
  return (
    <header
      className={cn(
        "relative overflow-hidden rounded-[var(--radius-xl)] border border-[color:rgb(200_169_106_/_0.3)] bg-[var(--color-black-900)] px-6 py-9 text-white shadow-[var(--shadow-hover)] md:px-10",
        className
      )}
    >
      <div
        aria-hidden={true}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_88%_4%,rgba(200,169,106,0.4),transparent_44%)]"
      />

      <div className="relative z-10 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-4xl">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="gold">
              <ShieldCheck
                aria-hidden={true}
                className="mr-1 size-3.5"
              />
              Verified Service Network
            </Badge>

            <Badge variant="neutral">
              {activePartners.toLocaleString(
                "en-IN"
              )}{" "}
              Active
            </Badge>
          </div>

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-500)]">
            Sidra Operations
          </p>

          <h1 className="mt-3 font-heading text-[clamp(3rem,7vw,6.2rem)] font-medium leading-[0.9] tracking-[-0.06em]">
            Service Partners
          </h1>

          <p className="mt-5 max-w-3xl text-sm leading-7 text-white/65">
            Manage verified repair, inspection, restoration, logistics
            and quality-assurance partners across the Sidra service
            ecosystem.
          </p>

          <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 text-sm text-white/60">
            <span className="inline-flex items-center gap-2">
              <Building2
                aria-hidden={true}
                className="size-4"
              />
              {totalPartners.toLocaleString(
                "en-IN"
              )}{" "}
              total partners
            </span>

            <span>
              {pendingApplications.toLocaleString(
                "en-IN"
              )}{" "}
              pending applications
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {onRefresh ? (
            <Button
              variant="outline"
              disabled={refreshing}
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                void onRefresh();
              }}
            >
              <RefreshCw
                aria-hidden={true}
                className={cn(
                  "size-4",
                  refreshing &&
                    "animate-spin"
                )}
              />
              Refresh
            </Button>
          ) : null}

          {onExport ? (
            <Button
              variant="outline"
              className="border-white/20 bg-white/5 text-white hover:bg-white/10"
              onClick={() => {
                void onExport();
              }}
            >
              <Download
                aria-hidden={true}
                className="size-4"
              />
              Export
            </Button>
          ) : null}

          {onCreateApplication ? (
            <Button
              onClick={
                onCreateApplication
              }
            >
              <Plus
                aria-hidden={true}
                className="size-4"
              />
              New Application
            </Button>
          ) : null}
        </div>
      </div>
    </header>
  );
}
