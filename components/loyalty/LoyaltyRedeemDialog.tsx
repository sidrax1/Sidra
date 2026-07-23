"use client";

import {
  useEffect,
  useState,
} from "react";
import {
  Gift,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import {
  LoyaltyTierBadge,
} from "@/components/loyalty/LoyaltyTierBadge";
import {
  Alert,
} from "@/components/ui/Alert";
import {
  Badge,
} from "@/components/ui/Badge";
import {
  Button,
} from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import {
  cn,
} from "@/lib/utils";
import type {
  LoyaltyAccount,
  LoyaltyReward,
} from "@/types/loyalty";

interface LoyaltyRedeemDialogProps {
  readonly open: boolean;
  readonly reward: LoyaltyReward | null;
  readonly account: LoyaltyAccount | null;
  readonly loading?: boolean;
  readonly onOpenChange: (
    open: boolean
  ) => void;
  readonly onConfirm: (
    rewardId: string
  ) => void | Promise<void>;
}

export function LoyaltyRedeemDialog({
  account,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  reward,
}: LoyaltyRedeemDialogProps): React.JSX.Element {
  const [
    confirmed,
    setConfirmed,
  ] = useState(false);

  useEffect(() => {
    if (open) {
      setConfirmed(false);
    }
  }, [
    open,
    reward?.id,
  ]);

  const availablePoints =
    account?.availablePoints ??
    0;

  const remainingPoints =
    reward
      ? availablePoints -
        reward.pointsCost
      : 0;

  const sufficient =
    Boolean(
      reward &&
        account &&
        account.status ===
          "active" &&
        remainingPoints >= 0
    );

  return (
    <Dialog
      open={open}
      onOpenChange={
        onOpenChange
      }
    >
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>
            Redeem Loyalty Reward
          </DialogTitle>

          <DialogDescription>
            Review the reward value and point deduction before
            confirming redemption.
          </DialogDescription>
        </DialogHeader>

        {reward ? (
          <div className="grid gap-5">
            <div className="rounded-[var(--radius-lg)] border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.06)] p-5">
              <div className="flex items-start gap-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-card text-[var(--color-gold-600)]">
                  <Gift
                    aria-hidden={true}
                    className="size-5"
                  />
                </span>

                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
                      {reward.name}
                    </h3>

                    {reward.featured ? (
                      <Badge variant="gold">
                        <Sparkles
                          aria-hidden={true}
                          className="mr-1 size-3.5"
                        />
                        Featured
                      </Badge>
                    ) : null}
                  </div>

                  <p className="mt-2 text-sm leading-6 text-muted">
                    {reward.description}
                  </p>
                </div>
              </div>
            </div>

            <dl className="grid gap-3 rounded-[var(--radius-md)] border border-border bg-background p-5 text-sm">
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">
                  Available points
                </dt>

                <dd className="font-medium text-foreground">
                  {availablePoints.toLocaleString(
                    "en-IN"
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">
                  Redemption cost
                </dt>

                <dd className="font-medium text-[var(--color-gold-600)]">
                  -
                  {reward.pointsCost.toLocaleString(
                    "en-IN"
                  )}
                </dd>
              </div>

              <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                <dt className="font-medium text-foreground">
                  Remaining balance
                </dt>

                <dd
                  className={cn(
                    "font-heading text-2xl font-medium",
                    remainingPoints >=
                      0
                      ? "text-foreground"
                      : "text-[var(--color-error)]"
                  )}
                >
                  {remainingPoints.toLocaleString(
                    "en-IN"
                  )}
                </dd>
              </div>

              {reward.eligibility.minimumTier ? (
                <div className="flex items-center justify-between gap-4 border-t border-border pt-3">
                  <dt className="text-muted">
                    Minimum tier
                  </dt>

                  <dd>
                    <LoyaltyTierBadge
                      tier={
                        reward
                          .eligibility
                          .minimumTier
                      }
                    />
                  </dd>
                </div>
              ) : null}
            </dl>

            <Alert
              variant={
                sufficient
                  ? "success"
                  : "warning"
              }
              title={
                sufficient
                  ? "Reward can be redeemed"
                  : "Reward is currently unavailable"
              }
              description={
                sufficient
                  ? `The issued reward will remain valid for ${reward.validityDaysAfterIssue} days.`
                  : account?.status !==
                      "active"
                    ? "Your loyalty account must be active before rewards can be redeemed."
                    : "Your available point balance is insufficient for this reward."
              }
              icon={
                <ShieldCheck
                  aria-hidden={true}
                  className="size-5"
                />
              }
            />

            <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
              <input
                type="checkbox"
                checked={confirmed}
                disabled={
                  loading ||
                  !sufficient
                }
                onChange={(event) =>
                  setConfirmed(
                    event.target.checked
                  )
                }
                className="mt-1 size-4 accent-[var(--color-gold-500)]"
              />

              <span>
                <span className="block text-sm font-medium text-foreground">
                  Confirm point deduction
                </span>

                <span className="mt-1 block text-xs leading-5 text-muted">
                  I understand that the reward will deduct{" "}
                  {reward.pointsCost.toLocaleString(
                    "en-IN"
                  )}{" "}
                  points from my available balance.
                </span>
              </span>
            </label>
          </div>
        ) : null}

        <DialogFooter>
          <Button
            variant="ghost"
            disabled={loading}
            onClick={() =>
              onOpenChange(false)
            }
          >
            Cancel
          </Button>

          <Button
            disabled={
              !reward ||
              !sufficient ||
              !confirmed
            }
            loading={loading}
            loadingLabel="Redeeming Reward"
            onClick={() => {
              if (reward) {
                void onConfirm(
                  reward.id
                );
              }
            }}
          >
            <Gift
              aria-hidden={true}
              className="size-4"
            />
            Confirm Redemption
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
