"use client";

import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Expand,
  X,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

import {
  IconButton,
} from "@/components/ui/IconButton";
import {
  cn,
} from "@/lib/utils";

interface ReviewMediaGalleryProps {
  readonly images: readonly string[];
  readonly productTitle: string;
  readonly className?: string;
}

export function ReviewMediaGallery({
  className,
  images,
  productTitle,
}: ReviewMediaGalleryProps): React.JSX.Element | null {
  const [
    activeIndex,
    setActiveIndex,
  ] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (
      activeIndex === null
    ) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ): void {
      if (
        event.key === "Escape"
      ) {
        setActiveIndex(null);
      }

      if (
        event.key ===
        "ArrowLeft"
      ) {
        setActiveIndex(
          (current) =>
            current === null
              ? null
              : (current -
                    1 +
                    images.length) %
                images.length
        );
      }

      if (
        event.key ===
        "ArrowRight"
      ) {
        setActiveIndex(
          (current) =>
            current === null
              ? null
              : (current + 1) %
                images.length
        );
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    activeIndex,
    images.length,
  ]);

  if (
    images.length === 0
  ) {
    return null;
  }

  return (
    <>
      <div
        className={cn(
          "grid grid-cols-3 gap-3 md:grid-cols-5",
          className
        )}
      >
        {images.map(
          (
            imageURL,
            index
          ) => (
            <button
              key={`${imageURL}-${index}`}
              type="button"
              aria-label={`Open review image ${index + 1}`}
              className="group relative aspect-square overflow-hidden rounded-[var(--radius-md)] border border-border bg-background"
              onClick={() =>
                setActiveIndex(
                  index
                )
              }
            >
              <Image
                src={imageURL}
                alt={`${productTitle} customer review image ${index + 1}`}
                fill
                sizes="(max-width: 768px) 33vw, 20vw"
                className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.05]"
              />

              <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition-[background-color,opacity] group-hover:bg-black/35 group-hover:opacity-100">
                <Expand
                  aria-hidden={true}
                  className="size-5 text-white"
                />
              </span>
            </button>
          )
        )}
      </div>

      {activeIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Review image viewer"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-xl"
        >
          <div className="absolute right-4 top-4">
            <IconButton
              label="Close image viewer"
              icon={
                <X
                  aria-hidden={true}
                />
              }
              appearance="ghost"
              className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
              onClick={() =>
                setActiveIndex(
                  null
                )
              }
            />
          </div>

          {images.length > 1 ? (
            <>
              <div className="absolute left-4 top-1/2 -translate-y-1/2">
                <IconButton
                  label="Previous image"
                  icon={
                    <ChevronLeft
                      aria-hidden={true}
                    />
                  }
                  appearance="ghost"
                  className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
                  onClick={() =>
                    setActiveIndex(
                      (
                        activeIndex -
                          1 +
                          images.length
                      ) %
                        images.length
                    )
                  }
                />
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <IconButton
                  label="Next image"
                  icon={
                    <ChevronRight
                      aria-hidden={true}
                    />
                  }
                  appearance="ghost"
                  className="border border-white/15 bg-white/10 text-white hover:bg-white/20"
                  onClick={() =>
                    setActiveIndex(
                      (activeIndex +
                        1) %
                        images.length
                    )
                  }
                />
              </div>
            </>
          ) : null}

          <div className="relative h-[min(82vh,900px)] w-[min(90vw,1100px)]">
            <Image
              src={
                images[
                  activeIndex
                ]
              }
              alt={`${productTitle} review image ${activeIndex + 1}`}
              fill
              sizes="90vw"
              priority
              className="object-contain"
            />
          </div>

          <div className="absolute bottom-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs text-white/80 backdrop-blur-xl">
            {activeIndex + 1} /{" "}
            {images.length}
          </div>
        </div>
      ) : null}
    </>
  );
}
