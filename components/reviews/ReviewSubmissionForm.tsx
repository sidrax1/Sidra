"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  ImagePlus,
  ShieldCheck,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";

interface ReviewSubmissionFormProps {
  readonly productId: string;
  readonly orderId: string;
  readonly productTitle: string;
  readonly uploadedMediaPaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (input: {
    readonly productId: string;
    readonly orderId: string;
    readonly rating: number;
    readonly title: string;
    readonly review: string;
    readonly mediaPaths: readonly string[];
  }) => void | Promise<void>;
}

export function ReviewSubmissionForm({
  loading = false,
  onFilesSelected,
  onSubmit,
  orderId,
  productId,
  productTitle,
  uploadedMediaPaths = [],
}: ReviewSubmissionFormProps): React.JSX.Element {
  const [rating, setRating] =
    useState(5);

  const [title, setTitle] =
    useState("");

  const [review, setReview] =
    useState("");

  const valid = useMemo(
    () =>
      rating >= 1 &&
      rating <= 5 &&
      title.trim().length >= 3 &&
      review.trim().length >= 20,
    [rating, review, title]
  );

  return (
    <Surface className="grid gap-7" shadow="hover">
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Star
            aria-hidden={true}
            className="size-5 fill-current"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Verified Purchase Review
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Share Your Experience
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Review {productTitle} and help future collectors understand
            its craftsmanship.
          </p>
        </div>
      </header>

      <div>
        <p className="text-sm font-medium text-foreground">
          Your Rating
        </p>

        <div
          role="radiogroup"
          aria-label="Product rating"
          className="mt-3 flex flex-wrap gap-2"
        >
          {[1, 2, 3, 4, 5].map(
            (value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={
                  rating === value
                }
                aria-label={`${value} stars`}
                disabled={loading}
                onClick={() =>
                  setRating(value)
                }
                className={cn(
                  "flex size-12 items-center justify-center rounded-full border",
                  "transition-[border-color,background-color,transform]",
                  rating >= value
                    ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                    : "border-border bg-background text-muted",
                  "hover:scale-105 hover:border-[var(--color-gold-500)]"
                )}
              >
                <Star
                  aria-hidden={true}
                  className={cn(
                    "size-5",
                    rating >= value &&
                      "fill-current"
                  )}
                />
              </button>
            )
          )}
        </div>
      </div>

      <FormField
        label="Review Title"
        labelFor="review-title"
        required
        description={`${title.length}/100 characters`}
      >
        <Input
          id="review-title"
          value={title}
          disabled={loading}
          minLength={3}
          maxLength={100}
          onChange={(event) =>
            setTitle(event.target.value)
          }
        />
      </FormField>

      <FormField
        label="Detailed Review"
        labelFor="review-content"
        required
        description={`${review.length}/2000 characters`}
      >
        <Textarea
          id="review-content"
          value={review}
          rows={8}
          disabled={loading}
          minLength={20}
          maxLength={2000}
          onChange={(event) =>
            setReview(event.target.value)
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
        label="Add Review Media"
        description="Upload clear photographs or one short MP4 video."
        onFilesSelected={(files) => {
          onFilesSelected?.(files);
        }}
      />

      {uploadedMediaPaths.length >
      0 ? (
        <div className="rounded-[var(--radius-md)] border border-border bg-background p-4">
          <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
            <ImagePlus
              aria-hidden={true}
              className="size-4 text-[var(--color-gold-600)]"
            />

            {uploadedMediaPaths.length.toLocaleString(
              "en-IN"
            )}{" "}
            uploaded{" "}
            {uploadedMediaPaths.length ===
            1
              ? "file"
              : "files"}
          </p>
        </div>
      ) : null}

      <div className="flex items-start gap-3 border-t border-border pt-5 text-xs leading-6 text-muted">
        <ShieldCheck
          aria-hidden={true}
          className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
        />

        <p>
          Reviews are linked to verified orders and moderated for
          authenticity, safety and policy compliance.
        </p>
      </div>

      <div className="flex justify-end">
        <Button
          disabled={!valid}
          loading={loading}
          loadingLabel="Submitting Review"
          onClick={() => {
            void onSubmit({
              productId,
              orderId,
              rating,
              title: title.trim(),
              review: review.trim(),
              mediaPaths:
                uploadedMediaPaths,
            });
          }}
        >
          Submit Review
        </Button>
      </div>
    </Surface>
  );
}
