"use client";

import {
  FileWarning,
  Scale,
  ShieldCheck,
} from "lucide-react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import {
  createDisputeSchema,
  type CreateDisputeInput,
  type CreateDisputeFormValues,
} from "@/lib/schemas/dispute";
import type {
  Order,
} from "@/types/order";

interface CreateDisputeFormProps {
  readonly order: Order;
  readonly evidencePaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: CreateDisputeInput
  ) => void | Promise<void>;
}

const reasonOptions = [
  {
    value: "orderNotReceived",
    label: "Order Not Received",
  },
  {
    value: "itemDamaged",
    label: "Item Damaged",
  },
  {
    value: "itemNotAsDescribed",
    label: "Item Not as Described",
  },
  {
    value: "wrongItem",
    label: "Wrong Item Received",
  },
  {
    value: "unauthorizedPayment",
    label: "Unauthorized Payment",
  },
  {
    value: "duplicatePayment",
    label: "Duplicate Payment",
  },
  {
    value: "refundNotReceived",
    label: "Refund Not Received",
  },
  {
    value: "sellerNonResponsive",
    label: "Studio Non-responsive",
  },
  {
    value: "serviceNotDelivered",
    label: "Service Not Delivered",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

const resolutionOptions = [
  {
    value: "fullRefund",
    label: "Full Refund",
  },
  {
    value: "partialRefund",
    label: "Partial Refund",
  },
  {
    value: "replacement",
    label: "Replacement",
  },
  {
    value: "storeCredit",
    label: "Store Credit",
  },
  {
    value: "mutualSettlement",
    label: "Mutual Settlement",
  },
] as const;

export function CreateDisputeForm({
  evidencePaths = [],
  loading = false,
  onFilesSelected,
  onSubmit,
  order,
}: CreateDisputeFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } = useForm<
    CreateDisputeFormValues,
    unknown,
    CreateDisputeInput
  >({
    resolver: zodResolver(
      createDisputeSchema
    ),
    mode: "onChange",
    defaultValues: {
      orderId: order.id,
      reason: "orderNotReceived",
      title: "",
      description: "",
      requestedResolution: "fullRefund",
      disputedAmountPaise:
        order.pricing.totalPaise,
      evidencePaths: [...evidencePaths],
    },
  });

  const description = watch("description");

  return (
    <Surface
      className="grid gap-7"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Scale
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Protected Resolution
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Open an Order Dispute
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Submit a formal dispute for order #{order.orderNumber}.
            Supporting evidence improves resolution speed.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Use disputes after contacting the Studio"
        description="For routine delivery or product questions, contact the Studio or support first. Disputes are reserved for unresolved order, payment or fulfilment concerns."
        icon={
          <FileWarning
            aria-hidden={true}
            className="size-5"
          />
        }
      />

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(async (input) => {
          await onSubmit({
            ...input,
            orderId: order.id,
            evidencePaths: [...evidencePaths],
          });
        })}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Dispute Reason"
            labelFor="dispute-reason"
            required
            error={errors.reason?.message}
          >
            <Select
              id="dispute-reason"
              options={reasonOptions}
              disabled={loading}
              {...register("reason")}
            />
          </FormField>

          <FormField
            label="Requested Resolution"
            labelFor="dispute-resolution"
            required
            error={
              errors.requestedResolution?.message
            }
          >
            <Select
              id="dispute-resolution"
              options={resolutionOptions}
              disabled={loading}
              {...register(
                "requestedResolution"
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Dispute Title"
          labelFor="dispute-title"
          required
          error={errors.title?.message}
        >
          <Input
            id="dispute-title"
            disabled={loading}
            placeholder="Order was marked delivered but never received"
            {...register("title")}
          />
        </FormField>

        <FormField
          label="Detailed Description"
          labelFor="dispute-description"
          required
          error={errors.description?.message}
          description={`${description.length}/4000 characters`}
        >
          <Textarea
            id="dispute-description"
            rows={10}
            minLength={30}
            maxLength={4000}
            disabled={loading}
            placeholder="Explain the timeline, communication attempts, expected resolution and any relevant order details."
            {...register("description")}
          />
        </FormField>

        <FormField
          label="Disputed Amount (Paise)"
          labelFor="disputed-amount"
          required
          error={
            errors.disputedAmountPaise?.message
          }
          description={`Maximum order value: ${order.pricing.totalPaise.toLocaleString(
            "en-IN"
          )} paise`}
        >
          <Input
            id="disputed-amount"
            type="number"
            min={1}
            max={order.pricing.totalPaise}
            step={1}
            disabled={loading}
            {...register(
              "disputedAmountPaise",
              {
                valueAsNumber: true,
              }
            )}
          />
        </FormField>

        <FileDropzone
          accept={[
            "image/jpeg",
            "image/png",
            "image/webp",
            "video/mp4",
            "application/pdf",
          ]}
          maximumSizeBytes={
            20 * 1024 * 1024
          }
          multiple
          disabled={
            loading ||
            !onFilesSelected
          }
          label="Supporting Evidence"
          description="Upload order photographs, delivery proof, payment records or communication screenshots."
          onFilesSelected={(files) =>
            onFilesSelected?.(files)
          }
        />

        <p className="inline-flex items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-muted">
          <ShieldCheck
            aria-hidden={true}
            className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
          />
          Dispute creation, payment holds and participant
          notifications are executed through trusted server-side
          functions.
        </p>

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={!isValid}
            loading={loading}
            loadingLabel="Opening Dispute"
          >
            <Scale
              aria-hidden={true}
              className="size-4"
            />
            Open Dispute
          </Button>
        </div>
      </form>
    </Surface>
  );
}
