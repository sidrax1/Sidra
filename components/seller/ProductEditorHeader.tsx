"use client";

import {
 ArrowLeft,

  Eye,
  Save,
  Send,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import type { SellerProductStatus } from "@/components/seller/ProductStatusBadge";

interface ProductEditorHeaderProps {
  readonly title: string;
  readonly status: SellerProductStatus;
  readonly dirty: boolean;
  readonly saving?: boolean;
  readonly submitting?: boolean;
  readonly onBack: () => void;
  readonly onPreview: () => void;
  readonly onSave: () => void | Promise<void>;
  readonly onSubmitForReview: () => void | Promise<void>;
}

export function ProductEditorHeader({
  dirty,
  onBack,
  onPreview,
  onSave,
  onSubmitForReview,
  saving = false,
  status,
  submitting = false,
  title,
}: ProductEditorHeaderProps): React.JSX.Element {
  return (
    <header className="sticky top-0 z-30 border-b border-border
bg-[color:rgb(247_244_239_/_0.9)] px-5 py-4 backdrop-blur-xl
dark:bg-[color:rgb(17_17_17_/_0.9)] md:px-8">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
       <div className="flex min-w-0 items-center gap-4">
         <Button
          variant="ghost"
          size="icon"
          aria-label="Return to products"
          onClick={onBack}
         >

  <ArrowLeft aria-hidden="true" />
 </Button>

 <div className="min-w-0">
  <div className="flex flex-wrap items-center gap-3">
   <h1 className="truncate font-heading text-3xl font-medium tracking-[-0.03em]">
     {title}
   </h1>

   <Badge variant="neutral">
    {status}
   </Badge>

    {dirty ? (
      <Badge variant="warning">
        Unsaved Changes
      </Badge>
    ) : null}
  </div>
 </div>
</div>

<div className="flex flex-wrap gap-3">
 <Button
  variant="ghost"
  disabled={saving || submitting}
  onClick={onPreview}
 >
  <Eye aria-hidden="true" />
  Preview
 </Button>

 <Button
  variant="outline"
  loading={saving}
  loadingLabel="Saving"
  disabled={!dirty || submitting}
  onClick={() => {
    void onSave();
  }}
 >
  <Save aria-hidden="true" />
  Save Draft
 </Button>

      <Button
        loading={submitting}
        loadingLabel="Submitting"
        disabled={saving}
        onClick={() => {
          void onSubmitForReview();
        }}
      >
        <Send aria-hidden="true" />
        Submit for Review
      </Button>
     </div>
    </div>
   </header>
 );
}
