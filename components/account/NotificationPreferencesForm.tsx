"use client";

import {
  useEffect,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  BellRing,
  Mail,
  Save,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { Surface } from "@/components/ui/Surface";
import {
  accountNotificationPreferencesSchema,
  type AccountNotificationPreferencesInput,
} from "@/lib/schemas/account";
import type { AccountNotificationPreferences } from "@/types/account";

interface NotificationPreferencesFormProps {
  readonly preferences: AccountNotificationPreferences;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: AccountNotificationPreferencesInput
  ) => void | Promise<void>;
}

interface PreferenceRowProps {
  readonly label: string;
  readonly description: string;
  readonly disabled?: boolean;
  readonly checked: boolean;
  readonly onChange: (
    checked: boolean
  ) => void;
}

function PreferenceRow({
  checked,
  description,
  disabled = false,
  label,
  onChange,
}: PreferenceRowProps): React.JSX.Element {
  return (
    <label className="flex cursor-pointer items-start gap-4 rounded-[var(--radius-md)] border border-border bg-background p-4">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) =>
          onChange(
            event.target.checked
          )
        }
        className="mt-1 size-4 accent-[var(--color-gold-500)]"
      />

      <span>
        <span className="block text-sm font-medium text-foreground">
          {label}
        </span>

        <span className="mt-1 block text-xs leading-5 text-muted">
          {description}
        </span>
      </span>
    </label>
  );
}

export function NotificationPreferencesForm({
  loading = false,
  onSubmit,
  preferences,
}: NotificationPreferencesFormProps): React.JSX.Element {
  const {
    formState: {
      isDirty,
    },
    handleSubmit,
    reset,
    setValue,
    watch,
  } =
    useForm<AccountNotificationPreferencesInput>(
      {
        resolver:
          zodResolver(
            accountNotificationPreferencesSchema
          ),
        defaultValues:
          preferences,
      }
    );

  useEffect(() => {
    reset(preferences);
  }, [preferences, reset]);

  const values = watch();

  function updatePreference<
    Key extends keyof AccountNotificationPreferencesInput,
  >(
    key: Key,
    value: AccountNotificationPreferencesInput[Key]
  ): void {
    setValue(key, value, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <BellRing
            aria-hidden="true"
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Communication Preferences
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Notification Settings
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Choose how Sydra keeps you informed about orders,
            commissions, followed Studios and account support.
          </p>
        </div>
      </header>

      <form
        className="grid gap-4"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit(input);
            reset(input);
          }
        )}
      >
        <PreferenceRow
          label="Order Updates"
          description="Confirmation, preparation, dispatch and delivery events."
          checked={
            values.orderUpdates
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "orderUpdates",
              checked
            )
          }
        />

        <PreferenceRow
          label="Private Commission Updates"
          description="Quote, payment and production milestones for custom orders."
          checked={
            values.customOrderUpdates
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "customOrderUpdates",
              checked
            )
          }
        />

        <PreferenceRow
          label="Followed Studio Updates"
          description="Important releases and announcements from Studios you follow."
          checked={
            values.studioUpdates
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "studioUpdates",
              checked
            )
          }
        />

        <PreferenceRow
          label="Review Updates"
          description="Moderation decisions, helpful activity and Studio responses."
          checked={
            values.reviewUpdates
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "reviewUpdates",
              checked
            )
          }
        />

        <PreferenceRow
          label="Support Updates"
          description="Replies and status changes for active support requests."
          checked={
            values.supportUpdates
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "supportUpdates",
              checked
            )
          }
        />

        <PreferenceRow
          label="In-App Notifications"
          description="Display important account activity inside Sydra."
          checked={
            values.inAppNotifications
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "inAppNotifications",
              checked
            )
          }
        />

        <PreferenceRow
          label="Editorial Email"
          description="Occasional Studio stories, craftsmanship journals and curated releases."
          checked={
            values.marketingEmail
          }
          disabled={loading}
          onChange={(checked) =>
            updatePreference(
              "marketingEmail",
              checked
            )
          }
        />

        <div className="flex items-start gap-3 rounded-[var(--radius-md)] border border-[color:rgb(62_107_82_/_0.25)] bg-[color:rgb(62_107_82_/_0.06)] p-4">
          <ShieldCheck
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0 text-[var(--color-success)]"
          />

          <div>
            <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
              <Mail
                aria-hidden="true"
                className="size-4"
              />
              Transactional email remains enabled
            </p>

            <p className="mt-1 text-xs leading-5 text-muted">
              Security, payment, legal and essential order emails
              cannot be disabled.
            </p>
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={!isDirty}
            loading={loading}
            loadingLabel="Saving Preferences"
          >
            <Save
              aria-hidden="true"
              className="size-4"
            />
            Save Preferences
          </Button>
        </div>
      </form>
    </Surface>
  );
}
