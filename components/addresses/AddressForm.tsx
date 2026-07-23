"use client";

import {
  useForm,
} from "react-hook-form";

import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Surface } from "@/components/ui/Surface";
import type {
  AddressType,
  CustomerAddress,
} from "@/components/addresses/AddressCard";

export interface AddressFormInput {
  readonly type: AddressType;
  readonly fullName: string;
  readonly mobile: string;
  readonly line1: string;
  readonly line2?: string;
  readonly landmark?: string;
  readonly city: string;
  readonly state: string;
  readonly postalCode: string;
  readonly country: "India";
  readonly isDefault: boolean;
}

interface AddressFormProps {
  readonly address?: CustomerAddress;
  readonly loading?: boolean;
  readonly onCancel?: () => void;
  readonly onSubmit: (
    input: AddressFormInput
  ) => void | Promise<void>;
}

const addressTypeOptions = [
  {
    value: "home",
    label: "Home",
  },
  {
    value: "work",
    label: "Work",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

export function AddressForm({
  address,
  loading = false,
  onCancel,
  onSubmit,
}: AddressFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
      isDirty,
    },
    handleSubmit,
    register,
  } = useForm<AddressFormInput>({
    defaultValues: {
      type:
        address?.type ?? "home",
      fullName:
        address?.fullName ?? "",
      mobile:
        address?.mobile ?? "",
      line1:
        address?.line1 ?? "",
      line2:
        address?.line2 ?? "",
      landmark:
        address?.landmark ?? "",
      city:
        address?.city ?? "",
      state:
        address?.state ?? "",
      postalCode:
        address?.postalCode ?? "",
      country: "India",
      isDefault:
        address?.isDefault ?? false,
    },
  });

  return (
    <Surface className="grid gap-6" shadow="hover">
      <header>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-gold-600)]">
          Delivery Details
        </p>

        <h2 className="mt-2 font-heading text-3xl font-medium tracking-[-0.03em] text-foreground">
          {address
            ? "Edit Address"
            : "Add Address"}
        </h2>
      </header>

      <form
        noValidate
        className="grid gap-5"
        onSubmit={handleSubmit(
          async (input) => {
            await onSubmit({
              ...input,
              fullName:
                input.fullName.trim(),
              mobile:
                input.mobile.trim(),
              line1:
                input.line1.trim(),
              line2:
                input.line2?.trim() ||
                undefined,
              landmark:
                input.landmark?.trim() ||
                undefined,
              city:
                input.city.trim(),
              state:
                input.state.trim(),
              postalCode:
                input.postalCode.trim(),
              country: "India",
            });
          }
        )}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FormField
            label="Address Type"
            labelFor="address-type"
            required
          >
            <Select
              id="address-type"
              options={
                addressTypeOptions
              }
              disabled={loading}
              {...register("type")}
            />
          </FormField>

          <FormField
            label="Full Name"
            labelFor="address-full-name"
            required
            error={
              errors.fullName?.message
            }
          >
            <Input
              id="address-full-name"
              disabled={loading}
              {...register(
                "fullName",
                {
                  required:
                    "Full name is required.",
                  minLength: {
                    value: 2,
                    message:
                      "Enter a valid name.",
                  },
                }
              )}
            />
          </FormField>
        </div>

        <FormField
          label="Mobile Number"
          labelFor="address-mobile"
          required
          error={
            errors.mobile?.message
          }
        >
          <Input
            id="address-mobile"
            type="tel"
            inputMode="numeric"
            disabled={loading}
            {...register("mobile", {
              required:
                "Mobile number is required.",
              pattern: {
                value: /^[6-9]\d{9}$/,
                message:
                  "Enter a valid Indian mobile number.",
              },
            })}
          />
        </FormField>

        <FormField
          label="Address Line 1"
          labelFor="address-line-1"
          required
          error={
            errors.line1?.message
          }
        >
          <Input
            id="address-line-1"
            disabled={loading}
            {...register("line1", {
              required:
                "Address line is required.",
              minLength: {
                value: 5,
                message:
                  "Enter a complete address.",
              },
            })}
          />
        </FormField>

        <FormField
          label="Address Line 2"
          labelFor="address-line-2"
          optional
        >
          <Input
            id="address-line-2"
            disabled={loading}
            {...register("line2")}
          />
        </FormField>

        <FormField
          label="Landmark"
          labelFor="address-landmark"
          optional
        >
          <Input
            id="address-landmark"
            disabled={loading}
            {...register("landmark")}
          />
        </FormField>

        <div className="grid gap-5 md:grid-cols-3">
          <FormField
            label="City"
            labelFor="address-city"
            required
            error={
              errors.city?.message
            }
          >
            <Input
              id="address-city"
              disabled={loading}
              {...register("city", {
                required:
                  "City is required.",
              })}
            />
          </FormField>

          <FormField
            label="State"
            labelFor="address-state"
            required
            error={
              errors.state?.message
            }
          >
            <Input
              id="address-state"
              disabled={loading}
              {...register("state", {
                required:
                  "State is required.",
              })}
            />
          </FormField>

          <FormField
            label="Postal Code"
            labelFor="address-postal-code"
            required
            error={
              errors.postalCode
                ?.message
            }
          >
            <Input
              id="address-postal-code"
              inputMode="numeric"
              disabled={loading}
              {...register(
                "postalCode",
                {
                  required:
                    "Postal code is required.",
                  pattern: {
                    value:
                      /^[1-9][0-9]{5}$/,
                    message:
                      "Enter a valid six-digit PIN code.",
                  },
                }
              )}
            />
          </FormField>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border border-border bg-background p-4">
          <input
            type="checkbox"
            disabled={loading}
            className="mt-1 size-4 accent-[var(--color-gold-500)]"
            {...register(
              "isDefault"
            )}
          />

          <span>
            <span className="block text-sm font-medium text-foreground">
              Set as default address
            </span>

            <span className="mt-1 block text-xs leading-5 text-muted">
              This address will be selected automatically during checkout.
            </span>
          </span>
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
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
            disabled={
              address
                ? !isDirty
                : false
            }
            loading={loading}
            loadingLabel="Saving Address"
          >
            Save Address
          </Button>
        </div>
      </form>
    </Surface>
  );
}
