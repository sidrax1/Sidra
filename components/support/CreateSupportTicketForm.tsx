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
  Select,
} from "@/components/ui/Select";
import {
  Textarea,
} from "@/components/ui/Textarea";
import {
  createSupportTicketSchema,
} from "@/lib/schemas/support";
import type {

  z,
} from "zod";

type SupportTicketInput =
  z.infer<
   typeof createSupportTicketSchema
  >;

interface CreateSupportTicketFormProps {
  readonly loading?: boolean;
  readonly attachmentPaths?: readonly string[];
  readonly onFilesSelected?: (
    files: readonly File[]
  ) => void;
  readonly onSubmit: (
    input: SupportTicketInput
  ) => void | Promise<void>;
}

const categoryOptions = [
 {
   value: "account",
   label: "Account",
 },
 {
   value: "order",
   label: "Order",
 },
 {
   value: "payment",
   label: "Payment",
 },
 {
   value: "product",
   label: "Product",
 },
 {
   value: "studio",
   label: "Studio",
 },
 {
   value: "customOrder",
   label: "Custom Order",
 },

 {
    value: "technical",
    label: "Technical",
  },
  {
    value: "other",
    label: "Other",
  },
] as const;

const priorityOptions = [
  {
    value: "low",
    label: "Low",
  },
  {
    value: "normal",
    label: "Normal",
  },
  {
    value: "high",
    label: "High",
  },
  {
    value: "urgent",
    label: "Urgent",
  },
] as const;

export function CreateSupportTicketForm({
  attachmentPaths = [],
  loading = false,
  onFilesSelected,
  onSubmit,
}: CreateSupportTicketFormProps): React.JSX.Element {
  const {
    formState: {
      errors,
    },
    handleSubmit,
    register,
  } = useForm<SupportTicketInput>({
    resolver:
      zodResolver(

      createSupportTicketSchema
    ),
  defaultValues: {
    subject: "",
    category: "other",
    description: "",
    priority: "normal",
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
   <FormField
     label="Subject"
     labelFor="support-ticket-subject"
     required
     error={
       errors.subject?.message
     }
   >
     <Input
       id="support-ticket-subject"
       invalid={Boolean(
         errors.subject
       )}
       {...register("subject")}
     />
   </FormField>

<div className="grid gap-5 md:grid-cols-2">
 <FormField
  label="Category"
  labelFor="support-ticket-category"
  required
  error={
    errors.category
      ?.message
  }
 >
  <Select
    id="support-ticket-category"
    options={categoryOptions}
    invalid={Boolean(
      errors.category
    )}
    {...register(
      "category"
    )}
  />
 </FormField>

 <FormField
  label="Priority"
  labelFor="support-ticket-priority"
  required
  error={
    errors.priority
      ?.message
  }
 >
  <Select
    id="support-ticket-priority"
    options={priorityOptions}
    invalid={Boolean(
      errors.priority
    )}
    {...register(
      "priority"
    )}
  />
 </FormField>
</div>

<FormField
 label="Description"
 labelFor="support-ticket-description"
 required
 error={
   errors.description
     ?.message
 }
>
 <Textarea
   id="support-ticket-description"
   rows={8}
   invalid={Boolean(
     errors.description
   )}
   {...register(
     "description"
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
 label="Attach supporting files"
 description="Add screenshots, photographs or PDF documents up to 10 MB each."
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
       loadingLabel="Submitting Ticket"
      >
       Submit Support Request
      </Button>
    </div>
   </form>
 );
}
