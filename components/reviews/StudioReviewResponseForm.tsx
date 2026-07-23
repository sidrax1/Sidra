"use client";

import {
  useState,
} from "react";
import {
  MessageSquareReply,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";

export interface StudioReviewResponseInput {
  readonly reviewId: string;
  readonly response: string;
}

interface StudioReviewResponseFormProps {
  readonly reviewId: string;
  readonly existingResponse?: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: StudioReviewResponseInput
  ) => void | Promise<void>;
  readonly onCancel?: () => void;
}

export function StudioReviewResponseForm({
  existingResponse = "",
  loading = false,
  onCancel,
  onSubmit,
  reviewId,
}: StudioReviewResponseFormProps): React.JSX.Element {
  const [response, setResponse] =
    useState(existingResponse);

  const valid =
    response.trim().length >= 10 &&
    response.trim().length <= 1500;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <MessageSquareReply
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Studio Response
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Respond with Care
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            A thoughtful public response reinforces trust while
            preserving the studio’s premium voice.
          </p>
        </div>
      </header>

      <FormField
        label="Public Response"
        labelFor="studio-review-response"
        required
        description={`${response.length}/1500 characters`}
      >
        <Textarea
          id="studio-review-response"
          value={response}
          rows={7}
          disabled={loading}
          minLength={10}
          maxLength={1500}
          onChange={(event) =>
            setResponse(
              event.target.value
            )
          }
        />
      </FormField>

      <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4 text-xs leading-6 text-muted">
        <ShieldCheck
          aria-hidden="true"
          className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
        />

        <p>
          Responses are public, permanently associated with the
          studio and subject to platform moderation policies.
        </p>
      </div>

      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        {onCancel ? (
          <Button
            variant="ghost"
            disabled={loading}
            onClick={onCancel}
          >
            Cancel
          </Button>
        ) : null}

        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Publishing Response"
          onClick={() => {
            void onSubmit({
              reviewId,
              response:
                response.trim(),
            });
          }}
        >
          Publish Response
        </Button>
      </div>
    </Surface>
  );
}
