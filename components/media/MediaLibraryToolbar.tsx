"use client";

import {
  Grid2X2,
  List,
  RefreshCw,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { IconButton } from "@/components/ui/IconButton";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { cn } from "@/lib/utils";

export type MediaLibraryView =
 | "grid"
 | "list";

export type MediaTypeFilter =
 | "all"
 | "image"
 | "document"
 | "video";

interface MediaLibraryToolbarProps {
  readonly query: string;
  readonly type: MediaTypeFilter;
  readonly view: MediaLibraryView;
  readonly loading?: boolean;
  readonly className?: string;
  readonly onQueryChange: (
    query: string
  ) => void;
  readonly onTypeChange: (
    type: MediaTypeFilter
  ) => void;
  readonly onViewChange: (
    view: MediaLibraryView
  ) => void;
  readonly onRefresh: () => void | Promise<void>;
  readonly onUpload: () => void;
}

const typeOptions = [
 {

    value: "all",
    label: "All Media",
  },
  {
    value: "image",
    label: "Images",
  },
  {
    value: "document",
    label: "Documents",
  },
  {
    value: "video",
    label: "Videos",
  },
] as const;

export function MediaLibraryToolbar({
  className,
  loading = false,
  onQueryChange,
  onRefresh,
  onTypeChange,
  onUpload,
  onViewChange,
  query,
  type,
  view,
}: MediaLibraryToolbarProps): React.JSX.Element {
  return (
    <div
     className={cn(
       "flex flex-col gap-4 rounded-[var(--radius-lg)] border border-border bg-card p-4shadow-[var(--shadow-card)]",
       "xl:flex-row xl:items-center",
       className
     )}
    >
     <SearchInput
       value={query}
       disabled={loading}
       placeholder="Search media..."
       className="xl:min-w-80 xl:flex-1"
       onChange={(event) =>

  onQueryChange(
    event.target.value
  )
 }
 onClear={() =>
   onQueryChange("")
 }
/>

<Select
 value={type}
 options={typeOptions}
 disabled={loading}
 aria-label="Filter media type"
 className="xl:w-48"
 onChange={(event) =>
   onTypeChange(
     event.target
      .value as MediaTypeFilter
   )
 }
/>

<div className="flex items-center rounded-full border border-border bg-background p-1">
 <IconButton
  label="Grid view"
  icon={<Grid2X2 aria-hidden="true" />}
  size="sm"
  appearance={
    view === "grid"
     ? "default"
     : "ghost"
  }
  disabled={loading}
  onClick={() =>
    onViewChange("grid")
  }
 />

 <IconButton
  label="List view"
  icon={<List aria-hidden="true" />}
  size="sm"
  appearance={

         view === "list"
          ? "default"
          : "ghost"
        }
        disabled={loading}
        onClick={() =>
          onViewChange("list")
        }
       />
      </div>

      <Button
       variant="ghost"
       disabled={loading}
       onClick={() => {
         void onRefresh();
       }}
      >
       <RefreshCw
         aria-hidden="true"
         className={cn(
           "size-4",
           loading && "animate-spin"
         )}
       />
       Refresh
      </Button>

    <Button
     disabled={loading}
     onClick={onUpload}
    >
     <Upload aria-hidden="true" />
     Upload
    </Button>
   </div>
 );
}
