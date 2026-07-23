"use client";

import { useState } from "react";
import {
  Camera,
  CheckCircle2,
  Hammer,
  PackageCheck,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import type { CustomOrderProductionStage } from "@/types/custom-order-workflow";

interface CustomOrderProductionUpdateFormProps {
  readonly customOrderId: string;
  readonly loading?: boolean;
  readonly uploadedAttachmentPaths?: readonly string[];
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (input: {
    readonly customOrderId: string;
    readonly stage: CustomOrderProductionStage;
    readonly message: string;
    readonly attachmentPaths: readonly string[];
    readonly customerVisible: boolean;
  }) => void | Promise<void>;
}

const stageOptions = [
  {
    value: "materialsPrepared",
    label: "Materials Prepared",
  },
  {
    value: "designApproved",
    label: "Design Approved",
  },
  {
    value: "casting",
    label: "Casting",
  },
  {
    value: "curing",
    label: "Curing",
  },
  {
    value: "finishing",
    label: "Finishing",
  },
  {
    value: "qualityCheck",
    label: "Quality Check",
  },
  {
    value: "packaging",
    label: "Packaging",
  },
  {
    value: "completed",
    label: "Production Completed",
  },
] as const;

export function CustomOrderProductionUpdateForm({
  customOrderId,
  loading = false,
  onFilesSelected,
  onSubmit,
  uploadedAttachmentPaths = [],
}: CustomOrderProductionUpdateFormProps): React.JSX.Element {
  const [stage, setStage] =
    useState<CustomOrderProductionStage>(
      "materialsPrepared"
    );

  const [message, setMessage] =
    useState("");

  const [
    customerVisible,
    setCustomerVisible,
  ] = useState(true);

  const valid =
    message.trim().length >= 5;

  const StageIcon =
    stage === "completed"
      ? CheckCircle2
      : stage === "packaging"
        ? PackageCheck
        : Hammer;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <StageIcon
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Craft Progress
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Publish Production Update
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Keep the collector informed with accurate milestone
            notes and approved progress media.
          </p>
        </div>
      </header>

      <FormField
        label="Production Stage"
        labelFor="production-update-stage"
        required
      >
        <Select
          id="production-update-stage"
          value={stage}
          options={stageOptions}
          disabled={loading}
          onChange={(event) =>
            setStage(
              event.target
                .value as CustomOrderProductionStage
            )
          }
        />
      </FormField>

      <FormField
        label="Progress Message"
        labelFor="production-update-message"
        required
        description={`${message.length}/2000 characters`}
      >
        <Textarea
          id="production-update-message"
          value={message}
          rows={7}
          disabled={loading}
          minLength={5}
          maxLength={2000}
          onChange={(event) =>
            setMessage(event.target.value)
          }
        />
      </FormField>

      <FileDropzone
        accept={[
          "image/jpeg",
          "image/png",
          "image/webp",
          "video/mp4",
        ]}
        maximumSizeBytes={
          20 * 1024 * 1024
        }
        multiple
        disabled={
          loading ||
          !onFilesSelected
        }
        label="Add Progress Media"
        description="Upload approved photographs or short MP4 clips up to 20 MB each."
        onFilesSelected={(files) => {
          onFilesSelected?.(files);
        }}
      />

      {uploadedAttachmentPaths.length >
      0 ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <Camera
              aria-hidden={true}
              className="size-4 text-[var(--color-gold-600)]"
            />

            {uploadedAttachmentPaths.length.toLocaleString(
              "en-IN"
            )}{" "}
            uploaded{" "}
            {uploadedAttachmentPaths.length ===
            1
              ? "file"
              : "files"}
          </p>
        </div>
      ) : null}

      <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
        <input
          type="checkbox"
          checked={customerVisible}
          disabled={loading}
          onChange={(event) =>
            setCustomerVisible(
              event.target.checked
            )
          }
          className="mt-1 size-4 accent-[var(--color-gold-500)]"
        />

        <span>
          <span className="block text-sm font-medium text-foreground">
            Visible to collector
          </span>

          <span className="mt-1 block text-xs leading-5 text-muted">
            The update will appear in the collector timeline and
            notification feed.
          </span>
        </span>
      </label>

      <div className="flex justify-end border-t border-border pt-5">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Publishing Update"
          onClick={() => {
            void Promise.resolve(
              onSubmit({
                customOrderId,
                stage,
                message: message.trim(),
                attachmentPaths:
                  uploadedAttachmentPaths,
                customerVisible,
              })
            ).then(() => {
              setMessage("");
            });
          }}
        >
          <Send aria-hidden={true} />
          Publish Update
        </Button>
      </div>
    </Surface>
  );
}
