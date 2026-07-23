"use client";

import {
  SearchCheck,
  Share2,
} from "lucide-react";

import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Surface } from "@/components/ui/Surface";

import { Switch } from "@/components/ui/Switch";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import type { CmsSeo } from "@/types/cms";

interface CmsSeoEditorProps {
  readonly value: CmsSeo;
  readonly disabled?: boolean;
  readonly className?: string;
  readonly onChange: (value: CmsSeo) => void;
}

interface CharacterCounterProps {
  readonly current: number;
  readonly recommendedMinimum: number;
  readonly recommendedMaximum: number;
}

function CharacterCounter({
  current,
  recommendedMaximum,
  recommendedMinimum,
}: CharacterCounterProps): React.JSX.Element {
  const valid =
   current >= recommendedMinimum &&
   current <= recommendedMaximum;

    return (
      <span
       className={cn(
         "text-xs",
         valid
           ? "text-[var(--color-success)]"
           : "text-[var(--color-warning)]"
       )}
      >
       {current}/{recommendedMaximum}
      </span>
    );
}

export function CmsSeoEditor({
 className,
 disabled = false,

  onChange,
  value,
}: CmsSeoEditorProps): React.JSX.Element {
  return (
   <Surface
     className={cn(
       "grid gap-6",
       className
     )}
   >
     <header className="flex items-start gap-4">
       <span className="flex size-11 shrink-0 items-center justify-center rounded-full border
border-[color:rgb(200_169_106_/_0.28)] bg-[color:rgb(200_169_106_/_0.08)]
text-[var(--color-gold-600)]">
        <SearchCheck
          aria-hidden="true"
          className="size-5"
        />
       </span>

     <div>
      <h2 className="font-heading text-3xl font-medium tracking-[-0.03em]">
       Search & Social
      </h2>

     <p className="mt-2 text-sm leading-6 text-muted">
      Control how this content appears in search engines and social
      previews.
     </p>
    </div>
   </header>

   <FormField
    label="SEO Title"
    labelFor="cms-seo-title"
    required
    description={
      <CharacterCounter
       current={value.title.length}
       recommendedMinimum={30}
       recommendedMaximum={70}
      />
    }
   >

 <Input
  id="cms-seo-title"
  value={value.title}
  disabled={disabled}
  maxLength={70}
  onChange={(event) => {
    onChange({
      ...value,
      title: event.target.value,
    });
  }}
 />
</FormField>

<FormField
 label="Meta Description"
 labelFor="cms-seo-description"
 required
 description={
   <CharacterCounter
     current={value.description.length}
     recommendedMinimum={120}
     recommendedMaximum={170}
   />
 }
>
 <Textarea
   id="cms-seo-description"
   value={value.description}
   disabled={disabled}
   maxLength={170}
   rows={5}
   onChange={(event) => {
     onChange({
       ...value,
       description: event.target.value,
     });
   }}
 />
</FormField>

<FormField
 label="Social Preview Image"
 labelFor="cms-seo-image"

     optional
    >
     <div className="relative">
      <Share2
       aria-hidden="true"
       className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2
text-muted"
      />

        <Input
         id="cms-seo-image"
         type="url"
         value={value.imageURL ?? ""}
         disabled={disabled}
         className="pl-11"
         onChange={(event) => {
           onChange({
             ...value,
             imageURL: event.target.value || undefined,
           });
         }}
        />
       </div>
      </FormField>

    <Switch
     checked={value.noIndex}
     disabled={disabled}
     label="Prevent search indexing"
     description="Use this only for private, temporary or duplicate content."
     onCheckedChange={(checked) => {
       onChange({
         ...value,
         noIndex: checked,
       });
     }}
    />
   </Surface>
 );
}
