import {
  ExternalLink,
  FileCheck2,
  FileText,
} from "lucide-react";

import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  EmptyState,
} from "@/components/ui/EmptyState";
import {
  cn,
} from "@/lib/utils";
import type {
  ServicePartnerApplication,
} from "@/types/service-partner";

interface ServicePartnerApplicationDocumentsProps {
  readonly application: ServicePartnerApplication;
  readonly documentURLs?: Readonly<
    Record<string, string>
  >;
  readonly className?: string;
}

function getDocumentName(
  path: string,
  index: number
): string {
  const decodedPath =
    decodeURIComponent(path);

  const finalSegment =
    decodedPath
      .split("/")
      .filter(Boolean)
      .at(-1);

  return (
    finalSegment ||
    `Verification Document ${index + 1}`
  );
}

export function ServicePartnerApplicationDocuments({
  application,
  className,
  documentURLs = {},
}: ServicePartnerApplicationDocumentsProps): React.JSX.Element {
  if (
    application.documentPaths
      .length === 0
  ) {
    return (
      <EmptyState
        title="No application documents"
        description="The applicant has not provided any verification documents."
      />
    );
  }

  return (
    <section
      className={cn(
        "overflow-hidden rounded-[var(--radius-xl)] border border-border bg-card shadow-[var(--shadow-card)]",
        className
      )}
    >
      <header className="flex items-center justify-between gap-4 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5">
        <div className="flex items-center gap-3">
          <FileCheck2
            aria-hidden={true}
            className="size-5 text-[var(--color-gold-600)]"
          />

          <h2 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
            Application Documents
          </h2>
        </div>

        <Badge variant="neutral">
          {
            application.documentPaths
              .length
          }{" "}
          files
        </Badge>
      </header>

      <div className="grid gap-4 p-6 md:grid-cols-2">
        {application.documentPaths.map(
          (
            documentPath,
            index
          ) => {
            const documentURL =
              documentURLs[
                documentPath
              ];

            return (
              <article
                key={documentPath}
                className="rounded-[var(--radius-lg)] border border-border bg-background p-5 transition-[border-color,box-shadow] hover:border-[color:rgb(200_169_106_/_0.38)] hover:shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.07)] text-[var(--color-gold-600)]">
                    <FileText
                      aria-hidden={true}
                      className="size-5"
                    />
                  </span>

                  <Badge
                    variant={
                      documentURL
                        ? "success"
                        : "warning"
                    }
                  >
                    {documentURL
                      ? "Available"
                      : "URL Pending"}
                  </Badge>
                </div>

                <h3 className="mt-5 break-words text-sm font-medium text-foreground">
                  {getDocumentName(
                    documentPath,
                    index
                  )}
                </h3>

                <p className="mt-2 break-all font-mono text-[11px] leading-5 text-muted">
                  {documentPath}
                </p>

                {documentURL ? (
                  <div className="mt-5 border-t border-border pt-5">
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                    >
                      <a
                        href={
                          documentURL
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <ExternalLink
                          aria-hidden={true}
                          className="size-4"
                        />
                        Open Document
                      </a>
                    </Button>
                  </div>
                ) : null}
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}
