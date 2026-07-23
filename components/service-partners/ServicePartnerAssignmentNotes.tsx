import {
  FileCheck2,
  MessageSquareText,
} from "lucide-react";

import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

interface ServicePartnerAssignmentNotesProps {
  readonly assignment: ServicePartnerAssignment;
  readonly className?: string;
}

export function ServicePartnerAssignmentNotes({
  assignment,
  className,
}: ServicePartnerAssignmentNotesProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center gap-3 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <MessageSquareText
          aria-hidden={true}
          className="size-5 text-[var(--color-gold-600)]"
        />

        <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
          Assignment Notes
        </h2>
      </header>

      <div className="grid gap-5 p-6">
        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted">
            Service Requirement
          </p>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">
            {assignment.description}
          </p>
        </article>

        <article className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
          <div className="flex items-center gap-2">
            <FileCheck2
              aria-hidden={true}
              className="size-4 text-[var(--color-gold-600)]"
            />

            <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted">
              Completion Report
            </p>
          </div>

          {assignment.completionNote ? (
            <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-foreground">
              {
                assignment.completionNote
              }
            </p>
          ) : (
            <p className="mt-3 text-sm leading-7 text-muted">
              No completion report has
              been submitted yet.
            </p>
          )}
        </article>
      </div>
    </section>
  );
}
