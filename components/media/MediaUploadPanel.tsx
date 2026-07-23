"use client";

import {
  useState,
} from "react";

import {
  ImagePlus,
  UploadCloud,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FileDropzone } from "@/components/ui/FileDropzone";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { ImagePreview } from "@/components/ui/ImagePreview";
import { Surface } from "@/components/ui/Surface";
import { MAX_IMAGE_SIZE } from "@/constants/uploads";

interface MediaUploadPanelProps {

    readonly loading?: boolean;
    readonly onUpload: (input: {
      readonly file: File;
      readonly altText: string;
    }) => void | Promise<void>;
}

export function MediaUploadPanel({
  loading = false,
  onUpload,
}: MediaUploadPanelProps): React.JSX.Element {
  const [file, setFile] =
    useState<File | null>(null);

    const [altText, setAltText] =
     useState("");

    const valid =
     file !== null &&
     altText.trim().length >= 2;

 return (
   <Surface className="grid gap-6">
    <header className="flex items-start gap-4">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
       <UploadCloud
        aria-hidden="true"
        className="size-5"
       />
      </span>

        <div>
         <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
          Upload Media
         </h2>

        <p className="mt-2 text-sm leading-6 text-muted">
         Add production-ready imagery with meaningful accessibility text.
        </p>
       </div>
      </header>

{file ? (
  <ImagePreview
    file={file}
    alt={altText || file.name}
    onRemove={() => {
      setFile(null);
      setAltText("");
    }}
    className="max-w-sm"
  />
):(
  <FileDropzone
    accept={[
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/avif",
    ]}
    maximumSizeBytes={
      MAX_IMAGE_SIZE
    }
    disabled={loading}
    label="Add Editorial Image"
    description="Upload JPG, PNG, WebP or AVIF imagery up to 10 MB."
    onFilesSelected={(
      files
    ) => {
      setFile(
        files.at(0) ?? null
      );
    }}
  />
)}

<FormField
 label="Alternative Text"
 labelFor="media-alt-text"
 required
 description="Describe the subject and purpose of the image."
>
 <Input
   id="media-alt-text"
   value={altText}
   disabled={

         loading || !file
        }
        maxLength={150}
        onChange={(event) =>
          setAltText(
            event.target.value
          )
        }
       />
      </FormField>

      <div className="flex justify-end border-t border-border pt-5">
       <Button
        disabled={!valid}
        loading={loading}
        loadingLabel="Uploading"
        onClick={() => {
          if (!file) {
            return;
          }

        void onUpload({
          file,
          altText:
            altText.trim(),
        });
      }}
     >
      <ImagePlus aria-hidden="true" />
      Upload Asset
     </Button>
    </div>
   </Surface>
 );
}
