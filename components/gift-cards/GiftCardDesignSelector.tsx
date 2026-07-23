"use client";

import Image from "next/image";
import { CheckCircle2 } from "lucide-react";

import { cn } from "@/lib/utils";
import type { GiftCardDesign } from "@/types/gift-card";

interface GiftCardDesignSelectorProps {
  readonly designs: readonly GiftCardDesign[];
  readonly selectedDesignId: string;
  readonly disabled?: boolean;
  readonly onChange: (
    designId: string
  ) => void;
}

export function GiftCardDesignSelector({
  designs,
  disabled = false,
  onChange,
  selectedDesignId,
}: GiftCardDesignSelectorProps): React.JSX.Element {
  return (
    <fieldset disabled={disabled}>
      <legend className="mb-4 text-sm font-medium text-foreground">
        Select Gift Card Design
      </legend>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {designs.map((design) => {
          const selected =
            design.id === selectedDesignId;

          return (
            <button
              key={design.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(design.id)}
              className={cn(
                "group overflow-hidden rounded-[var(--radius-lg)] border bg-card text-left",
                "transition-[transform,border-color,box-shadow]",
                "hover:-translate-y-0.5 hover:shadow-[var(--shadow-hover)]",
                selected
                  ? "border-[var(--color-gold-500)] shadow-[var(--shadow-gold-glow)]"
                  : "border-border"
              )}
            >
              <div className="relative aspect-[1.6/1] overflow-hidden bg-[var(--color-gray-100)]">
                <Image
                  src={design.imageURL}
                  alt={design.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
                />

                {selected ? (
                  <span className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full bg-[var(--color-gold-500)] text-[var(--color-black-900)] shadow-[var(--shadow-gold-glow)]">
                    <CheckCircle2
                      aria-hidden="true"
                      className="size-4"
                    />
                  </span>
                ) : null}
              </div>

              <p className="px-4 py-3 text-sm font-medium text-foreground">
                {design.name}
              </p>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
