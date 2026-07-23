"use client";

import {
  ChevronDown,
  ChevronUp,
  Copy,
  GripVertical,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/Button";

import { IconButton } from "@/components/ui/IconButton";
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import type { CmsSection } from "@/types/cms";

interface CmsSectionEditorProps {
  readonly section: CmsSection;
  readonly index: number;
  readonly totalSections: number;
  readonly disabled?: boolean;
  readonly onChange: (section: CmsSection) => void;
  readonly onMove: (
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  readonly onDuplicate: (section: CmsSection) => void;
  readonly onDelete: (section: CmsSection) => void;
}

export function CmsSectionEditor({
  disabled = false,
  index,
  onChange,
  onDelete,
  onDuplicate,
  onMove,
  section,
  totalSections,
}: CmsSectionEditorProps): React.JSX.Element {
  const serializedContent = JSON.stringify(
    section.content,
    null,
    2
  );

 return (
  <article
    draggable={!disabled}
    onDragStart={(event) => {
      event.dataTransfer.setData("text/plain", String(index));
    }}
    onDragOver={(event) => {
      event.preventDefault();

   }}
   onDrop={(event) => {
     event.preventDefault();

     const sourceIndex = Number(
       event.dataTransfer.getData("text/plain")
     );

     if (
       Number.isInteger(sourceIndex) &&
       sourceIndex !== index
     ){
       onMove(sourceIndex, index);
     }
   }}
   className={cn(
     "overflow-hidden rounded-[var(--radius-lg)] border bg-card",
     "shadow-[var(--shadow-card)]",
     section.enabled
       ? "border-[color:rgb(200_169_106_/_0.34)]"
       : "border-border opacity-75"
   )}
  >
   <header className="flex flex-col gap-4 border-b border-border p-5 sm:flex-row
sm:items-center sm:justify-between">
     <div className="flex min-w-0 items-center gap-3">
       <span className="flex size-10 shrink-0 cursor-grab items-center justify-center
rounded-full border border-border bg-background text-muted">
          <GripVertical
           aria-hidden="true"
           className="size-4"
          />
       </span>

      <div className="min-w-0">
       <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted">
        Section {index + 1}
       </p>

       <h3 className="mt-1 truncate font-heading text-2xl font-medium text-foreground">
         {section.type}
       </h3>
      </div>
     </div>

<div className="flex flex-wrap items-center gap-2">
 <Switch
  checked={section.enabled}
  disabled={disabled}
  label="Enabled"
  onCheckedChange={(checked) => {
    onChange({
      ...section,
      enabled: checked,
    });
  }}
 />

 <IconButton
  label="Move section up"
  icon={<ChevronUp aria-hidden="true" />}
  appearance="ghost"
  size="sm"
  disabled={disabled || index === 0}
  onClick={() => onMove(index, index - 1)}
 />

 <IconButton
  label="Move section down"
  icon={<ChevronDown aria-hidden="true" />}
  appearance="ghost"
  size="sm"
  disabled={
    disabled ||
    index === totalSections - 1
  }
  onClick={() => onMove(index, index + 1)}
 />

 <IconButton
  label="Duplicate section"
  icon={<Copy aria-hidden="true" />}
  appearance="ghost"
  size="sm"
  disabled={disabled}
  onClick={() => onDuplicate(section)}
 />

  <IconButton
   label="Delete section"
   icon={<Trash2 aria-hidden="true" />}
   appearance="ghost"
   size="sm"
   disabled={disabled}
   className="text-[var(--color-error)]"
   onClick={() => onDelete(section)}
  />
 </div>
</header>

<div className="grid gap-4 p-5">
 <label
  htmlFor={`cms-section-content-${section.id}`}
  className="text-sm font-medium text-foreground"
 >
  Structured Content
 </label>

 <Textarea
  id={`cms-section-content-${section.id}`}
  value={serializedContent}
  rows={14}
  disabled={disabled}
  spellCheck={false}
  className="font-mono text-xs leading-6"
  onChange={(event) => {
    try {
      const parsed = JSON.parse(
        event.target.value
      ) as Record<string, unknown>;

      onChange({
        ...section,
        content: parsed,
      });
    } catch {
      return;
    }
  }}
 />

 <p className="text-xs leading-5 text-muted">

       Content is stored as validated structured data and rendered through
       the registered section component for this type.
     </p>
    </div>
   </article>
 );
}
