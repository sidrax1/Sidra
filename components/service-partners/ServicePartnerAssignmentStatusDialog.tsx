"use client";

import {
  Ban,
  CalendarClock,
  CheckCircle2,
  CirclePlay,
  ShieldAlert,
  XCircle,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Input,
} from "@/components/ui/Input";
import {
  Textarea,
} from "@/components/ui/Textarea";
import type {
  UpdateServiceAssignmentStatusInput,
} from "@/lib/schemas/service-partner";
import type {
  ServicePartnerAssignment,
} from "@/types/service-partner";

type AssignmentActionStatus =
  UpdateServiceAssignmentStatusInput["status"];

interface ServicePartnerAssignmentStatusDialogProps {
  readonly open: boolean;
  readonly assignment: ServicePartnerAssignment | null;
  readonly status: AssignmentActionStatus;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: UpdateServiceAssignmentStatusInput
  ) => void | Promise<void>;
}

const statusTitles: Record<
  AssignmentActionStatus,
  string
> = {
  accepted:
    "Accept Assignment",
  declined:
    "Decline Assignment",
  scheduled:
    "Schedule Assignment",
  inProgress:
    "Start Assignment",
  completed:
    "Complete Assignment",
  cancelled:
    "Cancel Assignment",
};

function toLocalDateTime(
  value?: string
): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const offset =
    date.getTimezoneOffset() *
    60_000;

  return new Date(
    date.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export function ServicePartnerAssignmentStatusDialog({
  assignment,
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  status,
}: ServicePartnerAssignmentStatusDialogProps): React.JSX.Element {
  const [note, setNote] =
    useState("");

  const [
    scheduledAt,
    setScheduledAt,
  ] = useState("");

  const [
    completionNote,
    setCompletionNote,
  ] = useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setNote("");
    setCompletionNote("");
    setScheduledAt(
      toLocalDateTime(
        assignment?.scheduledAt
      )
    );
  }, [
    assignment,
    open,
    status,
  ]);

  const scheduleRequired =
    status === "scheduled";

  const completionRequired =
    status === "completed";

  const destructive =
    status === "declined" ||
    status === "cancelled";

  const valid =
    Boolean(assignment) &&
    note.trim().length >= 5 &&
    (!scheduleRequired ||
      (scheduledAt.length >
        0 &&
        new Date(
          scheduledAt
        ).getTime() >
          Date.now())) &&
    (!completionRequired ||
      completionNote.trim()
        .length >= 10);

  const Icon =
    status === "accepted"
      ? CheckCircle2
      : status === "declined"
        ? XCircle
        : status === "scheduled"
          ? CalendarClock
          : status === "inProgress"
            ? CirclePlay
            : status === "completed"
              ? CheckCircle2
              : Ban;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-h-[94vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {
              statusTitles[
                status
              ]
            }
          </DialogTitle>

          <DialogDescription>
            Update the assignment lifecycle through the protected
            service-partner workflow.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              destructive
                ? "warning"
                : "success"
            }
            title={
              destructive
                ? "This action requires a clear operational reason"
                : "Assignment activity will be recorded in the audit trail"
            }
            description={
              destructive
                ? "Declined or cancelled assignments may be reassigned and can affect service-partner performance."
                : "The customer, studio and operations team may receive status updates after server validation."
            }
            icon={
              destructive ? (
                <ShieldAlert
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <Icon
                  aria-hidden="true"
                  className="size-5"
                />
              )
            }
          />

          {assignment ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="font-mono text-xs text-muted">
                Assignment #
                {
                  assignment.assignmentNumber
                }
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {
                  assignment.title
                }
              </h3>

              <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">
                {
                  assignment.description
                }
              </p>
            </section>
          ) : null}

          {scheduleRequired ? (
            <FormField
              label="Scheduled Date and Time"
              labelFor="service-assignment-schedule"
              required
            >
              <Input
                id="service-assignment-schedule"
                type="datetime-local"
                value={scheduledAt}
                disabled={loading}
                onChange={(event) =>
                  setScheduledAt(
                    event.target
                      .value
                  )
                }
              />
            </FormField>
          ) : null}

          <FormField
            label="Activity Note"
            labelFor="service-assignment-note"
            required
            description={`${note.length}/2500 characters`}
          >
            <Textarea
              id="service-assignment-note"
              value={note}
              rows={7}
              minLength={5}
              maxLength={2500}
              disabled={loading}
              placeholder="Document the operational reason, acknowledgement, schedule or status update."
              onChange={(event) =>
                setNote(
                  event.target.value
                )
              }
            />
          </FormField>

          {completionRequired ? (
            <FormField
              label="Completion Note"
              labelFor="service-assignment-completion-note"
              required
              description={`${completionNote.length}/3000 characters`}
            >
              <Textarea
                id="service-assignment-completion-note"
                value={
                  completionNote
                }
                rows={8}
                minLength={10}
                maxLength={3000}
                disabled={loading}
                placeholder="Document completed work, product condition, evidence, cost outcome and customer handover."
                onChange={(event) =>
                  setCompletionNote(
                    event.target
                      .value
                  )
                }
              />
            </FormField>
          ) : null}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant={
              destructive
                ? "danger"
                : "default"
            }
            disabled={!valid}
            loading={loading}
            loadingLabel={`${statusTitles[
              status
            ]}...`}
            onClick={() => {
              if (!assignment) {
                return;
              }

              void onSubmit({
                assignmentId:
                  assignment.id,
                status,
                note:
                  note.trim(),
                scheduledAt:
                  scheduleRequired
                    ? new Date(
                        scheduledAt
                      ).toISOString()
                    : undefined,
                completionNote:
                  completionRequired
                    ? completionNote.trim()
                    : undefined,
              });
            }}
          >
            <Icon
              aria-hidden="true"
              className="size-4"
            />

            {
              statusTitles[
                status
              ]
            }
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
