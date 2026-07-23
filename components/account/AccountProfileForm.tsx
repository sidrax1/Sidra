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
  Save,
  UserRound,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import {
  accountProfileSchema,
  type AccountProfileInput,
} from "@/lib/schemas/account";
import type { AccountProfile } from "@/types/account";

interface AccountProfileFormProps {
  readonly profile: AccountProfile;
  readonly loading?: boolean;
  readonly onSubmit: (
    input: AccountProfileInput
  ) => void | Promise<void>;
}

export function AccountProfileForm({
  loading = false,
  onSubmit,
  profile,
}: AccountProfileFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
    reset,
  } = useForm<AccountProfileInput>({
    resolver:
      zodResolver(
        accountProfileSchema
      ),
    defaultValues: {
      displayName:
        profile.displayName,
      firstName:
        profile.firstName ?? "",
      lastName:
        profile.lastName ?? "",
      phone:
        profile.phone ?? "",
      photoURL:
        profile.photoURL ?? null,
    },
  });

  useEffect(() => {
    reset({
      displayName:
        profile.displayName,
      firstName:
        profile.firstName ?? "",
      lastName:
        profile.lastName ?? "",
      phone:
        profile.phone ?? "",
      photoURL:
        profile.photoURL ?? null,
    });
  }, [profile, reset]);

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <UserRound
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Personal Identity
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Profile Details
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Keep the name and mobile number used for private
            commissions, delivery coordination and support accurate.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="grid gap-5"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit(input);
            reset(input);
          }
        )}
      >
        <FormField
          label="Display Name"
          labelFor="account-display-name"
          required
          error={
            errors.displayName
              ?.message
          }
        >
          <Input
            id="account-display-name"
            disabled={loading}
            autoComplete="name"
            {...register(
              "displayName"
            )}
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="First Name"
            labelFor="account-first-name"
            optional
            error={
              errors.firstName
                ?.message
            }
          >
            <Input
              id="account-first-name"
              disabled={loading}
              autoComplete="given-name"
              {...register(
                "firstName"
              )}
            />
          </FormField>

          <FormField
            label="Last Name"
            labelFor="account-last-name"
            optional
            error={
              errors.lastName
                ?.message
            }
          >
            <Input
              id="account-last-name"
              disabled={loading}
              autoComplete="family-name"
              {...register(
                "lastName"
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Mobile Number"
          labelFor="account-mobile"
          optional
          error={
            errors.phone?.message
          }
        >
          <Input
            id="account-mobile"
            type="tel"
            inputMode="numeric"
            disabled={loading}
            autoComplete="tel"
            placeholder="10-digit Indian mobile number"
            {...register("phone")}
          />
        </FormField>

        <div className="flex justify-end border-t border-border pt-5">
          <Button
            type="submit"
            disabled={!isDirty}
            loading={loading}
            loadingLabel="Saving Profile"
          >
            <Save
              aria-hidden={true}
              className="size-4"
            />
            Save Profile
          </Button>
        </div>
      </form>
    </Surface>
  );
}
