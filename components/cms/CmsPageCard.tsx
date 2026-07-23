"use client";

import {
  Archive,
  Copy,
  Edit3,
  Eye,
  MoreHorizontal,
} from "lucide-react";

import { CmsDocumentStatusBadge } from "@/components/cms/CmsDocumentStatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { IconButton } from "@/components/ui/IconButton";
import { formatDateTime } from "@/lib/date";
import type { CmsPage } from "@/types/cms";

interface CmsPageCardProps {
  readonly page: CmsPage;
  readonly loading?: boolean;
  readonly onPreview: (page: CmsPage) => void;
  readonly onEdit: (page: CmsPage) => void;
  readonly onDuplicate: (page: CmsPage) => void | Promise<void>;
  readonly onArchive: (page: CmsPage) => void | Promise<void>;
}

export function CmsPageCard({
  loading = false,
  onArchive,
  onDuplicate,
  onEdit,
  onPreview,
  page,
}: CmsPageCardProps): React.JSX.Element {
  const enabledSectionCount =
    page.sections.filter((section) => section.enabled).length;

 return (
   <article className="grid gap-5 rounded-[var(--radius-lg)] border border-border bg-card p-5
shadow-[var(--shadow-card)] transition-[border-color,box-shadow]
hover:border-[color:rgb(200_169_106_/_0.35)] hover:shadow-[var(--shadow-hover)]
md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
    <div className="min-w-0">
      <div className="flex flex-wrap items-center gap-3">
       <h3 className="truncate font-heading text-2xl font-medium tracking-[-0.025em]
text-foreground">
        {page.title}
       </h3>

  <CmsDocumentStatusBadge status={page.status} />
 </div>

 <p className="mt-2 truncate text-sm text-muted">
  /{page.slug}
 </p>

 <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
  <span>
   {enabledSectionCount.toLocaleString("en-IN")} active sections
  </span>

  <span>
   Updated {formatDateTime(page.updatedAt)}
  </span>

  {page.publishedAt ? (
    <span>
      Published {formatDateTime(page.publishedAt)}
    </span>
  ) : null}
 </div>
</div>

<DropdownMenu>
 <DropdownMenuTrigger>
  <IconButton
   label={`Actions for ${page.title}`}
   icon={<MoreHorizontal aria-hidden="true" />}
   appearance="ghost"
   disabled={loading}
  />
 </DropdownMenuTrigger>

 <DropdownMenuContent>
  <DropdownMenuItem onSelect={() => onPreview(page)}>
   <Eye aria-hidden="true" className="size-4" />
   Preview Page
  </DropdownMenuItem>

  <DropdownMenuItem onSelect={() => onEdit(page)}>
   <Edit3 aria-hidden="true" className="size-4" />
   Edit Page

      </DropdownMenuItem>

      <DropdownMenuItem
       onSelect={() => {
         void onDuplicate(page);
       }}
      >
       <Copy aria-hidden="true" className="size-4" />
       Duplicate
      </DropdownMenuItem>

      <DropdownMenuSeparator />

       <DropdownMenuItem
         destructive
         onSelect={() => {
           void onArchive(page);
         }}
       >
         <Archive aria-hidden="true" className="size-4" />
         Archive
       </DropdownMenuItem>
     </DropdownMenuContent>
    </DropdownMenu>
   </article>
 );
}
