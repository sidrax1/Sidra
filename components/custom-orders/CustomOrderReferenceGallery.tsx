"use client";

import Image from "next/image";
import {
  Download,
  Expand,
  FileText,
  Images,
} from "lucide-react";

import { IconButton } from "@/components/ui/IconButton";
import { cn } from "@/lib/utils";

export interface CustomOrderReference {
  readonly id: string;
  readonly url: string;
  readonly fileName: string;
  readonly mimeType: string;
  readonly altText?: string;
}

interface CustomOrderReferenceGalleryProps {
  readonly references: readonly CustomOrderReference[];
  readonly className?: string;
  readonly onPreview?: (
    reference: CustomOrderReference
  ) => void;
}

export function CustomOrderReferenceGallery({
  className,
  onPreview,
  references,
}: CustomOrderReferenceGalleryProps): React.JSX.Element {
  if (references.length === 0) {
    return (
      <section
        className={cn(
          "rounded-[var(--radius-lg)] border border-dashed border-border",
          "bg-card px-6 py-14 text-center",
          className
        )}
      >
        <span className="mx-auto flex size-14 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <Images aria-hidden="true" className="size-6" />
        </span>

        <h2 className="mt-5 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          No design references
        </h2>

        <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-muted">
          Photographs, measurements and supporting documents will
          appear here when attached to the commission.
        </p>
      </section>
    );
  }

  return (
    <section
      aria-label="Custom order reference files"
      className={cn("grid gap-6", className)}
    >
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Design References
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          Client Attachments
        </h2>
      </header>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {references.map((reference) => {
          const image =
            reference.mimeType.startsWith("image/");

          return (
            <article
              key={reference.id}
              className="group overflow-hidden rounded-[var(--radius-lg)] border border-border bg-card shadow-[var(--shadow-card)] transition-[transform,border-color,box-shadow] duration-[var(--duration-base)] hover:-translate-y-0.5 hover:border-[color:rgb(200_169_106_/_0.42)] hover:shadow-[var(--shadow-hover)]"
            >
              <div className="relative aspect-square overflow-hidden bg-[var(--color-gray-100)]">
                {image ? (
                  <Image
                    src={reference.url}
                    alt={
                      reference.altText ??
                      reference.fileName
                    }
                    fill
                    sizes="(max-width: 640px) 100vw, 33vw"
                    className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
                  />
                ) : (
                  <div className="flex size-full flex-col items-center justify-center gap-4 p-6 text-center">
                    <span className="flex size-16 items-center justify-center rounded-full border border-border bg-card text-[var(--color-gold-600)]">
                      <FileText
                        aria-hidden="true"
                        className="size-7"
                      />
                    </span>

                    <p className="line-clamp-2 text-sm font-medium text-foreground">
                      {reference.fileName}
                    </p>
                  </div>
                )}

                <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                  {onPreview ? (
                    <IconButton
                      label={`Preview ${reference.fileName}`}
                      icon={<Expand aria-hidden="true" />}
                      appearance="glass"
                      size="sm"
                      onClick={() =>
                        onPreview(reference)
                      }
                    />
                  ) : null}

                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noreferrer"
                    download
                    aria-label={`Download ${reference.fileName}`}
                    className="flex size-9 items-center justify-center rounded-full border border-white/20 bg-black/45 text-white backdrop-blur-xl"
                  >
                    <Download
                      aria-hidden="true"
                      className="size-4"
                    />
                  </a>
                </div>
              </div>

              <div className="p-4">
                <p className="truncate text-sm font-medium text-foreground">
                  {reference.fileName}
                </p>

                <p className="mt-1 truncate text-xs text-muted">
                  {reference.mimeType}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
