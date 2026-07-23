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
  updateProfileSchema,
} from "@/lib/schemas/auth";

import type {
  User,
} from "@/types/user";

import type {
  z,
} from "zod";

type ProfileInput =
  z.infer<
   typeof updateProfileSchema
  >;

interface ProfileFormProps {
  readonly user: User;
  readonly loading?: boolean;
  readonly onSubmit: (
   input: ProfileInput

    ) => void | Promise<void>;
}

export function ProfileForm({
  loading = false,
  onSubmit,
  user,
}: ProfileFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    reset,
  } = useForm<ProfileInput>({
    resolver:
      zodResolver(
        updateProfileSchema
      ),
    defaultValues: {
      displayName:
        user.displayName,
      phoneNumber:
        user.phoneNumber ?? "",
      photoURL:
        user.photoURL ?? null,
    },
  });

    useEffect(() => {
      reset({
        displayName:
          user.displayName,
        phoneNumber:
          user.phoneNumber ?? "",
        photoURL:
          user.photoURL ?? null,
      });
    }, [reset, user]);

    return (
     <form

   className="grid gap-6 rounded-[var(--radius-lg)] border border-border bg-card p-6
shadow-[var(--shadow-card)] md:p-8"
   onSubmit={handleSubmit(
     async (input) => {
       await onSubmit(input);
       reset(input);
     }
   )}
  >
   <div>
     <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Personal Details
     </h2>

    <p className="mt-2 text-sm leading-6 text-muted">
     Keep your contact and profile information current.
    </p>
   </div>

   <FormField
    label="Display Name"
    labelFor="profile-display-name"
    required
    error={
      errors.displayName
        ?.message
    }
   >
    <Input
      id="profile-display-name"
      autoComplete="name"
      invalid={
        Boolean(
          errors.displayName
        )
      }
      {...register(
        "displayName"
      )}
    />
   </FormField>

   <FormField
    label="Mobile Number"

 labelFor="profile-phone"
 optional
 error={
   errors.phoneNumber
     ?.message
 }
>
 <Input
   id="profile-phone"
   inputMode="numeric"
   autoComplete="tel"
   invalid={
     Boolean(
       errors.phoneNumber
     )
   }
   {...register(
     "phoneNumber"
   )}
 />
</FormField>

<FormField
 label="Profile Image URL"
 labelFor="profile-photo-url"
 optional
 error={
   errors.photoURL?.message
 }
>
 <Input
   id="profile-photo-url"
   type="url"
   invalid={
     Boolean(
       errors.photoURL
     )
   }
   {...register(
     "photoURL"
   )}
 />
</FormField>

    <div className="flex justify-end border-t border-border pt-6">
      <Button
       type="submit"
       disabled={!isDirty}
       loading={loading}
       loadingLabel="Saving"
      >
       Save Changes
      </Button>
    </div>
   </form>
 );
}
