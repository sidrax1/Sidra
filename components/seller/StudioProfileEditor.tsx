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
  Button,
} from "@/components/ui/Button";

import {

  FormField,
} from "@/components/ui/FormField";

import {
  Input,
} from "@/components/ui/Input";

import {
  Textarea,
} from "@/components/ui/Textarea";

import {
  updateStudioSchema,
} from "@/lib/schemas/studio";

import type {
  Studio,
} from "@/types/studio";

import type {
  z,
} from "zod";

type StudioProfileInput =
  z.infer<typeof updateStudioSchema>;

interface StudioProfileEditorProps {
  readonly studio: Studio;
  readonly loading?: boolean;
  readonly onSubmit: (
    values: StudioProfileInput
  ) => void | Promise<void>;
}

export function StudioProfileEditor({
  loading = false,
  onSubmit,
  studio,
}: StudioProfileEditorProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },

   handleSubmit,
   register,
   reset,
 } = useForm<StudioProfileInput>({
   resolver:
     zodResolver(updateStudioSchema),
   defaultValues: {
     name: studio.name,
     slug: studio.slug,
     description: studio.description,
     instagramURL: studio.instagramURL ?? null,
   },
 });

 useEffect(() => {
   reset({
     name: studio.name,
     slug: studio.slug,
     description: studio.description,
     instagramURL: studio.instagramURL ?? null,
   });
 }, [reset, studio]);

 return (
  <form
    className="grid gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-6
shadow-[var(--shadow-card)] md:p-8"
    noValidate
    onSubmit={handleSubmit(async (values) => {
      await onSubmit(values);
      reset(values);
    })}
  >
    <header>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
        Studio Profile
      </h2>

    <p className="mt-2 text-sm leading-6 text-muted">
     Present your studio story with clarity, craft and restraint.
    </p>
   </header>

   <div className="grid gap-5 md:grid-cols-2">

 <FormField
  label="Studio Name"
  labelFor="studio-name"
  required
  error={errors.name?.message}
 >
  <Input
    id="studio-name"
    invalid={Boolean(errors.name)}
    {...register("name")}
  />
 </FormField>

 <FormField
  label="Studio URL"
  labelFor="studio-slug"
  required
  error={errors.slug?.message}
 >
  <Input
    id="studio-slug"
    invalid={Boolean(errors.slug)}
    {...register("slug")}
  />
 </FormField>
</div>

<FormField
 label="Studio Description"
 labelFor="studio-description"
 required
 error={errors.description?.message}
>
 <Textarea
   id="studio-description"
   rows={8}
   invalid={Boolean(errors.description)}
   {...register("description")}
 />
</FormField>

<FormField
 label="Instagram URL"
 labelFor="studio-instagram"

       optional
       error={errors.instagramURL?.message}
      >
       <Input
        id="studio-instagram"
        type="url"
        invalid={Boolean(errors.instagramURL)}
        {...register("instagramURL")}
       />
      </FormField>

    <div className="flex justify-end border-t border-border pt-6">
      <Button
       type="submit"
       disabled={!isDirty}
       loading={loading}
       loadingLabel="Saving Studio"
      >
       Save Studio Profile
      </Button>
    </div>
   </form>
 );
}
