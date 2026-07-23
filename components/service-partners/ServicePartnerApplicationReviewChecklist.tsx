import type {
  ShieldCheck} from "lucide-react";
import {
  BadgeCheck,
  Building2,
  FileCheck2,
  MapPin,
  UserRound,
  Wrench,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationReviewChecklistProps {
  readonly application: ServicePartnerApplication;
  readonly className?: string;
}

interface ReviewCheck {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly complete: boolean;
  readonly icon: typeof ShieldCheck;
}

export function ServicePartnerApplicationReviewChecklist({
  application,
  className,
}: ServicePartnerApplicationReviewChecklistProps): React.JSX.Element {
  const checks: readonly ReviewCheck[] = [
    {
      id: "business",
      title: "Business Identity",
      description:
        "Legal and display business names are present and reviewable.",
      complete:
        application.legalName.trim().length >= 2 &&
        application.displayName.trim().length >= 2,
      icon: Building2,
    },
    {
      id: "contact",
      title: "Primary Contact",
      description:
        "Applicant contact name, email and phone number are available.",
      complete:
        application.contact.contactName.trim().length >= 2 &&
        application.contact.email.includes("@") &&
        application.contact.phoneNumber.length === 10,
      icon: UserRound,
    },
    {
      id: "address",
      title: "Registered Address",
      description:
        "Complete city, state and postal-code information is available.",
      complete:
        application.registeredAddress.addressLine1.trim().length >= 5 &&
        application.registeredAddress.city.trim().length >= 2 &&
        application.registeredAddress.state.trim().length >= 2 &&
        application.registeredAddress.postalCode.length === 6,
      icon: MapPin,
    },
    {
      id: "capabilities",
      title: "Service Capabilities",
      description:
        "At least one service capability has been selected.",
      complete: application.capabilities.length > 0,
      icon: Wrench,
    },
    {
      id: "coverage",
      title: "Coverage Region",
      description:
        "The applicant has declared at least one service state.",
      complete: application.coverageStates.length > 0,
      icon: MapPin,
    },
    {
      id: "documents",
      title: "Verification Documents",
      description:
        "Supporting legal, identity or operational documents are attached.",
      complete: application.documentPaths.length > 0,
      icon: FileCheck2,
    },
  ];

  const completedChecks = checks.filter(
    (check) => check.complete
  ).length;

  const complete =
    completedChecks === checks.length;

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex flex-col gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Verification Readiness
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Review Checklist
          </h2>
        </div>

        <Badge
          variant={
            complete
              ? "success"
              : "warning"
          }
        >
          <BadgeCheck
            aria-hidden="true"
            className="mr-1 size-3.5"
          />
          {completedChecks}/{checks.length} Complete
        </Badge>
      </header>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        {checks.map((check) => {
          const Icon = check.icon;

          return (
            <article
              key={check.id}
              className={cn(
                "rounded-[var(--radius-lg)] border p-5",
                check.complete
                  ? "border-[color:rgb(62_107_82_/_0.28)] bg-[color:rgb(62_107_82_/_0.05)]"
                  : "border-[color:rgb(173_118_38_/_0.3)] bg-[color:rgb(173_118_38_/_0.05)]"
              )}
            >
              <div className="flex items-start gap-4">
                <span
                  className={cn(
                    "flex size-10 shrink-0 items-center justify-center rounded-full border",
                    check.complete
                      ? "border-[color:rgb(62_107_82_/_0.3)] text-[var(--color-success)]"
                      : "border-[color:rgb(173_118_38_/_0.3)] text-[var(--color-warning)]"
                  )}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4"
                  />
                </span>

                <div>
                  <h3 className="text-sm font-medium text-foreground">
                    {check.title}
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-muted">
                    {check.description}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
