"use client";

import Image from "next/image";
import {
  PackageCheck,
  RotateCcw,
  ShieldCheck,
} from "lucide-react";
import {
  useForm,
} from "react-hook-form";
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
  FileDropzone,
} from "@/components/ui/FileDropzone";
import {
  FormField,
} from "@/components/ui/FormField";
import {
  Input,
} from "@/components/ui/Input";
import {
  Price,
} from "@/components/ui/Price";
import {
  Select,
} from "@/components/ui/Select";
import {
  Surface,
} from "@/components/ui/Surface";
import {
  Textarea,
} from "@/components/ui/Textarea";
import {
  createReturnRequestSchema,
  type CreateReturnRequestInput,
} from "@/lib/schemas/return";
import type {
  ReturnAddress,
  ReturnItemSnapshot,
} from "@/types/return";

interface CreateReturnRequestFormProps {
  readonly orderId: string;
  readonly item: ReturnItemSnapshot;
  readonly defaultPickupAddress?: ReturnAddress;
  readonly evidencePaths?: readonly string[];
  readonly returnWindowExpiresAt: string;
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: CreateReturnRequestInput
  ) => void | Promise<void>;
}

const reasonOptions = [
  {
    value: "damaged",
    label: "Item Arrived Damaged",
  },
  {
    value: "defective",
    label: "Item is Defective",
  },
  {
    value: "wrongItem",
    label: "Wrong Item Received",
  },
  {
    value: "notAsDescribed",
    label: "Item Not as Described",
  },
  {
    value: "missingParts",
    label: "Missing Parts or Accessories",
  },
  {
    value: "qualityConcern",
    label: "Quality Concern",
  },
  {
    value: "sizeOrDimensionIssue",
    label: "Size or Dimension Issue",
  },
  {
    value: "changedMind",
    label: "Changed My Mind",
  },
  {
    value: "lateDelivery",
    label: "Delivered Too Late",
  },
  {
    value: "other",
    label: "Other Reason",
  },
] as const;

const resolutionOptions = [
  {
    value: "refund",
    label: "Refund",
  },
  {
    value: "replacement",
    label: "Replacement",
  },
  {
    value: "repair",
    label: "Repair",
  },
  {
    value: "storeCredit",
    label: "Store Credit",
  },
] as const;

export function CreateReturnRequestForm({
  defaultPickupAddress,
  evidencePaths = [],
  item,
  loading = false,
  onFilesSelected,
  onSubmit,
  orderId,
  returnWindowExpiresAt,
}: CreateReturnRequestFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } =
    useForm<CreateReturnRequestInput>(
      {
        resolver:
          zodResolver(
            createReturnRequestSchema
          ),
        mode: "onChange",
        defaultValues: {
          orderId,
          orderItemId:
            item.orderItemId,
          quantity: 1,
          reason: "damaged",
          resolutionRequested:
            "refund",
          description: "",
          evidencePaths: [
            ...evidencePaths,
          ],
          pickupAddress:
            defaultPickupAddress,
        },
      }
    );

  const description =
    watch("description");

  const quantity =
    watch("quantity");

  const estimatedValuePaise =
    Math.min(
      Math.max(
        Number(quantity) || 0,
        0
      ),
      item.orderedQuantity
    ) * item.unitPricePaise;

  return (
    <Surface
      className="grid gap-7"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <RotateCcw
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Protected Returns
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Request a Product Return
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Submit complete product condition details and supporting
            evidence before the return window expires.
          </p>
        </div>
      </header>

      <Alert
        variant="warning"
        title="Return eligibility is verified server-side"
        description={`This item can be requested for return until ${new Date(
          returnWindowExpiresAt
        ).toLocaleString(
          "en-IN"
        )}.`}
        icon={
          <ShieldCheck
            aria-hidden="true"
            className="size-5"
          />
        }
      />

      <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-5 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
          {item.productImageURL ? (
            <Image
              src={
                item.productImageURL
              }
              alt={
                item.productTitle
              }
              fill
              sizes="120px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <PackageCheck
                aria-hidden="true"
                className="size-9 text-[var(--color-gold-600)]"
              />
            </div>
          )}
        </div>

        <div>
          <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {item.productTitle}
          </h3>

          {item.variantTitle ? (
            <p className="mt-1 text-xs text-muted">
              {item.variantTitle}
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span>
              Ordered quantity:{" "}
              <strong className="font-medium text-foreground">
                {
                  item.orderedQuantity
                }
              </strong>
            </span>

            <span>
              Unit price:{" "}
              <Price
                amount={
                  item.unitPricePaise /
                  100
                }
                size="sm"
                className="inline"
              />
            </span>
          </div>
        </div>
      </section>

      <form
        noValidate
        className="grid gap-6"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit({
              ...input,
              orderId,
              orderItemId:
                item.orderItemId,
              evidencePaths: [
                ...evidencePaths,
              ],
            });
          }
        )}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Return Reason"
            labelFor="return-reason"
            required
            error={
              errors.reason
                ?.message
            }
          >
            <Select
              id="return-reason"
              options={
                reasonOptions
              }
              disabled={loading}
              {...register(
                "reason"
              )}
            />
          </FormField>

          <FormField
            label="Preferred Resolution"
            labelFor="return-resolution"
            required
            error={
              errors
                .resolutionRequested
                ?.message
            }
          >
            <Select
              id="return-resolution"
              options={
                resolutionOptions
              }
              disabled={loading}
              {...register(
                "resolutionRequested"
              )}
            />
          </FormField>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Return Quantity"
            labelFor="return-quantity"
            required
            error={
              errors.quantity
                ?.message
            }
          >
            <Input
              id="return-quantity"
              type="number"
              min={1}
              max={
                item.orderedQuantity
              }
              step={1}
              disabled={loading}
              {...register(
                "quantity",
                {
                  valueAsNumber: true,
                }
              )}
            />
          </FormField>

          <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted">
              Estimated Item Value
            </p>

            <Price
              amount={
                estimatedValuePaise /
                100
              }
              size="xl"
              className="mt-2"
            />
          </div>
        </div>

        <FormField
          label="Detailed Description"
          labelFor="return-description"
          required
          error={
            errors.description
              ?.message
          }
          description={`${description.length}/4000 characters`}
        >
          <Textarea
            id="return-description"
            rows={10}
            minLength={30}
            maxLength={4000}
            disabled={loading}
            placeholder="Describe the condition, issue, packaging and when the problem was discovered."
            {...register(
              "description"
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
          label="Product Evidence"
          description="Upload clear product, packaging and damage photographs or short videos."
          onFilesSelected={(
            files
          ) =>
            onFilesSelected?.(
              files
            )
          }
        />

        {defaultPickupAddress ? (
          <section className="rounded-[var(--radius-lg)] border border-border bg-background p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Default Pickup Address
            </p>

            <address className="mt-3 not-italic text-sm leading-7 text-foreground">
              {
                defaultPickupAddress.fullName
              }
              <br />
              {
                defaultPickupAddress.addressLine1
              }
              {defaultPickupAddress.addressLine2
                ? `, ${defaultPickupAddress.addressLine2}`
                : ""}
              <br />
              {
                defaultPickupAddress.city
              }
              ,{" "}
              {
                defaultPickupAddress.state
              }{" "}
              {
                defaultPickupAddress.postalCode
              }
              <br />
              {
                defaultPickupAddress.phoneNumber
              }
            </address>
          </section>
        ) : null}

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={!isValid}
            loading={loading}
            loadingLabel="Submitting Return"
          >
            <RotateCcw
              aria-hidden="true"
              className="size-4"
            />
            Submit Return Request
          </Button>
        </div>
      </form>
    </Surface>
  );
}
