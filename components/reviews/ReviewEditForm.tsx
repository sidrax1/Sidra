"use client";

import {
  useState,
} from "react";
import {
  Save,
  Star,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import type { ProductReview } from "@/types/review";

interface ReviewEditFormProps {
  readonly review: ProductReview;
  readonly loading?: boolean;
  readonly onCancel?: () => void;
  readonly onSubmit: (input: {
    readonly reviewId: string;
    readonly rating: number;
    readonly title: string;
    readonly review: string;
    readonly mediaPaths: readonly string[];
  }) => void | Promise<void>;
}

export function ReviewEditForm({
  loading = false,
  onCancel,
  onSubmit,
  review,
}: ReviewEditFormProps): React.JSX.Element {
  const [rating, setRating] =
    useState(review.rating);

  const [title, setTitle] =
    useState(review.title);

  const [content, setContent] =
    useState(review.review);

  const valid =
    title.trim().length >= 3 &&
    content.trim().length >= 20;

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Collector Review
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Refine Your Review
        </h2>
      </header>

      <div>
        <p className="text-sm font-medium text-foreground">
          Rating
        </p>

        <div className="mt-3 flex gap-2">
          {[1, 2, 3, 4, 5].map(
            (value) => (
              <button
                key={value}
                type="button"
                aria-label={`${value} stars`}
                aria-pressed={
                  rating === value
                }
                disabled={loading}
                onClick={() =>
                  setRating(
                    value as
                      | 1
                      | 2
                      | 3
                      | 4
                      | 5
                  )
                }
                className={cn(
                  "flex size-11 items-center justify-center rounded-full border",
                  rating >= value
                    ? "border-[var(--color-gold-500)] bg-[var(--color-gold-100)] text-[var(--color-gold-600)]"
                    : "border-border bg-background text-muted"
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
        labelFor="edit-review-title"
        required
      >
        <Input
          id="edit-review-title"
          value={title}
          disabled={loading}
          minLength={3}
          maxLength={100}
          onChange={(event) =>
            setTitle(
              event.target.value
            )
          }
        />
      </FormField>

      <FormField
        label="Review"
        labelFor="edit-review-content"
        required
        description={`${content.length}/2000 characters`}
      >
        <Textarea
          id="edit-review-content"
          value={content}
          rows={8}
          disabled={loading}
          minLength={20}
          maxLength={2000}
          onChange={(event) =>
            setContent(
              event.target.value
            )
          }
        />
      </FormField>

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
          loadingLabel="Saving Review"
          onClick={() => {
            void onSubmit({
              reviewId: review.id,
              rating,
              title: title.trim(),
              review:
                content.trim(),
              mediaPaths:
                review.images,
            });
          }}
        >
          <Save
            aria-hidden={true}
            className="size-4"
          />
          Save Review
        </Button>
      </div>
    </Surface>
  );
}
