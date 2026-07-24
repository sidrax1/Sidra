"use client";

import Image from "next/image";
import {
  CalendarDays,
  FileWarning,
  ShieldCheck,
  Wrench,
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
import { Price } from "@/components/ui/Price";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import {
  createWarrantyClaimSchema,
  type CreateWarrantyClaimInput,
} from "@/lib/schemas/warranty";
import type { z } from "zod";
import type {
  ProductWarranty,
} from "@/types/warranty";

type CreateWarrantyClaimFormInput = z.input<
  typeof createWarrantyClaimSchema
>;

interface CreateWarrantyClaimFormProps {
  readonly warranty: ProductWarranty;
  readonly evidencePaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: CreateWarrantyClaimInput
  ) => void | Promise<void>;
}

const resolutionOptions = [
  {
    value: "repair",
    label: "Repair",
  },
  {
    value: "replacement",
    label: "Replacement",
  },
  {
    value: "partialRefund",
    label: "Partial Refund",
  },
  {
    value: "fullRefund",
    label: "Full Refund",
  },
  {
    value: "storeCredit",
    label: "Store Credit",
  },
] as const;

const coverageOptions = [
  {
    value: "",
    label: "Select Automatically",
  },
  {
    value: "manufacturingDefect",
    label: "Manufacturing Defect",
  },
  {
    value: "structuralFailure",
    label: "Structural Failure",
  },
  {
    value: "finishDefect",
    label: "Finish Defect",
  },
  {
    value: "hardwareFailure",
    label: "Hardware Failure",
  },
  {
    value: "electricalFailure",
    label: "Electrical Failure",
  },
  {
    value: "accidentalDamage",
    label: "Accidental Damage",
  },
  {
    value: "extendedCare",
    label: "Extended Care",
  },
  {
    value: "customCoverage",
    label: "Custom Coverage",
  },
] as const;

function toDateTimeLocal(
  value: Date
): string {
  const offset =
    value.getTimezoneOffset() *
    60_000;

  return new Date(
    value.getTime() - offset
  )
    .toISOString()
    .slice(0, 16);
}

export function CreateWarrantyClaimForm({
  evidencePaths = [],
  loading = false,
  onFilesSelected,
  onSubmit,
  warranty,
}: CreateWarrantyClaimFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    watch,
  } =
    useForm<CreateWarrantyClaimFormInput, unknown, CreateWarrantyClaimInput>(
      {
        resolver:
          zodResolver(
            createWarrantyClaimSchema
          ),
        mode: "onChange",
        defaultValues: {
          warrantyId:
            warranty.id,
          issueTitle: "",
          issueDescription: "",
          failureDate:
            toDateTimeLocal(
              new Date()
            ),
          requestedResolution:
            "repair",
          coverageType:
            undefined,
          evidencePaths: [
            ...evidencePaths,
          ],
        },
      }
    );

  const issueDescription =
    watch("issueDescription");

  const expired =
    new Date(
      warranty.expiresAt
    ).getTime() <= Date.now();

  const registrationMissing =
    warranty.registrationRequired &&
    !warranty.registeredAt;

  const claimLimitReached =
    typeof warranty.maximumClaimCount ===
      "number" &&
    warranty.claimCount >=
      warranty.maximumClaimCount;

  const eligible =
    warranty.status === "active" &&
    !expired &&
    !registrationMissing &&
    !claimLimitReached;

  return (
    <Surface
      className="grid gap-7"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Wrench
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Protected Product Care
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Submit Warranty Claim
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Provide detailed failure information and supporting
            evidence for coverage assessment.
          </p>
        </div>
      </header>

      <Alert
        variant={
          eligible
            ? "success"
            : "warning"
        }
        title={
          eligible
            ? "Warranty is currently eligible for claims"
            : "Warranty claim cannot currently be submitted"
        }
        description={
          expired
            ? "This warranty has expired."
            : registrationMissing
              ? "Register the warranty before submitting a claim."
              : claimLimitReached
                ? "The maximum claim limit has been reached."
                : warranty.status !==
                    "active"
                  ? `Warranty status is ${warranty.status}.`
                  : "Coverage and final eligibility are verified server-side."
        }
        icon={
          eligible ? (
            <ShieldCheck
              aria-hidden={true}
              className="size-5"
            />
          ) : (
            <FileWarning
              aria-hidden={true}
              className="size-5"
            />
          )
        }
      />

      <section className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-background p-5 sm:grid-cols-[120px_minmax(0,1fr)]">
        <div className="relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-card">
          {warranty.product
            .productImageURL ? (
            <Image
              src={
                warranty.product
                  .productImageURL
              }
              alt={
                warranty.product
                  .productTitle
              }
              fill
              sizes="120px"
              className="object-cover"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ShieldCheck
                aria-hidden={true}
                className="size-9 text-[var(--color-gold-600)]"
              />
            </div>
          )}
        </div>

        <div>
          <p className="text-xs uppercase tracking-[0.14em] text-muted">
            Warranty #
            {
              warranty.warrantyNumber
            }
          </p>

          <h3 className="mt-2 font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            {
              warranty.product
                .productTitle
            }
          </h3>

          {warranty.product
            .variantTitle ? (
            <p className="mt-1 text-xs text-muted">
              {
                warranty.product
                  .variantTitle
              }
            </p>
          ) : null}

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
            <span className="inline-flex items-center gap-2">
              <CalendarDays
                aria-hidden={true}
                className="size-4 text-[var(--color-gold-600)]"
              />
              Expires{" "}
              {new Date(
                warranty.expiresAt
              ).toLocaleDateString(
                "en-IN"
              )}
            </span>

            <Price
              amount={
                warranty.product
                  .purchaseValuePaise /
                100
              }
              size="sm"
            />
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
              warrantyId:
                warranty.id,
              coverageType:
                input.coverageType ||
                undefined,
              evidencePaths: [
                ...evidencePaths,
              ],
            });
          }
        )}
      >
        <FormField
          label="Issue Title"
          labelFor="warranty-claim-title"
          required
          error={
            errors.issueTitle
              ?.message
          }
        >
          <Input
            id="warranty-claim-title"
            disabled={loading}
            placeholder="Resin surface developed structural cracks"
            {...register(
              "issueTitle"
            )}
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Requested Resolution"
            labelFor="warranty-claim-resolution"
            required
            error={
              errors
                .requestedResolution
                ?.message
            }
          >
            <Select
              id="warranty-claim-resolution"
              options={
                resolutionOptions
              }
              disabled={loading}
              {...register(
                "requestedResolution"
              )}
            />
          </FormField>

          <FormField
            label="Coverage Category"
            labelFor="warranty-claim-coverage"
            optional
            error={
              errors.coverageType
                ?.message
            }
          >
            <Select
              id="warranty-claim-coverage"
              options={
                coverageOptions
              }
              disabled={loading}
              {...register(
                "coverageType",
                {
                  setValueAs: (
                    value: string
                  ) =>
                    value === ""
                      ? undefined
                      : value,
                }
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Failure Date and Time"
          labelFor="warranty-claim-failure-date"
          required
          error={
            errors.failureDate
              ?.message
          }
        >
          <Input
            id="warranty-claim-failure-date"
            type="datetime-local"
            max={toDateTimeLocal(
              new Date()
            )}
            disabled={loading}
            {...register(
              "failureDate",
              {
                setValueAs: (
                  value: string
                ) =>
                  value
                    ? new Date(
                        value
                      ).toISOString()
                    : value,
              }
            )}
          />
        </FormField>

        <FormField
          label="Detailed Issue Description"
          labelFor="warranty-claim-description"
          required
          error={
            errors.issueDescription
              ?.message
          }
          description={`${issueDescription.length}/5000 characters`}
        >
          <Textarea
            id="warranty-claim-description"
            rows={11}
            minLength={30}
            maxLength={5000}
            disabled={loading}
            placeholder="Describe when the issue began, how the product was used, the current condition and any troubleshooting already attempted."
            {...register(
              "issueDescription"
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
            25 * 1024 * 1024
          }
          multiple
          disabled={
            loading ||
            !onFilesSelected
          }
          label="Warranty Evidence"
          description="Upload clear product photographs, serial labels, short videos, invoices or service documents."
          onFilesSelected={(files) =>
            onFilesSelected?.(files)
          }
        />

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={
              !isValid ||
              !eligible
            }
            loading={loading}
            loadingLabel="Submitting Claim"
          >
            <Wrench
              aria-hidden={true}
              className="size-4"
            />
            Submit Warranty Claim
          </Button>
        </div>
      </form>
    </Surface>
  );
}
