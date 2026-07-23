"use client";

import {
  TriangleAlert,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";

interface ConfirmationDialogProps {
  readonly open: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly title: string;
  readonly description: string;
  readonly confirmLabel?: string;
  readonly cancelLabel?: string;

    readonly destructive?: boolean;
    readonly loading?: boolean;
    readonly onConfirm: () => void | Promise<void>;
}

export function ConfirmationDialog({
  cancelLabel = "Cancel",
  confirmLabel = "Confirm",
  description,
  destructive = false,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  title,
}: ConfirmationDialogProps): React.JSX.Element {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent className="max-w-lg">
       <DialogHeader>
         <div className="mb-3 flex size-12 items-center justify-center rounded-full border
border-[color:rgb(166_124_46_/_0.28)] bg-[color:rgb(166_124_46_/_0.08)]
text-[var(--color-warning)]">
          <TriangleAlert
           aria-hidden={true}
           className="size-5"
          />
         </div>

        <DialogTitle>
         {title}
        </DialogTitle>

        <DialogDescription>
         {description}
        </DialogDescription>
       </DialogHeader>

       <DialogFooter>
        <Button
         variant="ghost"

        disabled={loading}
        onClick={() =>
          onOpenChange(false)
        }
       >
        {cancelLabel}
       </Button>

      <Button
        variant={
          destructive
           ? "danger"
           : "primary"
        }
        loading={loading}
        loadingLabel="Processing"
        onClick={() => {
          void onConfirm();
        }}
      >
        {confirmLabel}
      </Button>
     </DialogFooter>
    </DialogContent>
   </Dialog>
 );
}
