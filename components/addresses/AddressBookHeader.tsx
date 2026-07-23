import type {
  ReactNode,
} from "react";
import {
  MapPinned,
} from "lucide-react";

interface AddressBookHeaderProps {
  readonly addressCount: number;
  readonly action?: ReactNode;
}

export function AddressBookHeader({
  action,
  addressCount,
}: AddressBookHeaderProps): React.JSX.Element {
  return (
    <header className="flex flex-col gap-5 rounded-[var(--radius-xl)] border border-[color:rgb(200_169_106_/_0.26)] bg-card p-6 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:justify-between md:p-8">
      <div className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <MapPinned
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Account Preferences
          </p>

          <h1 className="mt-2 font-heading text-4xl font-medium tracking-[-0.04em] text-foreground">
            Address Book
          </h1>

          <p className="mt-2 text-sm text-muted">
            {addressCount.toLocaleString(
              "en-IN"
            )}{" "}
            saved{" "}
            {addressCount === 1
              ? "address"
              : "addresses"}
          </p>
        </div>
      </div>

      {action}
    </header>
  );
}
