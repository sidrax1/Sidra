"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  MapPin,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PUBLIC_ROUTES } from "@/constants/routes";

export interface FollowedStudio {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly city?: string;
  readonly state?: string;
  readonly logoURL?: string | null;
  readonly bannerURL?: string | null;
  readonly tagline?: string;
  readonly followerCount: number;
}

interface FollowedStudioCardProps {
  readonly studio: FollowedStudio;
  readonly loading?: boolean;
  readonly onUnfollow?: (
    studio: FollowedStudio
  ) => void | Promise<void>;
}

export function FollowedStudioCard({
  loading = false,
  onUnfollow,
  studio,
}: FollowedStudioCardProps): React.JSX.Element {
  return (
    <Card className="group overflow-hidden">
      <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-gray-100)]">
        {studio.bannerURL ? (
          <Image
            src={studio.bannerURL}
            alt=""
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.03]"
          />
        ) : null}

        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/5 to-transparent" />

        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="relative size-14 overflow-hidden rounded-full border-2 border-white/70 bg-card shadow-[var(--shadow-hover)]">
            {studio.logoURL ? (
              <Image
                src={studio.logoURL}
                alt={studio.name}
                fill
                sizes="56px"
                className="object-cover"
              />
            ) : (
              <span className="flex size-full items-center justify-center font-heading text-2xl text-foreground">
                {studio.name
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="pb-1 text-white">
            <h3 className="font-heading text-2xl font-medium tracking-[-0.025em]">
              {studio.name}
            </h3>

            {studio.city ||
            studio.state ? (
              <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-white/70">
                <MapPin
                  aria-hidden="true"
                  className="size-3.5"
                />
                {[studio.city, studio.state]
                  .filter(Boolean)
                  .join(", ")}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="grid gap-5 p-5">
        {studio.tagline ? (
          <p className="line-clamp-2 text-sm leading-6 text-muted">
            {studio.tagline}
          </p>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
          <span className="inline-flex items-center gap-2 text-xs text-muted">
            <Heart
              aria-hidden="true"
              className="size-3.5 fill-[var(--color-gold-500)] text-[var(--color-gold-500)]"
            />
            {studio.followerCount.toLocaleString(
              "en-IN"
            )}{" "}
            followers
          </span>

          <div className="flex gap-2">
            {onUnfollow ? (
              <Button
                variant="ghost"
                size="sm"
                disabled={loading}
                onClick={() => {
                  void onUnfollow(
                    studio
                  );
                }}
              >
                Unfollow
              </Button>
            ) : null}

            <Button
              asChild
              variant="outline"
              size="sm"
            >
              <Link
                href={PUBLIC_ROUTES.STUDIO(
                  studio.slug
                )}
              >
                Enter Studio
                <ArrowUpRight
                  aria-hidden="true"
                  className="size-4"
                />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
