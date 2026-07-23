"use client";

import Image from "next/image";
import {
  Camera,
  Trash2,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { cn } from "@/lib/utils";

interface AccountProfilePhotoUploaderProps {
  readonly displayName: string;
  readonly photoURL?: string | null;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onFileSelected: (
    file: File
  ) => void | Promise<void>;
  readonly onRemove?: () => void | Promise<void>;
}

export function AccountProfilePhotoUploader({
  className,
  displayName,
  loading = false,
  onFileSelected,
  onRemove,
  photoURL,
}: AccountProfilePhotoUploaderProps): React.JSX.Element {
  return (
    <section
      className={cn(
        "grid gap-6 rounded-[var(--radius-xl)] border border-border bg-card p-6",
        "shadow-[var(--shadow-card)] md:grid-cols-[180px_minmax(0,1fr)] md:items-center",
        className
      )}
    >
      <div className="relative mx-auto aspect-square w-full max-w-[180px] overflow-hidden rounded-full border border-[color:rgb(200_169_106_/_0.35)] bg-background shadow-[var(--shadow-hover)]">
        {photoURL ? (
          <Image
            src={photoURL}
            alt={displayName}
            fill
            sizes="180px"
            className="object-cover"
          />
        ) : (
          <div className="flex size-full flex-col items-center justify-center gap-3 text-center">
            <Camera
              aria-hidden="true"
              className="size-7 text-[var(--color-gold-600)]"
            />

            <span className="text-sm font-medium text-foreground">
              {displayName
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Profile Portrait
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Account Photograph
          </h2>

          <p className="mt-2 max-w-xl text-sm leading-6 text-muted">
            Upload a clear JPG, PNG or WebP portrait. The original
            file is stored securely and displayed only on authorised
            account surfaces.
          </p>
        </div>

        <FileDropzone
          accept={[
            "image/jpeg",
            "image/png",
            "image/webp",
          ]}
          maximumSizeBytes={
            5 * 1024 * 1024
          }
          multiple={false}
          disabled={loading}
          label="Select Profile Photograph"
          description="Maximum file size 5 MB."
          onFilesSelected={(files) => {
            const file = files.at(0);

            if (file) {
              void onFileSelected(
                file
              );
            }
          }}
        />

        {photoURL &&
        onRemove ? (
          <div className="flex justify-end">
            <Button
              variant="ghost"
              disabled={loading}
              className="text-[var(--color-error)]"
              onClick={() => {
                void onRemove();
              }}
            >
              <Trash2
                aria-hidden="true"
                className="size-4"
              />
              Remove Photograph
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
