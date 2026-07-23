"use client";

import {
  Edit3,
  Flag,
  MoreHorizontal,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import type { ProductReview } from "@/types/review";

interface ReviewActionMenuProps {
  readonly review: ProductReview;
  readonly canEdit?: boolean;
  readonly canDelete?: boolean;
  readonly canReport?: boolean;
  readonly disabled?: boolean;
  readonly onEdit?: (
    review: ProductReview
  ) => void;
  readonly onDelete?: (
    review: ProductReview
  ) => void;
  readonly onReport?: (
    review: ProductReview
  ) => void;
}

export function ReviewActionMenu({
  canDelete = false,
  canEdit = false,
  canReport = false,
  disabled = false,
  onDelete,
  onEdit,
  onReport,
  review,
}: ReviewActionMenuProps): React.JSX.Element | null {
  if (
    !canEdit &&
    !canDelete &&
    !canReport
  ) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <IconButton
          label="Review actions"
          icon={
            <MoreHorizontal aria-hidden={true} />
          }
          appearance="ghost"
          disabled={disabled}
        />
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="min-w-52"
      >
        {canEdit &&
        onEdit ? (
          <DropdownMenuItem
            onSelect={() =>
              onEdit(review)
            }
          >
            <Edit3
              aria-hidden={true}
              className="size-4"
            />
            Edit review
          </DropdownMenuItem>
        ) : null}

        {canReport &&
        onReport ? (
          <DropdownMenuItem
            onSelect={() =>
              onReport(review)
            }
          >
            <Flag
              aria-hidden={true}
              className="size-4"
            />
            Report review
          </DropdownMenuItem>
        ) : null}

        {canDelete &&
        onDelete ? (
          <DropdownMenuItem
            destructive
            onSelect={() =>
              onDelete(review)
            }
          >
            <Trash2
              aria-hidden={true}
              className="size-4"
            />
            Delete review
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
