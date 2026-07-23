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
import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import type { Banner } from "@/types/banner";

interface BannerEditorInput {
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  readonly mobileImage: string;
  readonly buttonLabel: string;
  readonly buttonURL: string;
  readonly active: boolean;
  readonly priority: number;
}

interface BannerEditorProps {
  readonly banner?: Banner | null;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: BannerEditorInput
  ) => void | Promise<void>;
  readonly onCancel?: () => void;
}

const defaults: BannerEditorInput = {
  title: "",
  subtitle: "",
  image: "",
  mobileImage: "",
  buttonLabel: "",
  buttonURL: "",
  active: true,
  priority: 0,
};

export function BannerEditor({
 banner,
 loading = false,

  onCancel,
  onSubmit,
}: BannerEditorProps): React.JSX.Element {
  const {
    formState: {
      isDirty,
    },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<BannerEditorInput>({
    defaultValues: defaults,
  });

 useEffect(() => {
  if (!banner) {
    reset(defaults);
    return;
  }

   reset({
     title: banner.title,
     subtitle:
       banner.subtitle ?? "",
     image: banner.image,
     mobileImage:
       banner.mobileImage ?? "",
     buttonLabel:
       banner.buttonLabel ?? "",
     buttonURL:
       banner.buttonUrl ?? "",
     active: banner.active,
     priority:
       banner.priority,
   });
 }, [banner, reset]);

 const active =
  watch("active");

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
     label="Banner Title"
     labelFor="banner-title"
     required
   >
     <Input
       id="banner-title"
       {...register("title", {
         required: true,
       })}
     />
   </FormField>

  <FormField
   label="Priority"
   labelFor="banner-priority"
   required
  >
   <Input
     id="banner-priority"
     type="number"
     min={0}
     step={1}
     {...register(
       "priority",
       {
         valueAsNumber: true,
       }
     )}
   />
  </FormField>
 </div>

 <FormField
  label="Subtitle"
  labelFor="banner-subtitle"

 optional
>
 <Textarea
  id="banner-subtitle"
  rows={4}
  {...register("subtitle")}
 />
</FormField>

<FormField
 label="Desktop Image URL"
 labelFor="banner-image"
 required
>
 <Input
   id="banner-image"
   type="url"
   {...register("image", {
     required: true,
   })}
 />
</FormField>

<FormField
 label="Mobile Image URL"
 labelFor="banner-mobile-image"
 optional
>
 <Input
   id="banner-mobile-image"
   type="url"
   {...register(
     "mobileImage"
   )}
 />
</FormField>

<div className="grid gap-5 md:grid-cols-2">
 <FormField
  label="Button Label"
  labelFor="banner-button-label"
  optional
 >
  <Input

      id="banner-button-label"
      {...register(
        "buttonLabel"
      )}
     />
    </FormField>

    <FormField
     label="Button URL"
     labelFor="banner-button-url"
     optional
    >
     <Input
       id="banner-button-url"
       {...register(
         "buttonURL"
       )}
     />
    </FormField>
   </div>

   <Switch
    checked={active}
    disabled={loading}
    label="Banner active"
    description="Active banners may appear on public marketplace surfaces."
    onCheckedChange={(checked) =>
      setValue(
        "active",
        checked,
        {
          shouldDirty: true,
        }
      )
    }
   />

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
       loadingLabel="Saving Banner"
      >
       Save Banner
      </Button>
    </div>
   </form>
 );
}
