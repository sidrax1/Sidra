"use client";

import { useEffect, useState } from "react";
import {
  MessageSquareText,
  ShieldAlert,
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
import { Textarea } from "@/components/ui/Textarea";
import type { CustomOrderQuote } from "@/types/custom-order-workflow";

interface CustomOrderQuoteRevisionDialogProps {
  readonly open: boolean;
  readonly quote: CustomOrderQuote | null;
  readonly loading?: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onSubmit: (input: {
    readonly customOrderId: string;
    readonly quoteId: string;
    readonly message: string;
  }) => void | Promise<void>;
}

export function CustomOrderQuoteRevisionDialog({
  loading = false,
  onOpenChange,
  onSubmit,
  open,
  quote,
}: CustomOrderQuoteRevisionDialogProps): React.JSX.Element {
  const [message, setMessage] =
    useState("");

  useEffect(() => {
    if (open) {
      setMessage("");
    }
  }, [open, quote?.id]);

  const revisionsRemaining = quote
    ? quote.maximumRevisionCount -
      quote.revisionNumber
    : 0;

  const valid =
    quote !== null &&
    revisionsRemaining > 0 &&
    message.trim().length >= 10;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Request Quote Revision
          </DialogTitle>

          <DialogDescription>
            Share the exact pricing, timeline or specification
            changes required from the Studio.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5">
          <Alert
            variant={
              revisionsRemaining > 0
                ? "warning"
                : "error"
            }
            title={
              revisionsRemaining > 0
                ? `${revisionsRemaining} revision ${
                    revisionsRemaining === 1
                      ? "round"
                      : "rounds"
                  } remaining`
                : "Revision limit reached"
            }
            description={
              revisionsRemaining > 0
                ? "The custom-order workflow permits a maximum of two quote revision rounds before Founder review is required."
                : "Further negotiation requires Founder intervention through the support workflow."
            }
            icon={
              <ShieldAlert
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          <FormField
            label="Revision Requirements"
            labelFor="quote-revision-message"
            required
            description={`${message.length}/2000 characters`}
          >
            <div className="relative">
              <MessageSquareText
                aria-hidden={true}
                className="pointer-events-none absolute left-4 top-4 size-4 text-muted"
              />

              <Textarea
                id="quote-revision-message"
                value={message}
                rows={7}
                disabled={
                  loading ||
                  revisionsRemaining <= 0
                }
                minLength={10}
                maxLength={2000}
                className="pl-11"
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
              />
            </div>
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
            loadingLabel="Requesting Revision"
            onClick={() => {
              if (!quote) {
                return;
              }

              void onSubmit({
                customOrderId:
                  quote.customOrderId,
                quoteId: quote.id,
                message:
                  message.trim(),
              });
            }}
          >
            Request Revision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
