"use client";

import {
  History,
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

interface RecentlyViewedClearDialogProps {
  readonly open: boolean;
  readonly itemCount: number;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: () => void | Promise<void>;
}

export function RecentlyViewedClearDialog({
  itemCount,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
}: RecentlyViewedClearDialogProps): React.JSX.Element {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            Clear Viewing History
          </DialogTitle>

          <DialogDescription>
            Remove all recently viewed product records from your
            Sidra account.
          </DialogDescription>
        </DialogHeader>

        <Alert
          variant="warning"
          title={`${itemCount.toLocaleString(
            "en-IN"
          )} ${
            itemCount === 1
              ? "item"
              : "items"
          } will be removed`}
          description="This does not affect your wishlist, orders or followed Studios."
          icon={
            <History
              aria-hidden={true}
              className="size-5"
            />
          }
        />

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Keep History
          </Button>

          <Button
            variant="danger"
            disabled={itemCount === 0}
            loading={loading}
            loadingLabel="Clearing History"
            onClick={() => {
              void onConfirm();
            }}
          >
            <Trash2
              aria-hidden={true}
              className="size-4"
            />
            Clear History
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
