"use client";

import {
  useState,
} from "react";
import {
  useForm,
} from "react-hook-form";
import {
  zodResolver,
} from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  KeyRound,
  Save,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";
import {
  changePasswordSchema,
  type ChangePasswordInput,
} from "@/lib/schemas/account";

interface ChangePasswordFormProps {
  readonly loading?: boolean;
  readonly onSubmit: (
    input: ChangePasswordInput
  ) => void | Promise<void>;
}

export function ChangePasswordForm({
  loading = false,
  onSubmit,
}: ChangePasswordFormProps): React.JSX.Element {
  const [
    revealPasswords,
    setRevealPasswords,
  ] = useState(false);

  const {
    formState: {
      errors,
      isValid,
    },
    handleSubmit,
    register,
    reset,
  } = useForm<ChangePasswordInput>({
    resolver:
      zodResolver(
        changePasswordSchema
      ),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const fieldType =
    revealPasswords
      ? "text"
      : "password";

  return (
    <Surface
      className="grid gap-6"
      shadow="hover"
    >
      <header className="flex items-start gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border border-[color:rgb(200_169_106_/_0.3)] bg-[color:rgb(200_169_106_/_0.08)] text-[var(--color-gold-600)]">
          <KeyRound
            aria-hidden={true}
            className="size-5"
          />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
            Credential Security
          </p>

          <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
            Change Password
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
            Use at least twelve characters with uppercase, lowercase,
            number and symbol combinations.
          </p>
        </div>
      </header>

      <form
        noValidate
        className="grid gap-5"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit(input);
            reset();
          }
        )}
      >
        <FormField
          label="Current Password"
          labelFor="current-password"
          required
          error={
            errors.currentPassword
              ?.message
          }
        >
          <Input
            id="current-password"
            type={fieldType}
            disabled={loading}
            autoComplete="current-password"
            {...register(
              "currentPassword"
            )}
          />
        </FormField>

        <FormField
          label="New Password"
          labelFor="new-password"
          required
          error={
            errors.newPassword
              ?.message
          }
        >
          <Input
            id="new-password"
            type={fieldType}
            disabled={loading}
            autoComplete="new-password"
            {...register(
              "newPassword"
            )}
          />
        </FormField>

        <FormField
          label="Confirm New Password"
          labelFor="confirm-password"
          required
          error={
            errors.confirmPassword
              ?.message
          }
        >
          <Input
            id="confirm-password"
            type={fieldType}
            disabled={loading}
            autoComplete="new-password"
            {...register(
              "confirmPassword"
            )}
          />
        </FormField>

        <div className="flex flex-col gap-4 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            disabled={loading}
            className="inline-flex items-center gap-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            onClick={() =>
              setRevealPasswords(
                (current) =>
                  !current
              )
            }
          >
            {revealPasswords ? (
              <EyeOff
                aria-hidden={true}
                className="size-4"
              />
            ) : (
              <Eye
                aria-hidden={true}
                className="size-4"
              />
            )}

            {revealPasswords
              ? "Hide passwords"
              : "Show passwords"}
          </button>

          <Button
            type="submit"
            disabled={!isValid}
            loading={loading}
            loadingLabel="Updating Password"
          >
            <Save
              aria-hidden={true}
              className="size-4"
            />
            Update Password
          </Button>
        </div>
      </form>
    </Surface>
  );
}
