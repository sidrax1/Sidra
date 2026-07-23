"use client";

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
  FileDropzone,
} from "@/components/ui/FileDropzone";
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
  submitCustomOrderSchema,
} from "@/lib/schemas/custom-order";
import type {
  z,
} from "zod";

type CustomOrderRequestInput =
  z.infer<
   typeof submitCustomOrderSchema
  >;

interface CustomOrderRequestFormProps {
  readonly categoryId?: string;
  readonly studioId?: string;
  readonly attachmentPaths?: readonly string[];
  readonly loading?: boolean;
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: CustomOrderRequestInput
  ) => void | Promise<void>;

}

export function CustomOrderRequestForm({
  attachmentPaths = [],
  categoryId = "",
  loading = false,
  onFilesSelected,
  onSubmit,
  studioId,
}: CustomOrderRequestFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
    },
    handleSubmit,
    register,
  } = useForm<CustomOrderRequestInput>({
    resolver:
      zodResolver(
        submitCustomOrderSchema
      ),
    defaultValues: {
      categoryId,
      studioId,
      title: "",
      description: "",
      quantity: 1,
      budgetMinimumPaise:
        undefined,
      budgetMaximumPaise:
        undefined,
      requiredBy: undefined,
      attachmentPaths: [
        ...attachmentPaths,
      ],
    },
  });

    return (
     <form
       noValidate
       className="grid gap-6"
       onSubmit={handleSubmit(
        async (input) => {

   await onSubmit({
     ...input,
     attachmentPaths: [
       ...attachmentPaths,
     ],
   });
   }
 )}
>
 <div className="grid gap-5 md:grid-cols-2">
   <FormField
     label="Category ID"
     labelFor="custom-order-category-id"
     required
     error={
       errors.categoryId
         ?.message
     }
   >
     <Input
       id="custom-order-category-id"
       invalid={Boolean(
         errors.categoryId
       )}
       {...register(
         "categoryId"
       )}
     />
   </FormField>

  <FormField
   label="Preferred Studio ID"
   labelFor="custom-order-studio-id"
   optional
   error={
     errors.studioId
       ?.message
   }
  >
   <Input
     id="custom-order-studio-id"
     invalid={Boolean(
       errors.studioId
     )}

       {...register(
         "studioId"
       )}
     />
    </FormField>
   </div>

   <FormField
    label="Request Title"
    labelFor="custom-order-title"
    required
    error={
      errors.title?.message
    }
   >
    <Input
      id="custom-order-title"
      invalid={Boolean(
        errors.title
      )}
      placeholder="Personalised anniversary resin tray"
      {...register("title")}
    />
   </FormField>

   <FormField
     label="Detailed Requirement"
     labelFor="custom-order-description"
     required
     error={
       errors.description
         ?.message
     }
   >
     <Textarea
       id="custom-order-description"
       rows={9}
       invalid={Boolean(
         errors.description
       )}
       placeholder="Describe the design, dimensions, colours, photographs, text and finishing
you require."
       {...register(
         "description"

  )}
 />
</FormField>

<div className="grid gap-5 md:grid-cols-3">
 <FormField
  label="Quantity"
  labelFor="custom-order-quantity"
  required
  error={
    errors.quantity
      ?.message
  }
 >
  <Input
    id="custom-order-quantity"
    type="number"
    min={1}
    step={1}
    invalid={Boolean(
      errors.quantity
    )}
    {...register(
      "quantity",
      {
        valueAsNumber: true,
      }
    )}
  />
 </FormField>

 <FormField
  label="Minimum Budget (Paise)"
  labelFor="custom-order-min-budget"
  optional
  error={
    errors
      .budgetMinimumPaise
      ?.message
  }
 >
  <Input
    id="custom-order-min-budget"
    type="number"

  min={0}
  step={1}
  invalid={Boolean(
    errors
      .budgetMinimumPaise
  )}
  {...register(
    "budgetMinimumPaise",
    {
      setValueAs: (
        value: string
      ) =>
        value === ""
         ? undefined
         : Number(
             value
           ),
    }
  )}
 />
</FormField>

<FormField
 label="Maximum Budget (Paise)"
 labelFor="custom-order-max-budget"
 optional
 error={
   errors
     .budgetMaximumPaise
     ?.message
 }
>
 <Input
   id="custom-order-max-budget"
   type="number"
   min={0}
   step={1}
   invalid={Boolean(
     errors
       .budgetMaximumPaise
   )}
   {...register(
     "budgetMaximumPaise",
     {

     setValueAs: (
       value: string
     ) =>
       value === ""
        ? undefined
        : Number(
            value
          ),
      }
    )}
  />
 </FormField>
</div>

<FormField
 label="Required By"
 labelFor="custom-order-required-by"
 optional
 error={
   errors.requiredBy
     ?.message
 }
>
 <Input
   id="custom-order-required-by"
   type="datetime-local"
   invalid={Boolean(
     errors.requiredBy
   )}
   {...register(
     "requiredBy"
   )}
 />
</FormField>

<FileDropzone
 accept={[
   "image/jpeg",
   "image/png",
   "image/webp",
   "application/pdf",
 ]}
 maximumSizeBytes={
   10 * 1024 * 1024

       }
       multiple
       disabled={
         loading ||
         !onFilesSelected
       }
       label="Add reference files"
       description="Upload inspiration images, measurements or design references."
       onFilesSelected={(
         files
       ) => {
         onFilesSelected?.(
           files
         );
       }}
      />

    <div className="flex justify-end border-t border-border pt-5">
      <Button
       type="submit"
       loading={loading}
       loadingLabel="Submitting Request"
      >
       Submit Custom Request
      </Button>
    </div>
   </form>
 );
}
