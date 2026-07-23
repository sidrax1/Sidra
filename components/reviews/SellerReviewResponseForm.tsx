"use client";

import {
  MessageSquareReply,
  Send,
  ShieldCheck,
} from "lucide-react";
import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  z,
} from "zod";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

import {
  Alert,
} from "@/components/ui/Alert";
import {
  Button,
} from "@/components/ui/Button";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";

const sellerResponseSchema =
  z.object({
    message: z
      .string()
      .trim()
      .min(
        10,
        "Write at least 10 characters."
      )
      .max(
        2000,
        "Response cannot exceed 2000 characters."
      ),
  });

export type SellerReviewResponseInput =
  z.infer<
    typeof sellerResponseSchema
  >;

interface SellerReviewResponseFormProps {
  readonly existingMessage?: string;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: SellerReviewResponseInput
  ) => void | Promise<void>;
  readonly onCancel?: () => void;
}

export function SellerReviewResponseForm({
  existingMessage = "",
  loading = false,
  onCancel,
  onSubmit,
}: SellerReviewResponseFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    reset,
    watch,
  } =
    useForm<SellerReviewResponseInput>(
      {
        resolver:
          zodResolver(
            sellerResponseSchema
          ),
        defaultValues: {
          message:
            existingMessage,
        },
      }
    );

  useEffect(() => {
    reset({
      message:
        existingMessage,
    });
  }, [
    existingMessage,
    reset,
  ]);

  const message =
    watch("message");

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <MessageSquareReply
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Public Studio Reply
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Respond to Review
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Publish a respectful, factual response visible beneath the
            customer review.
          </p>
        </div>
      </header>

      <Alert
        variant="success"
        title="Professional responses build customer trust"
        description="Do not include private customer details, payment information or internal dispute notes."
        icon={
          <ShieldCheck
            aria-hidden="true"
            className="size-5"
          />
        }
      />

      <form
        noValidate
        className="grid gap-5"
        onSubmit={handleSubmit(
          onSubmit
        )}
      >
        <FormField
          label="Studio Response"
          labelFor="seller-review-response"
          required
          error={
            errors.message
              ?.message
          }
          description={`${message.length}/2000 characters`}
        >
          <Textarea
            id="seller-review-response"
            rows={8}
            maxLength={2000}
            disabled={loading}
            placeholder="Thank the customer, address their feedback and explain any relevant resolution."
            {...register(
              "message"
            )}
          />
        </FormField>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
          {onCancel ? (
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={onCancel}
            >
              Cancel
            </Button>
          ) : null}

          <Button
            type="submit"
            disabled={
              Boolean(
                existingMessage
              ) &&
              !isDirty
            }
            loading={loading}
            loadingLabel="Publishing Response"
          >
            <Send
              aria-hidden="true"
              className="size-4"
            />
            {existingMessage
              ? "Update Response"
              : "Publish Response"}
          </Button>
        </div>
      </form>
    </Surface>
  );
}
