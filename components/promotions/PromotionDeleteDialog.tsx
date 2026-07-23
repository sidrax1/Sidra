"use client";

import {
  ShieldAlert,
  Trash2,
} from "lucide-react";

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
import type { Promotion } from "@/types/promotion";

interface PromotionDeleteDialogProps {
  readonly open: boolean;
  readonly promotion: Promotion | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    promotionId: string
  ) => void | Promise<void>;
}

export function PromotionDeleteDialog({
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  promotion,
}: PromotionDeleteDialogProps): React.JSX.Element {
  const hasRedemptions =
    (promotion?.usage.usageCount ?? 0) > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Delete Promotion
          </DialogTitle>

          <DialogDescription>
            Permanently remove this unused promotional campaign.
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant="warning"
          title={
            hasRedemptions
              ? "This promotion has redemption history"
              : "Deletion cannot be undone"
          }
          description={
            hasRedemptions
              ? "Promotions with recorded redemptions should be archived instead of deleted."
              : "The promotion configuration and coupon code will be permanently removed."
          }
          icon={
            <ShieldAlert
              aria-hidden={true}
              className="size-5"
            />
          }
        />

        {promotion ? (
          <div className="rounded-[var(--radius-md)] border border-border bg-background p-5">
            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
              {promotion.name}
            </h3>

            {promotion.code ? (
              <p className="mt-2 font-mono text-sm text-muted">
                {promotion.code}
              </p>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() => onOpenChange(false)}
          >
            Keep Promotion
          </Button>

          <Button
            variant="danger"
            disabled={
              !promotion || hasRedemptions
            }
            loading={loading}
            loadingLabel="Deleting Promotion"
            onClick={() => {
              if (promotion) {
                void onConfirm(promotion.id);
              }
            }}
          >
            <Trash2
              aria-hidden={true}
              className="size-4"
            />
            Delete Promotion
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
