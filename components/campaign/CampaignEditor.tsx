"use client";

import {
  useEffect,
} from "react";

import {
  useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import type {
  Campaign,
  CampaignStatus,
} from "@/types/campaign";

type CampaignEditorInput = Omit<
  Campaign,
  | "id"
  | "createdAt"
  | "updatedAt"
>;

interface CampaignEditorProps {
  readonly campaign?: Campaign | null;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: CampaignEditorInput
  ) => void | Promise<void>;
  readonly onCancel?: () => void;
}

const statusOptions = [
  {
    value: "draft",
    label: "Draft",
  },
  {
    value: "scheduled",
    label: "Scheduled",
  },
  {
    value: "active",
    label: "Active",
  },
  {
    value: "paused",
    label: "Paused",
  },
  {
    value: "completed",
    label: "Completed",
  },
  {
    value: "archived",
    label: "Archived",
  },
] as const;

const defaults: CampaignEditorInput = {
  name: "",
  slug: "",
  status: "draft",
  headline: "",
  description: "",
  heroImageURL: "",
  startsAt: "",
  endsAt: "",
  featuredStudioIds: [],
  featuredProductIds: [],
  couponId: undefined,
  landingPageId: undefined,
};

export function CampaignEditor({
  campaign,
  loading = false,
  onCancel,
  onSubmit,
}: CampaignEditorProps): React.JSX.Element {
  const {
    formState: {
      isDirty,
    },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<CampaignEditorInput>({
    defaultValues: defaults,
  });

 useEffect(() => {
  reset(
   campaign
    ?{
       name: campaign.name,
       slug: campaign.slug,
       status:
         campaign.status,
       headline:
         campaign.headline,

      description:
        campaign.description ??
        "",
      heroImageURL:
        campaign.heroImageURL ??
        "",
      startsAt:
        campaign.startsAt,
      endsAt:
        campaign.endsAt,
      featuredStudioIds:
        campaign.featuredStudioIds,
      featuredProductIds:
        campaign.featuredProductIds,
      couponId:
        campaign.couponId,
      landingPageId:
        campaign.landingPageId,
     }
   : defaults
  );
}, [campaign, reset]);

const status =
 watch("status");

return (
 <form
   className="grid gap-6"
   onSubmit={handleSubmit(
     async (input) => {
       await onSubmit(input);
     }
   )}
 >
   <div className="grid gap-5 md:grid-cols-2">
     <FormField
       label="Campaign Name"
       labelFor="campaign-name"
       required
     >
       <Input
         id="campaign-name"
         {...register("name", {

     required: true,
   })}
  />
 </FormField>

 <FormField
  label="Campaign Slug"
  labelFor="campaign-slug"
  required
 >
  <Input
    id="campaign-slug"
    {...register("slug", {
      required: true,
    })}
  />
 </FormField>
</div>

<FormField
 label="Headline"
 labelFor="campaign-headline"
 required
>
 <Input
   id="campaign-headline"
   {...register(
     "headline",
     {
       required: true,
     }
   )}
 />
</FormField>

<FormField
 label="Description"
 labelFor="campaign-description"
 optional
>
 <Textarea
   id="campaign-description"
   rows={5}
   {...register(

    "description"
  )}
 />
</FormField>

<div className="grid gap-5 md:grid-cols-3">
 <FormField
  label="Status"
  labelFor="campaign-status"
  required
 >
  <Select
    id="campaign-status"
    value={status}
    options={statusOptions}
    disabled={loading}
    onChange={(event) =>
      setValue(
        "status",
        event.target
          .value as CampaignStatus,
        {
          shouldDirty: true,
        }
      )
    }
  />
 </FormField>

 <FormField
  label="Starts At"
  labelFor="campaign-start"
  required
 >
  <Input
    id="campaign-start"
    type="datetime-local"
    {...register(
      "startsAt",
      {
        required: true,
      }
    )}
  />

 </FormField>

 <FormField
  label="Ends At"
  labelFor="campaign-end"
  required
 >
  <Input
    id="campaign-end"
    type="datetime-local"
    {...register(
      "endsAt",
      {
        required: true,
      }
    )}
  />
 </FormField>
</div>

<FormField
 label="Hero Image URL"
 labelFor="campaign-hero-image"
 optional
>
 <Input
   id="campaign-hero-image"
   type="url"
   {...register(
     "heroImageURL"
   )}
 />
</FormField>

<div className="grid gap-5 md:grid-cols-2">
 <FormField
  label="Coupon ID"
  labelFor="campaign-coupon"
  optional
 >
  <Input
    id="campaign-coupon"
    {...register(
      "couponId"

         )}
        />
       </FormField>

       <FormField
        label="Landing Page ID"
        labelFor="campaign-landing-page"
        optional
       >
        <Input
          id="campaign-landing-page"
          {...register(
            "landingPageId"
          )}
        />
       </FormField>
      </div>

   <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row
sm:justify-end">
     {onCancel ? (
       <Button
         type="button"
         variant="ghost"
         disabled={loading}
         onClick={onCancel}
       >
         Cancel
       </Button>
     ) : null}

      <Button
       type="submit"
       disabled={!isDirty}
       loading={loading}
       loadingLabel="Saving Campaign"
      >
       Save Campaign
      </Button>
    </div>
   </form>
 );
}
