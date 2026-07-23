"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  ShieldAlert,
  Trash2,
} from "lucide-react";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";

interface AccountDeletionDialogProps {
  readonly open: boolean;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (input: {
    readonly reason: string;
    readonly confirmation: "DELETE";
  }) => void | Promise<void>;
}

export function AccountDeletionDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
}: AccountDeletionDialogProps): React.JSX.Element {
  const [reason, setReason] =
    useState("");

  const [
    confirmation,
    setConfirmation,
  ] = useState("");

  useEffect(() => {
    if (open) {
      setReason("");
      setConfirmation("");
    }
  }, [open]);

  const valid =
    reason.trim().length >= 10 &&
    confirmation === "DELETE";

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Request Account Deletion
          </DialogTitle>

          <DialogDescription>
            Submit a verified deletion request for secure Founder and
            compliance processing.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant="warning"
            title="This request affects your entire account"
            description="Orders, invoices and legally required financial records may remain retained for the applicable compliance period."
            icon={
              <ShieldAlert
                aria-hidden="true"
                className="size-5"
              />
            }
          />

          <FormField
            label="Reason for Leaving"
            labelFor="account-deletion-reason"
            required
            description={`${reason.length}/1000 characters`}
          >
            <Textarea
              id="account-deletion-reason"
              value={reason}
              rows={6}
              disabled={loading}
              minLength={10}
              maxLength={1000}
              onChange={(event) =>
                setReason(
                  event.target.value
                )
              }
            />
          </FormField>

          <FormField
            label='Type "DELETE" to Confirm'
            labelFor="account-deletion-confirmation"
            required
          >
            <Input
              id="account-deletion-confirmation"
              value={confirmation}
              disabled={loading}
              autoComplete="off"
              onChange={(event) =>
                setConfirmation(
                  event.target.value.toUpperCase()
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
            Keep Account
          </Button>

          <Button
            variant="danger"
            disabled={!valid}
            loading={loading}
            loadingLabel="Submitting Request"
            onClick={() => {
              void onSubmit({
                reason:
                  reason.trim(),
                confirmation:
                  "DELETE",
              });
            }}
          >
            <Trash2
              aria-hidden="true"
              className="size-4"
            />
            Submit Deletion Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
