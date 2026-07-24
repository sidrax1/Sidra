"use client";

import {
  Flag,
  ShieldAlert,
} from "lucide-react";
import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";

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
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import {
  createReviewReportSchema,
  type CreateReviewReportInput,
} from "@/lib/schemas/review-report";
import type { z } from "zod";

type CreateReviewReportFormInput = z.input<
  typeof createReviewReportSchema
>;

interface CreateReviewReportDialogProps {
  readonly open: boolean;
  readonly reviewId: string;
  readonly evidencePaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onSubmit: (
    input: CreateReviewReportInput
  ) => void | Promise<void>;
}

const reasonOptions = [
  {
    value: "spam",
    label: "Spam",
  },
  {
    value: "harassment",
    label: "Harassment",
  },
  {
    value: "hateSpeech",
    label: "Hate Speech",
  },
  {
    value: "personalInformation",
    label: "Personal Information",
  },
  {
    value: "falseInformation",
    label: "False Information",
  },
  {
    value: "irrelevantContent",
    label: "Irrelevant Content",
  },
  {
    value: "commercialPromotion",
    label: "Commercial Promotion",
  },
  {
    value: "conflictOfInterest",
    label: "Conflict of Interest",
  },
  {
    value: "prohibitedContent",
    label: "Prohibited Content",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export function CreateReviewReportDialog({
  evidencePaths = [],
  loading = false,
  onFilesSelected,
  onOpenChange,
  onSubmit,
  open,
  reviewId,
}: CreateReviewReportDialogProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<CreateReviewReportFormInput, unknown, CreateReviewReportInput>({
    resolver: zodResolver(
      createReviewReportSchema
    ),
    mode: "onChange",
    defaultValues: {
      reviewId,
      reason: "spam",
      description: "",
      evidencePaths: [...evidencePaths],
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      reviewId,
      reason: "spam",
      description: "",
      evidencePaths: [...evidencePaths],
    });
  }, [
    evidencePaths,
    open,
    reset,
    reviewId,
  ]);

  const description = watch("description");

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-h-[92vh] max-w-xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Report Review
          </DialogTitle>

          <DialogDescription>
            Report content that violates Sydra marketplace standards.
          </DialogDescription>
        </DialogHeader>

        <form
          noValidate
          className="grid gap-6"
          onSubmit={handleSubmit(async (input) => {
            await onSubmit({
              ...input,
              reviewId,
              evidencePaths: [...evidencePaths],
            });
          })}
        >
          <Alert
            variant="warning"
            title="Reports are reviewed by moderation"
            description="Provide accurate details. Repeated misuse of reporting tools may result in account restrictions."
            icon={
              <ShieldAlert
                aria-hidden={true}
                className="size-5"
              />
            }
          />

          <FormField
            label="Report Reason"
            labelFor="review-report-reason"
            required
            error={errors.reason?.message}
          >
            <Select
              id="review-report-reason"
              options={reasonOptions}
              disabled={loading}
              {...register("reason")}
            />
          </FormField>

          <FormField
            label="Detailed Explanation"
            labelFor="review-report-description"
            required
            error={errors.description?.message}
            description={`${description.length}/2500 characters`}
          >
            <Textarea
              id="review-report-description"
              rows={8}
              minLength={20}
              maxLength={2500}
              disabled={loading}
              placeholder="Explain which content violates the marketplace standards and why."
              {...register("description")}
            />
          </FormField>

          <FileDropzone
            accept={[
              "image/jpeg",
              "image/png",
              "image/webp",
              "application/pdf",
            ]}
            maximumSizeBytes={
              10 * 1024 * 1024
            }
            multiple
            disabled={
              loading ||
              !onFilesSelected
            }
            label="Supporting Evidence"
            description="Upload screenshots or documents supporting the report."
            onFilesSelected={(files) =>
              onFilesSelected?.(files)
            }
          />

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              disabled={loading}
              onClick={() =>
                onOpenChange(false)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={!isValid}
              loading={loading}
              loadingLabel="Submitting Report"
            >
              <Flag
                aria-hidden={true}
                className="size-4"
              />
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
