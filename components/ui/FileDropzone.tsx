"use client";

import {
  useRef,
  useState,
  type DragEvent,
} from "react";

import {
  FileUp,
  ImagePlus,
} from "lucide-react";

import {
  Button,
} from "@/components/ui/Button";

import {
  bytesToReadableSize,
} from "@/utils/file";

import {
  cn,
} from "@/lib/utils";

interface FileDropzoneProps {
  readonly accept: readonly string[];
  readonly maximumSizeBytes: number;
  readonly multiple?: boolean;
  readonly disabled?: boolean;
  readonly label?: string;
  readonly description?: string;
  readonly onFilesSelected: (
    files: readonly File[]
  ) => void;
  readonly className?: string;
}

export function FileDropzone({
  accept,
  className,
  description,
  disabled = false,
  label = "Upload files",
  maximumSizeBytes,
  multiple = false,
  onFilesSelected,
}: FileDropzoneProps): React.JSX.Element {
  const inputReference =
    useRef<HTMLInputElement>(null);

 const [dragging, setDragging] =
  useState(false);

 const processFiles = (
   files: FileList | readonly File[]
 ): void => {
   const acceptedFiles = Array.from(
     files
   ).filter(
     (file) =>
       accept.includes(file.type) &&
       file.size <= maximumSizeBytes
   );

  if (acceptedFiles.length === 0) {
    return;
  }

  onFilesSelected(
    multiple
     ? acceptedFiles
     : acceptedFiles.slice(0, 1)
  );
};

const handleDrop = (
  event: DragEvent<HTMLDivElement>
): void => {
  event.preventDefault();
  setDragging(false);

 if (disabled) {
   return;
 }

  processFiles(
    event.dataTransfer.files
  );
};

return (
 <div
   onDragEnter={(event) => {
     event.preventDefault();
     setDragging(true);
   }}
   onDragOver={(event) => {
     event.preventDefault();
     setDragging(true);
   }}
   onDragLeave={(event) => {
     event.preventDefault();

    if (
      event.currentTarget.contains(
         event.relatedTarget as Node | null
      )
    ){
      return;
    }

    setDragging(false);

   }}
   onDrop={handleDrop}
   className={cn(
     "relative flex min-h-64 flex-col items-center justify-center rounded-lg border-2border-dashed px-6 py-10 text-center",
     "transition-[border-color,background-color,box-shadow] duration-[var(--duration-base)]",
     dragging
       ? "border-[var(--color-gold-500)] bg-[color:rgb(200_169_106_/_0.08)]shadow-[var(--shadow-gold-glow)]"
       : "border-border bg-card",
     disabled &&
       "pointer-events-none opacity-45",
     className
   )}
  >
   <input
     ref={inputReference}
     type="file"
     accept={accept.join(",")}
     multiple={multiple}
     disabled={disabled}
     className="sr-only"
     onChange={(event) => {
       if (event.target.files) {
         processFiles(
           event.target.files
         );
       }

      event.target.value = "";
    }}
   />

    <div className="flex size-16 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.1)]
text-[var(--color-gold-600)] shadow-[var(--shadow-gold-glow)]">
      {accept.some((type) =>
       type.startsWith("image/")
      )?(
       <ImagePlus
         aria-hidden="true"
         className="size-7"
       />
      ):(

         <FileUp
          aria-hidden="true"
          className="size-7"
         />
       )}
      </div>

    <h3 className="mt-6 font-heading text-3xl font-medium tracking-[-0.02em]
text-foreground">
      {label}
    </h3>

   <p className="mt-2 max-w-md text-sm leading-6 text-muted">
     {description ??
      `Drag and drop files here, or select files from your device. Maximum size
${bytesToReadableSize(maximumSizeBytes)}.`}
   </p>

    <Button
     variant="outline"
     className="mt-6"
     onClick={() =>
       inputReference.current?.click()
     }
    >
     Select Files
    </Button>
   </div>
 );
}
