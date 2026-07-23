"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { Switch } from "@/components/ui/Switch";

export interface NotificationPreferenceValues {
  readonly emailNotifications: boolean;
  readonly pushNotifications: boolean;
  readonly orderUpdates: boolean;
  readonly studioUpdates: boolean;
  readonly marketingMessages: boolean;
}

interface NotificationPreferencesProps {
  readonly values: NotificationPreferenceValues;
  readonly loading?: boolean;
  readonly onSave: (
    values: NotificationPreferenceValues
  ) => void | Promise<void>;
}

export function NotificationPreferences({

  loading = false,
  onSave,
  values,
}: NotificationPreferencesProps): React.JSX.Element {
  const [
    preferences,
    setPreferences,
  ]=
    useState<NotificationPreferenceValues>(
      values
    );

 const updatePreference = (
   key: keyof NotificationPreferenceValues,
   checked: boolean
 ): void => {
   setPreferences(
     (current) => ({
       ...current,
       [key]: checked,
     })
   );
 };

 return (
  <section className="rounded-[var(--radius-lg)] border border-border bg-card p-6
shadow-[var(--shadow-card)] md:p-8">
    <div>
     <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
      Notification Preferences
     </h2>

    <p className="mt-2 text-sm leading-6 text-muted">
     Choose how Sidra communicates important updates.
    </p>
   </div>

   <div className="mt-7 grid gap-6">
    <Switch
     checked={
       preferences.emailNotifications
     }
     label="Email Notifications"
     description="Receive account and service notices by email."

 onCheckedChange={(
   checked
 ) =>
   updatePreference(
     "emailNotifications",
     checked
   )
 }
/>

<Switch
 checked={
   preferences.pushNotifications
 }
 label="Push Notifications"
 description="Receive real-time updates on supported devices."
 onCheckedChange={(
   checked
 ) =>
   updatePreference(
     "pushNotifications",
     checked
   )
 }
/>

<Switch
 checked={
   preferences.orderUpdates
 }
 label="Order Updates"
 description="Get notified about confirmation, production and delivery."
 onCheckedChange={(
   checked
 ) =>
   updatePreference(
     "orderUpdates",
     checked
   )
 }
/>

<Switch
 checked={

   preferences.studioUpdates
  }
  label="Studio Updates"
  description="Receive updates from studios you follow."
  onCheckedChange={(
    checked
  ) =>
    updatePreference(
      "studioUpdates",
      checked
    )
  }
 />

 <Switch
  checked={
    preferences.marketingMessages
  }
  label="Curated Recommendations"
  description="Receive carefully selected launches and collections."
  onCheckedChange={(
    checked
  ) =>
    updatePreference(
      "marketingMessages",
      checked
    )
  }
 />
</div>

<div className="mt-8 flex justify-end border-t border-border pt-6">
 <Button
  loading={loading}
  loadingLabel="Saving"
  onClick={() => {
    void onSave(
      preferences
    );
  }}
 >
  Save Preferences
 </Button>
</div>

   </section>
 );
}
