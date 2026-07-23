"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Switch } from "@/components/ui/Switch";
import { platformSettingsSchema } from "@/lib/schemas/settings";
import type { PlatformSettings } from "@/types/settings";
import type { z } from "zod";

type PlatformSettingsInput = z.infer<typeof platformSettingsSchema>;

interface PlatformSettingsFormProps {
  readonly settings: PlatformSettings;
  readonly loading?: boolean;
  readonly onSubmit: (
    settings: PlatformSettingsInput
  ) => void | Promise<void>;
}

export function PlatformSettingsForm({
  loading = false,
  onSubmit,
  settings,
}: PlatformSettingsFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<PlatformSettingsInput>({
    resolver: zodResolver(platformSettingsSchema),
    defaultValues: settings,
  });

 useEffect(() => {
   reset(settings);
 }, [reset, settings]);

 const values = watch();

 return (
  <form
    className="grid gap-8 rounded-[var(--radius-lg)] border border-border bg-card p-6
shadow-[var(--shadow-card)] md:p-8"
    onSubmit={handleSubmit(async (input) => {
      await onSubmit(input);
      reset(input);
    })}
  >
    <header>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
        Platform Settings
      </h2>

    <p className="mt-2 text-sm leading-6 text-muted">
     Manage commercial, moderation and operational defaults.
    </p>
   </header>

   <div className="grid gap-6">
    <Switch
     checked={values.maintenanceMode}
     label="Maintenance Mode"
     description="Temporarily restrict public access while administrators remain signed in."
     onCheckedChange={(checked) =>
       setValue("maintenanceMode", checked, {
         shouldDirty: true,
       })
     }
    />

    <Switch
     checked={values.sellerApplicationsEnabled}
     label="Seller Applications"
     description="Allow new artists and studios to submit applications."
     onCheckedChange={(checked) =>
       setValue("sellerApplicationsEnabled", checked, {
         shouldDirty: true,
       })
     }
    />

    <Switch
     checked={values.productApprovalRequired}

  label="Product Approval Required"
  description="Require moderation before products become visible."
  onCheckedChange={(checked) =>
    setValue("productApprovalRequired", checked, {
      shouldDirty: true,
    })
  }
 />

 <Switch
  checked={values.reviewModerationRequired}
  label="Review Moderation Required"
  description="Hold new reviews for approval before publication."
  onCheckedChange={(checked) =>
    setValue("reviewModerationRequired", checked, {
      shouldDirty: true,
    })
  }
 />
</div>

<div className="grid gap-5 md:grid-cols-2">
 <FormField
  label="Default Commission (%)"
  labelFor="default-commission"
  required
  error={errors.defaultCommissionPercentage?.message}
 >
  <Input
    id="default-commission"
    type="number"
    min={0}
    max={100}
    step="0.01"
    {...register("defaultCommissionPercentage", {
      valueAsNumber: true,
    })}
  />
 </FormField>

 <FormField
  label="Default Shipping Fee (Paise)"
  labelFor="default-shipping-fee"
  required

  error={errors.defaultShippingFeePaise?.message}
 >
  <Input
   id="default-shipping-fee"
   type="number"
   min={0}
   step={1}
   {...register("defaultShippingFeePaise", {
     valueAsNumber: true,
   })}
  />
 </FormField>

 <FormField
  label="Free Shipping Threshold (Paise)"
  labelFor="free-shipping-threshold"
  optional
  error={errors.freeShippingThresholdPaise?.message}
 >
  <Input
    id="free-shipping-threshold"
    type="number"
    min={0}
    step={1}
    {...register("freeShippingThresholdPaise", {
      setValueAs: (value: string) =>
        value === "" ? null : Number(value),
    })}
  />
 </FormField>

 <FormField
  label="Support Email"
  labelFor="support-email"
  required
  error={errors.supportEmail?.message}
 >
  <Input
    id="support-email"
    type="email"
    {...register("supportEmail")}
  />
 </FormField>
</div>

      <FormField
       label="Legal Entity Name"
       labelFor="legal-entity-name"
       required
       error={errors.legalEntityName?.message}
      >
       <Input
         id="legal-entity-name"
         {...register("legalEntityName")}
       />
      </FormField>

    <div className="flex justify-end border-t border-border pt-6">
      <Button
       type="submit"
       disabled={!isDirty}
       loading={loading}
       loadingLabel="Saving Settings"
      >
       Save Settings
      </Button>
    </div>
   </form>
 );
}
