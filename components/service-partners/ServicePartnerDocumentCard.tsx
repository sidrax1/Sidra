"use client";

import {
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";

import {
  ServicePartnerDocumentStatusBadge,
} from "@/components/service-partners/ServicePartnerDocumentStatusBadge";
import {
  Button,
} from "@/components/ui/Button";
import {
  formatDateTime,
} from "@/lib/date";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerDocument,
} from "@/types/service-partner";

interface ServicePartnerDocumentCardProps {
  readonly document: ServicePartnerDocument;
  readonly className?: string;
}

function formatFileSize(
  sizeBytes: number
): string {
  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 ** 2) {
    return `${(
      sizeBytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    sizeBytes /
    1024 ** 2
  ).toFixed(1)} MB`;
}

export function ServicePartnerDocumentCard({
  className,
  document,
}: ServicePartnerDocumentCardProps): React.JSX.Element {
  return (
    <article
      className={cn(
        "rounded-[var(--radius-lg)] border border-border bg-card p-5 shadow-[var(--shadow-card)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
          <FileText
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <ServicePartnerDocumentStatusBadge
          document={document}
        />
      </div>

      <h3 className="mt-5 break-words font-medium text-foreground">
        {document.fileName}
      </h3>

      <p className="mt-2 text-xs capitalize text-muted">
        {document.type.replace(
          /([A-Z])/g,
          " $1"
        )}
      </p>

      <dl className="mt-5 grid gap-3 border-t border-border pt-5 text-xs">
        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            File type
          </dt>

          <dd className="text-right font-medium text-foreground">
            {document.mimeType}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            File size
          </dt>

          <dd className="font-medium text-foreground">
            {formatFileSize(
              document.sizeBytes
            )}
          </dd>
        </div>

        <div className="flex justify-between gap-4">
          <dt className="text-muted">
            Uploaded
          </dt>

          <dd className="text-right font-medium text-foreground">
            {formatDateTime(
              document.uploadedAt
            )}
          </dd>
        </div>

        {document.expiresAt ? (
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              Expires
            </dt>

            <dd className="text-right font-medium text-foreground">
              {formatDateTime(
                document.expiresAt
              )}
            </dd>
          </div>
        ) : null}
      </dl>

      {document.rejectionReason ? (
        <p className="mt-4 rounded-[var(--radius-md)] border border-[color:rgb(145_59_59_/_0.3)] bg-[color:rgb(145_59_59_/_0.06)] p-3 text-xs leading-5 text-muted">
          {
            document.rejectionReason
          }
        </p>
      ) : null}

      <div className="mt-5 flex gap-3 border-t border-border pt-5">
        <Button
          asChild
          variant="outline"
          size="sm"
        >
          <a
            href={
              document.downloadURL
            }
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink
              aria-hidden="true"
              className="size-4"
            />
            Open
          </a>
        </Button>

        <Button
          asChild
          variant="ghost"
          size="sm"
        >
          <a
            href={
              document.downloadURL
            }
            download={
              document.fileName
            }
          >
            <Download
              aria-hidden="true"
              className="size-4"
            />
            Download
          </a>
        </Button>
      </div>
    </article>
  );
}
