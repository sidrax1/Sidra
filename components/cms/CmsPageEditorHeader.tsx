"use client";

import {
  ArrowLeft,
  Eye,
  Save,
  Send,
} from "lucide-react";

import { CmsDocumentStatusBadge } from "@/components/cms/CmsDocumentStatusBadge";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { CmsDocumentStatus } from "@/types/cms";

interface CmsPageEditorHeaderProps {
  readonly title: string;
  readonly status: CmsDocumentStatus;
  readonly dirty: boolean;
  readonly saving?: boolean;
  readonly publishing?: boolean;
  readonly onBack: () => void;
  readonly onPreview: () => void;
  readonly onSave: () => void | Promise<void>;
  readonly onPublish: () => void | Promise<void>;
}

export function CmsPageEditorHeader({
  dirty,
  onBack,
  onPreview,
  onPublish,
  onSave,
  publishing = false,
  saving = false,
  status,
  title,
}: CmsPageEditorHeaderProps): React.JSX.Element {
  return (

  <header className="sticky top-0 z-40 border-b border-border
bg-[color:rgb(247_244_239_/_0.9)] px-5 py-4 backdrop-blur-xl
dark:bg-[color:rgb(17_17_17_/_0.9)] md:px-8">
    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
     <div className="flex min-w-0 items-center gap-4">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Return to content pages"
        onClick={onBack}
      >
        <ArrowLeft aria-hidden={true} />
      </Button>

      <div className="min-w-0">
       <div className="flex flex-wrap items-center gap-3">
        <h1 className="truncate font-heading text-3xl font-medium tracking-[-0.03em]">
          {title}
        </h1>

         <CmsDocumentStatusBadge status={status} />

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
       disabled={saving || publishing}
       onClick={onPreview}
      >
       <Eye aria-hidden={true} />
       Preview
      </Button>

      <Button
       variant="outline"
       disabled={!dirty || publishing}

       loading={saving}
       loadingLabel="Saving"
       onClick={() => {
         void onSave();
       }}
      >
       <Save aria-hidden={true} />
       Save Draft
      </Button>

      <Button
        disabled={saving}
        loading={publishing}
        loadingLabel="Publishing"
        onClick={() => {
          void onPublish();
        }}
      >
        <Send aria-hidden={true} />
        Publish
      </Button>
     </div>
    </div>
   </header>
 );
}
