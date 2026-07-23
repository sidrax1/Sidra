import Image from "next/image";
import {
  CheckCircle2,
  EyeOff,
  FileText,
  Hammer,
  PackageCheck,
  ShieldCheck,
} from "lucide-react";

import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatDateTime } from "@/lib/date";
import { cn } from "@/lib/utils";
import type {
  CustomOrderProductionStage,
  CustomOrderProductionUpdate,
} from "@/types/custom-order-workflow";

interface CustomOrderProductionUpdateCardProps {
  readonly update: CustomOrderProductionUpdate;
  readonly className?: string;
}

const stageLabels: Record<
  CustomOrderProductionStage,
  string
> = {
  materialsPrepared:
    "Materials Prepared",
  designApproved:
    "Design Approved",
  casting: "Casting",
  curing: "Curing",
  finishing: "Finishing",
  qualityCheck:
    "Quality Check",
  packaging: "Packaging",
  completed:
    "Production Completed",
};

const stageIcons: Record<
  CustomOrderProductionStage,
  React.ComponentType<{
    readonly className?: string;
    readonly "aria-hidden"?: boolean;
  }>
> = {
  materialsPrepared: Hammer,
  designApproved:
    CheckCircle2,
  casting: Hammer,
  curing: Hammer,
  finishing: Hammer,
  qualityCheck:
    ShieldCheck,
  packaging: PackageCheck,
  completed:
    CheckCircle2,
};

function isImageURL(url: string): boolean {
  const path = url
    .split("?")[0]
    ?.toLowerCase();

  return Boolean(
    path?.endsWith(".jpg") ||
      path?.endsWith(".jpeg") ||
      path?.endsWith(".png") ||
      path?.endsWith(".webp") ||
      path?.endsWith(".avif")
  );
}

export function CustomOrderProductionUpdateCard({
  className,
  update,
}: CustomOrderProductionUpdateCardProps): React.JSX.Element {
  const StageIcon =
    stageIcons[update.stage];

  return (
    <Card
      className={cn(
        "overflow-hidden",
        className
      )}
    >
      <header className="flex flex-col gap-5 border-b border-border bg-[color:rgb(200_169_106_/_0.05)] p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)] shadow-[var(--shadow-card)]">
            <StageIcon
              aria-hidden="true"
              className="size-5"
            />
          </span>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-heading text-2xl font-medium tracking-[-0.025em] text-foreground">
                {stageLabels[update.stage]}
              </h3>

              {update.customerVisible ? (
                <Badge variant="success">
                  Collector Visible
                </Badge>
              ) : (
                <Badge variant="neutral">
                  <EyeOff
                    aria-hidden="true"
                    className="mr-1 size-3.5"
                  />
                  Internal
                </Badge>
              )}
            </div>

            <time className="mt-2 block text-xs text-muted">
              {formatDateTime(
                update.createdAt
              )}
            </time>
          </div>
        </div>

        <Badge variant="gold">
          Production Update
        </Badge>
      </header>

      <div className="grid gap-5 p-5">
        <p className="whitespace-pre-wrap text-sm leading-7 text-muted">
          {update.message}
        </p>

        {update.attachmentURLs.length >
        0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {update.attachmentURLs.map(
              (
                attachmentURL,
                index
              ) => (
                <a
                  key={`${attachmentURL}-${index}`}
                  href={attachmentURL}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-background"
                >
                  {isImageURL(
                    attachmentURL
                  ) ? (
                    <Image
                      src={attachmentURL}
                      alt={`Production update attachment ${
                        index + 1
                      }`}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="flex size-full flex-col items-center justify-center gap-3 p-5 text-center">
                      <FileText
                        aria-hidden="true"
                        className="size-8 text-[var(--color-gold-600)]"
                      />

                      <span className="text-xs font-medium text-foreground">
                        Open attachment{" "}
                        {index + 1}
                      </span>
                    </div>
                  )}
                </a>
              )
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
