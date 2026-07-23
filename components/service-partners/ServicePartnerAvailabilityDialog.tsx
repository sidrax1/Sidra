"use client";

import {
  PauseCircle,
  ShieldCheck,
  UsersRound,
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
  UpdateServicePartnerAvailabilityInput,
} from "@/lib/schemas/service-partner";
import type {
  ServicePartner,
} from "@/types/service-partner";

interface ServicePartnerAvailabilityDialogProps {
  readonly open: boolean;
  readonly partner: ServicePartner | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: UpdateServicePartnerAvailabilityInput
  ) => void | Promise<void>;
}

export function ServicePartnerAvailabilityDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  partner,
}: ServicePartnerAvailabilityDialogProps): React.JSX.Element {
  const [
    acceptingAssignments,
    setAcceptingAssignments,
  ] = useState(false);

  const [
    maximumConcurrentAssignments,
    setMaximumConcurrentAssignments,
  ] = useState(1);

  const [reason, setReason] =
    useState("");

  useEffect(() => {
    if (!open) {
      return;
    }

    setAcceptingAssignments(
      partner?.acceptingAssignments ??
        false
    );

    setMaximumConcurrentAssignments(
      partner?.maximumConcurrentAssignments ??
        1
    );

    setReason("");
  }, [
    open,
    partner,
  ]);

  const belowCurrentCapacity =
    Boolean(partner) &&
    maximumConcurrentAssignments <
      (partner?.currentAssignmentCount ??
        0);

  const valid =
    Boolean(partner) &&
    maximumConcurrentAssignments >=
      1 &&
    maximumConcurrentAssignments <=
      500 &&
    !belowCurrentCapacity;

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Update Partner Availability
          </DialogTitle>

          <DialogDescription>
            Control assignment acceptance and concurrent service
            capacity.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6">
          <Alert
            variant={
              acceptingAssignments
                ? "success"
                : "warning"
            }
            title={
              acceptingAssignments
                ? "Partner will accept new assignments"
                : "New assignments will be paused"
            }
            description={
              acceptingAssignments
                ? "The matching engine may assign eligible service requests within the configured capacity."
                : "Existing assignments remain active, but new assignments will not be created."
            }
            icon={
              acceptingAssignments ? (
                <ShieldCheck
                  aria-hidden="true"
                  className="size-5"
                />
              ) : (
                <PauseCircle
                  aria-hidden="true"
                  className="size-5"
                />
              )
            }
          />

          {partner ? (
            <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
              <p className="font-mono text-xs text-muted">
                Partner #
                {
                  partner.partnerNumber
                }
              </p>

              <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {
                  partner.displayName
                }
              </h3>

              <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
                <span>
                  Current assignments:{" "}
                  <strong className="font-medium text-foreground">
                    {
                      partner.currentAssignmentCount
                    }
                  </strong>
                </span>

                <span>
                  Current capacity:{" "}
                  <strong className="font-medium text-foreground">
                    {
                      partner.maximumConcurrentAssignments
                    }
                  </strong>
                </span>
              </div>
            </section>
          ) : null}

          <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-5">
            <input
              type="checkbox"
              checked={
                acceptingAssignments
              }
              disabled={loading}
              onChange={(event) =>
                setAcceptingAssignments(
                  event.target
                    .checked
                )
              }
              className="mt-1 size-4 accent-[var(--color-gold-500)]"
            />

            <span>
              <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                <UsersRound
                  aria-hidden="true"
                  className="size-4 text-[var(--color-gold-600)]"
                />
                Accept new assignments
              </span>

              <span className="mt-1 block text-xs leading-5 text-muted">
                Availability is still subject to active status,
                verification and capability matching.
              </span>
            </span>
          </label>

          <FormField
            label="Maximum Concurrent Assignments"
            labelFor="service-partner-maximum-capacity"
            required
            error={
              belowCurrentCapacity
                ? "Capacity cannot be lower than the partner's current active assignment count."
                : undefined
            }
            description="Maximum number of active assignments allowed at one time."
          >
            <Input
              id="service-partner-maximum-capacity"
              type="number"
              min={1}
              max={500}
              step={1}
              value={
                maximumConcurrentAssignments
              }
              disabled={loading}
              invalid={
                belowCurrentCapacity
              }
              onChange={(event) =>
                setMaximumConcurrentAssignments(
                  Math.min(
                    Math.max(
                      Number(
                        event.target
                          .value
                      ) || 1,
                      1
                    ),
                    500
                  )
                )
              }
            />
          </FormField>

          <FormField
            label="Availability Note"
            labelFor="service-partner-availability-reason"
            optional
            description={`${reason.length}/1000 characters`}
          >
            <Textarea
              id="service-partner-availability-reason"
              value={reason}
              rows={6}
              maxLength={1000}
              disabled={loading}
              placeholder="Record staffing, capacity, holiday, equipment or operational reasons for this change."
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
            />
          </FormField>
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
            disabled={!valid}
            loading={loading}
            loadingLabel="Updating Availability"
            onClick={() => {
              if (!partner) {
                return;
              }

              void onSubmit({
                partnerId:
                  partner.id,
                acceptingAssignments,
                maximumConcurrentAssignments,
                reason:
                  reason.trim() ||
                  undefined,
              });
            }}
          >
            <UsersRound
              aria-hidden="true"
              className="size-4"
            />
            Save Availability
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
