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
  Checkbox,
} from "@/components/ui/Checkbox";

import {
  FormField,
} from "@/components/ui/FormField";

import {
  Input,
} from "@/components/ui/Input";

import {
  addressSchema,
  type AddressInput,
} from "@/lib/schemas/address";

import type {
  Address,
} from "@/types/address";

interface AddressFormProps {
  readonly address?: Address | null;
  readonly loading?: boolean;
  readonly submitLabel?: string;
  readonly onSubmit: (
    input: AddressInput
  ) => void | Promise<void>;

    readonly onCancel?: () => void;
}

const defaultValues: AddressInput = {
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  landmark: "",
  city: "",
  district: "",
  state: "",
  country: "India",
  postalCode: "",
  defaultShipping: false,
  defaultBilling: false,
};

export function AddressForm({
  address,
  loading = false,
  onCancel,
  onSubmit,
  submitLabel = "Save Address",
}: AddressFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
    },
    handleSubmit,
    register,
    reset,
    watch,
  } = useForm<AddressInput>({
    resolver:
      zodResolver(
        addressSchema
      ),
    defaultValues,
  });

    useEffect(() => {
     if (!address) {
       reset(defaultValues);

     return;
 }

  reset({
    fullName:
      address.fullName,
    phone:
      address.phone,
    email:
      address.email,
    line1:
      address.line1,
    line2:
      address.line2 ?? "",
    landmark:
      address.landmark ?? "",
    city:
      address.city,
    district:
      address.district ?? "",
    state:
      address.state,
    country:
      address.country,
    postalCode:
      address.postalCode,
    defaultShipping:
      address.defaultShipping,
    defaultBilling:
      address.defaultBilling,
  });
}, [address, reset]);

const defaultShipping =
 watch(
   "defaultShipping"
 );

const defaultBilling =
 watch(
   "defaultBilling"
 );

return (

<form
 noValidate
 className="grid gap-6"
 onSubmit={handleSubmit(
   async (input) => {
     await onSubmit(input);
   }
 )}
>
 <div className="grid gap-5 md:grid-cols-2">
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
       autoComplete="name"
       invalid={
         Boolean(
           errors.fullName
         )
       }
       {...register(
         "fullName"
       )}
     />
   </FormField>

  <FormField
   label="Mobile Number"
   labelFor="address-phone"
   required
   error={
     errors.phone?.message
   }
  >
   <Input
     id="address-phone"
     inputMode="numeric"
     autoComplete="tel"

    invalid={
      Boolean(
        errors.phone
      )
    }
    {...register("phone")}
  />
 </FormField>
</div>

<FormField
 label="Email"
 labelFor="address-email"
 optional
 error={
   errors.email?.message
 }
>
 <Input
   id="address-email"
   type="email"
   autoComplete="email"
   invalid={
     Boolean(errors.email)
   }
   {...register("email")}
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
   autoComplete="address-line1"
   invalid={
     Boolean(errors.line1)
   }
   {...register("line1")}

 />
</FormField>

<FormField
 label="Address Line 2"
 labelFor="address-line-2"
 optional
 error={
   errors.line2?.message
 }
>
 <Input
   id="address-line-2"
   autoComplete="address-line2"
   invalid={
     Boolean(errors.line2)
   }
   {...register("line2")}
 />
</FormField>

<FormField
 label="Landmark"
 labelFor="address-landmark"
 optional
 error={
   errors.landmark?.message
 }
>
 <Input
   id="address-landmark"
   invalid={
     Boolean(
       errors.landmark
     )
   }
   {...register(
     "landmark"
   )}
 />
</FormField>

<div className="grid gap-5 md:grid-cols-2">
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
   autoComplete="address-level2"
   invalid={
     Boolean(errors.city)
   }
   {...register("city")}
 />
</FormField>

<FormField
 label="District"
 labelFor="address-district"
 optional
 error={
   errors.district
     ?.message
 }
>
 <Input
   id="address-district"
   invalid={
     Boolean(
       errors.district
     )
   }
   {...register(
     "district"
   )}
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
       autoComplete="address-level1"
       invalid={
         Boolean(errors.state)
       }
       {...register("state")}
     />
    </FormField>

    <FormField
     label="PIN Code"
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
       autoComplete="postal-code"
       invalid={
         Boolean(
           errors.postalCode
         )
       }
       {...register(
         "postalCode"
       )}
     />
    </FormField>
   </div>

    <div className="grid gap-4 rounded-[var(--radius-md)] border border-border
bg-[color:rgb(200_169_106_/_0.05)] p-5">
     <Checkbox
      checked={
        defaultShipping
      }

        label="Use as default shipping address"
        {...register(
          "defaultShipping"
        )}
       />

       <Checkbox
        checked={defaultBilling}
        label="Use as default billing address"
        {...register(
          "defaultBilling"
        )}
       />
      </div>

   <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row
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
       loading={loading}
       loadingLabel="Saving"
      >
       {submitLabel}
      </Button>
    </div>
   </form>
 );
}
